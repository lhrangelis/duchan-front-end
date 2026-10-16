// Lógica de horário de funcionamento. Funções puras (recebem a data "agora")
// para poder rodar no navegador e ser testadas sem mock de relógio.

import type { DayHours, Time, Weekday } from '../data/site';

export type WeeklyHours = Partial<Record<Weekday, DayHours>>;

export interface HoursConfig {
  hours: WeeklyHours;
  /** Datas fechadas no formato AAAA-MM-DD (no fuso da loja). */
  closedDates: readonly string[];
  timeZone: string;
}

export interface ZonedNow {
  weekday: Weekday;
  /** Minutos desde 00:00 no fuso da loja. */
  minutes: number;
  /** Data local AAAA-MM-DD no fuso da loja. */
  date: string;
}

export type Status =
  | { open: true; closesAt: Time }
  | { open: false; next: { label: string; time: Time } | null };

export const WEEKDAY_NAMES = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'] as const;
const WEEKDAY_SHORT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'] as const;
const WEEKDAY_SPOKEN = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'] as const;

export function toMinutes(time: Time): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function zonedNow(now: Date, timeZone: string): ZonedNow {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const p: Record<string, string> = {};
  for (const part of parts) p[part.type] = part.value;
  const days: Record<string, Weekday> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    weekday: days[p.weekday],
    minutes: (Number(p.hour) % 24) * 60 + Number(p.minute),
    date: `${p.year}-${p.month}-${p.day}`,
  };
}

function addDays(date: string, n: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Horário do dia, ou null se fechado (dia sem expediente ou data fechada). */
export function hoursOn(config: HoursConfig, weekday: Weekday, date: string): DayHours | null {
  if (config.closedDates.includes(date)) return null;
  return config.hours[weekday] ?? null;
}

export function getStatus(now: Date, config: HoursConfig): Status {
  const z = zonedNow(now, config.timeZone);
  const today = hoursOn(config, z.weekday, z.date);

  if (today && z.minutes >= toMinutes(today.open) && z.minutes < toMinutes(today.close)) {
    return { open: true, closesAt: today.close };
  }

  // Procura a próxima abertura nas próximas duas semanas (cobre feriados emendados).
  for (let i = 0; i <= 14; i++) {
    const weekday = ((z.weekday + i) % 7) as Weekday;
    const day = hoursOn(config, weekday, addDays(z.date, i));
    if (!day) continue;
    if (i === 0 && z.minutes >= toMinutes(day.open)) continue;
    const label = i === 0 ? 'hoje' : i === 1 ? 'amanhã' : WEEKDAY_SPOKEN[weekday];
    return { open: false, next: { label, time: day.open } };
  }
  return { open: false, next: null };
}

export function statusMessage(status: Status): string {
  if (status.open) return `Aberto agora · fecha às ${status.closesAt}`;
  if (!status.next) return 'Fechado';
  return `Fechado · abre ${status.next.label} às ${status.next.time}`;
}

/** Agrupa dias consecutivos com o mesmo horário: "Seg a sex, 08:00 às 17:30". */
export function hoursSummary(hours: WeeklyHours, sep = ', '): string {
  const order: Weekday[] = [1, 2, 3, 4, 5, 6, 0];
  const groups: { from: Weekday; to: Weekday; h: DayHours }[] = [];
  for (const d of order) {
    const h = hours[d];
    if (!h) continue;
    const last = groups.at(-1);
    const prevDay = order[order.indexOf(d) - 1];
    if (last && last.to === prevDay && last.h.open === h.open && last.h.close === h.close) last.to = d;
    else groups.push({ from: d, to: d, h });
  }
  return groups
    .map(({ from, to, h }) => {
      const days = from === to ? WEEKDAY_SHORT[from] : `${WEEKDAY_SHORT[from]} a ${WEEKDAY_SHORT[to]}`;
      return `${days.charAt(0).toUpperCase()}${days.slice(1)}${sep}${h.open} às ${h.close}`;
    })
    .join(' · ');
}
