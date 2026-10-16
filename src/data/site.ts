// Fonte única dos dados da loja. Tabela de horários, status "aberto agora",
// links do WhatsApp, rodapé e JSON-LD são todos gerados a partir daqui.

/** 0 = domingo … 6 = sábado (mesma convenção de Date#getDay). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Horário no formato "HH:MM". */
export type Time = `${number}:${number}`;

export interface DayHours {
  open: Time;
  close: Time;
}

export interface Service {
  title: string;
  description: string;
  items: string[];
  icon: 'som' | 'insulfilme' | 'iluminacao' | 'acessorios';
}

export interface Film {
  /** Número da película (G5, G20…). */
  value: number;
  /** Opacidade da camada escura no simulador. */
  opacity: number;
  /** Largura do medidor de privacidade, em %. */
  privacy: number;
  privacyLabel: string;
  description: string;
}

export const site = {
  name: 'Duchan Sound Car',
  shortName: 'Duchan',
  tagline: 'SOUND CAR',
  description:
    'Duchan Sound Car: instalação de som e multimídia, insulfilme, iluminação LED e acessórios automotivos em Bariri - SP.',
  timeZone: 'America/Sao_Paulo',

  phone: {
    display: '(14) 98152-1835',
    e164: '+5514981521835',
    /** Número usado em wa.me (sem "+"). */
    whatsapp: '5514981521835',
  },

  defaultWhatsAppMessage: 'Olá! Gostaria de um orçamento.',

  address: {
    street: 'Av. XV de Novembro, 1858',
    district: 'Centro',
    city: 'Bariri',
    state: 'SP',
    postalCode: '17250-037',
    country: 'BR',
    // TODO: adicionar `geo: { lat, lng }` com as coordenadas exatas do Google Business (entra no JSON-LD).
  },

  social: {
    instagram: { handle: '@duchansoundcar', url: 'https://www.instagram.com/duchansoundcar/' },
    // TODO: confirmar com o cliente — o nome da página não bate com a marca.
    facebook: { label: 'Duchan Sound Car', url: 'https://www.facebook.com/MartelinhoDeOuroSoundCar/?locale=pt_BR' },
  },

  /** Dias ausentes = fechado. */
  hours: {
    1: { open: '08:00', close: '17:30' },
    2: { open: '08:00', close: '17:30' },
    3: { open: '08:00', close: '17:30' },
    4: { open: '08:00', close: '17:30' },
    5: { open: '08:00', close: '17:30' },
  } as Partial<Record<Weekday, DayHours>>,

  /**
   * Datas em que a loja fica fechada mesmo sendo dia útil (AAAA-MM-DD, horário de SP).
   * TODO: confirmar com o cliente quais feriados (nacionais e municipais de Bariri) a loja fecha.
   */
  closedDates: [
    '2026-11-02', // Finados
    '2026-11-20', // Consciência Negra
    '2026-12-25', // Natal
    '2027-01-01', // Confraternização Universal
  ] as string[],

  services: [
    {
      icon: 'som',
      title: 'Som',
      description: 'Centrais multimídia e sistemas de som completos, do básico ao projeto sob medida.',
      items: ['Multimídia com Android Auto e CarPlay', 'Alto-falantes, módulos e subwoofer', 'Caixas e projetos de som automotivo'],
    },
    {
      icon: 'insulfilme',
      title: 'Insulfilme',
      description: 'Película automotiva aplicada sem bolhas, com recorte preciso em cada vidro.',
      items: ['Tonalidades G5, G20, G35, G50 e G70', 'Redução de calor e raios UV', 'Orientação sobre as regras do CONTRAN'],
    },
    {
      icon: 'iluminacao',
      title: 'Iluminação',
      description: 'Mais luz e visibilidade à noite, com lâmpadas de qualidade e encaixe correto.',
      items: ['LED e ultra LED para faróis', 'Milha, neblina e lanternas', 'Iluminação interna e de placa'],
    },
    {
      icon: 'acessorios',
      title: 'Acessórios',
      description: 'Itens que deixam o dia a dia mais prático e o carro mais seguro.',
      items: ['Câmera de ré e sensor de estacionamento', 'Alarme e trava elétrica', 'Tomadas USB e outros acessórios'],
    },
  ] satisfies Service[],

  // TODO: validar textos com o cliente à luz da Resolução CONTRAN 960/2022.
  films: [
    { value: 5, opacity: 0.93, privacy: 97, privacyLabel: 'Máxima', description: 'Quase não se vê o interior. Indicada para vidros traseiros de quem busca o máximo de privacidade.' },
    { value: 20, opacity: 0.8, privacy: 80, privacyLabel: 'Alta', description: 'Escura por fora, boa visão por dentro. Uma das mais pedidas para vidros traseiros.' },
    { value: 35, opacity: 0.63, privacy: 60, privacyLabel: 'Média', description: 'Equilíbrio entre privacidade e visibilidade, inclusive à noite.' },
    { value: 50, opacity: 0.46, privacy: 40, privacyLabel: 'Moderada', description: 'Tom discreto que reduz o calor e o brilho do sol sem escurecer muito.' },
    { value: 70, opacity: 0.24, privacy: 18, privacyLabel: 'Baixa', description: 'Quase transparente. Protege contra calor e raios UV mantendo a visão clara.' },
  ] satisfies Film[],
  defaultFilm: 20,
} as const;

export const fullAddress = `${site.address.street} - ${site.address.district}, ${site.address.city} - ${site.address.state}, ${site.address.postalCode}`;
