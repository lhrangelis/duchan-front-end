# Duchan Sound Car — site

Site institucional da Duchan Sound Car (som, insulfilme, LED e acessórios automotivos, Bariri - SP).
Feito em [Astro](https://astro.build) com TypeScript e CSS puro, gerado como site estático.

- Protótipo original (Claude Design): [`prototipo/duchan-sound-car.html`](prototipo/duchan-sound-car.html)
- Análise e decisões de stack: [`docs/analise-prototipo.md`](docs/analise-prototipo.md)

## Comandos

Requer Node 22.12+ e pnpm (via `corepack pnpm …` se não estiver instalado).

| Comando | O que faz |
|---------|-----------|
| `pnpm install` | Instala as dependências |
| `pnpm dev` | Servidor local em `http://localhost:4321` |
| `pnpm build` | Gera o site estático em `dist/` |
| `pnpm preview` | Serve o `dist/` localmente |
| `pnpm check` | Checagem de tipos (Astro + TS) |
| `pnpm test` | Testes (Vitest) da lógica de horário |
| `pnpm icons` | Regenera favicon, apple-touch-icon e imagem OG a partir do logo |

## Onde editar

**Telefone, endereço, horários, feriados, serviços e películas ficam todos em [`src/data/site.ts`](src/data/site.ts).**
A tabela de horários, o status "aberto agora", os links do WhatsApp, o rodapé e os dados estruturados (JSON-LD) são gerados a partir desse arquivo, então não é preciso editar texto espalhado pelos componentes.

```
src/
  data/site.ts          # fonte única dos dados da loja
  lib/hours.ts          # lógica de aberto/fechado (fuso de São Paulo, feriados)
  lib/whatsapp.ts       # links wa.me
  scripts/store-status.ts  # atualiza o status no navegador a cada minuto
  components/           # uma seção por componente + SeoHead (meta, OG, JSON-LD)
  layouts/Base.astro
  pages/index.astro
  styles/tokens.css     # cores, fontes, medidas (tema claro/escuro)
  styles/global.css     # base, botões, cabeçalhos de seção
public/                 # favicon, og.jpg, robots.txt
tests/hours.test.ts
```

## Pendências antes de publicar

Os pontos marcados com `TODO` no código:

- Domínio definitivo em `astro.config.mjs` e `public/robots.txt` (hoje: `www.duchansoundcar.com.br`, provisório).
- Confirmar com o cliente o link do Facebook (`MartelinhoDeOuroSoundCar`).
- Confirmar os feriados em que a loja fecha (`closedDates`).
- Validar os textos do simulador com base na Resolução CONTRAN 960/2022.
- Coordenadas da loja (`geo`) para o JSON-LD.
- Trocar `public/og.jpg` por uma foto real quando houver.
