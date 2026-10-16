import { site } from '../data/site';

/** Link wa.me com mensagem pré-preenchida (passe `null` para abrir sem mensagem). */
export function waLink(message: string | null = site.defaultWhatsAppMessage): string {
  const base = `https://wa.me/${site.phone.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
