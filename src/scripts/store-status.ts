// Atualiza os indicadores "aberto/fechado" e destaca o dia de hoje na tabela.
// Elementos: [data-status="long|short"] (texto em [data-status-text] ou no próprio elemento)
// e linhas [data-weekday] da tabela de horários.
import { site } from '../data/site';
import { getStatus, statusMessage, zonedNow } from '../lib/hours';

function update() {
  const now = new Date();
  const status = getStatus(now, site);
  const today = String(zonedNow(now, site.timeZone).weekday);

  for (const el of document.querySelectorAll<HTMLElement>('[data-status]')) {
    el.classList.toggle('is-open', status.open);
    el.classList.toggle('is-closed', !status.open);
    const target = el.querySelector<HTMLElement>('[data-status-text]') ?? el;
    target.textContent = el.dataset.status === 'short' ? (status.open ? 'Aberto agora' : 'Fechado agora') : statusMessage(status);
  }
  for (const row of document.querySelectorAll<HTMLElement>('[data-weekday]')) {
    row.classList.toggle('today', row.dataset.weekday === today);
  }
}

update();
setInterval(update, 60_000);
