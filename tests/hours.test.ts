import { describe, expect, it } from 'vitest';
import { getStatus, hoursSummary, statusMessage, zonedNow, type HoursConfig } from '../src/lib/hours';

const config: HoursConfig = {
  timeZone: 'America/Sao_Paulo',
  hours: {
    1: { open: '08:00', close: '17:30' },
    2: { open: '08:00', close: '17:30' },
    3: { open: '08:00', close: '17:30' },
    4: { open: '08:00', close: '17:30' },
    5: { open: '08:00', close: '17:30' },
  },
  closedDates: ['2026-11-02', '2026-11-20'],
};

// São Paulo está em UTC-3 (sem horário de verão desde 2019).
const sp = (local: string) => new Date(`${local}:00-03:00`);
const msg = (local: string) => statusMessage(getStatus(sp(local), config));

describe('zonedNow', () => {
  it('converte para o fuso da loja independente do fuso do visitante', () => {
    // 02:30 UTC de sábado = 23:30 de sexta em SP
    expect(zonedNow(new Date('2026-10-17T02:30:00Z'), config.timeZone)).toEqual({ weekday: 5, minutes: 23 * 60 + 30, date: '2026-10-16' });
  });
  it('trata meia-noite como 0 minutos', () => {
    expect(zonedNow(sp('2026-10-15T00:00'), config.timeZone).minutes).toBe(0);
  });
});

describe('getStatus', () => {
  it('aberto durante o expediente', () => {
    expect(msg('2026-10-15T10:00')).toBe('Aberto agora · fecha às 17:30');
    expect(msg('2026-10-15T08:00')).toBe('Aberto agora · fecha às 17:30');
  });
  it('fecha exatamente no horário de fechamento', () => {
    expect(msg('2026-10-15T17:30')).toBe('Fechado · abre amanhã às 08:00');
  });
  it('antes de abrir num dia útil', () => {
    expect(msg('2026-10-15T07:59')).toBe('Fechado · abre hoje às 08:00');
  });
  it('sexta à noite e fim de semana abrem na segunda', () => {
    expect(msg('2026-10-16T18:00')).toBe('Fechado · abre segunda às 08:00');
    expect(msg('2026-10-17T12:00')).toBe('Fechado · abre segunda às 08:00');
    expect(msg('2026-10-18T12:00')).toBe('Fechado · abre amanhã às 08:00');
  });
  it('feriado em dia útil fica fechado', () => {
    // 02/11/2026 é segunda (Finados)
    expect(msg('2026-11-02T10:00')).toBe('Fechado · abre amanhã às 08:00');
    // domingo antes do feriado pula a segunda
    expect(msg('2026-11-01T10:00')).toBe('Fechado · abre terça às 08:00');
  });
  it('véspera de feriado na sexta', () => {
    // 19/11/2026 é quinta; 20/11 (sexta) é feriado
    expect(msg('2026-11-19T18:00')).toBe('Fechado · abre segunda às 08:00');
  });
  it('sem nenhum horário cadastrado', () => {
    expect(statusMessage(getStatus(sp('2026-10-15T10:00'), { ...config, hours: {} }))).toBe('Fechado');
  });
});

describe('hoursSummary', () => {
  it('agrupa dias consecutivos', () => {
    expect(hoursSummary(config.hours)).toBe('Seg a sex, 08:00 às 17:30');
  });
  it('separa grupos com horários diferentes', () => {
    expect(hoursSummary({ ...config.hours, 6: { open: '08:00', close: '12:00' } })).toBe('Seg a sex, 08:00 às 17:30 · Sáb, 08:00 às 12:00');
  });
});
