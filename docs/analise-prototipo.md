# Análise crítica do protótipo — Duchan Sound Car

Arquivo analisado: [`prototipo/duchan-sound-car.html`](../prototipo/duchan-sound-car.html) (gerado no Claude Design, 56 KB, arquivo único com CSS, JS e imagens embutidos).

Resumo: o **design** é bom e coerente; o **código** é um protótipo de uma página só, não uma base de produção. Ele serve como referência visual, mas não deve ser publicado do jeito que está. Os maiores problemas não são de código: são de **conteúdo** (nenhuma foto real, nenhuma prova social) e de **SEO local** (título e metadados fora do `<head>`, sem dados estruturados, sem preview para WhatsApp).

---

## 1. O que está bom (manter)

- **Sistema visual consistente.** Tokens de cor em `:root` (`--night`, `--amber`, `--paper`…), uma única cor de destaque (âmbar = "luz de LED"), tipografia com personalidade (Archivo expandida + Instrument Sans + JetBrains Mono). Combina com o nicho de som automotivo sem cair no clichê "neon e chamas".
- **Hierarquia de conversão clara.** O objetivo do site é um só, que é levar o cliente ao WhatsApp, e todos os CTAs apontam para lá, com mensagem pré-preenchida.
- **Responsivo de verdade.** Grids que se reorganizam em 4 → 2 → 1 colunas, `clamp()` nos títulos, `min-width:0` nos itens de grid (evita estouro horizontal).
- **Cuidados de acessibilidade básicos:** `:focus-visible`, `prefers-reduced-motion`, `aria-pressed` nos botões do simulador, `aria-label` nos links que só têm ícone, `rel="noopener"` nos links externos.
- **Status "aberto/fechado" no fuso de São Paulo** (`Intl.DateTimeFormat` com `America/Sao_Paulo`). Funciona mesmo que o visitante esteja em outro fuso, e sem JS a página mostra o horário fixo (degrada bem).
- **Simulador de insulfilme.** É o diferencial do site: interativo, leve e responde a uma dúvida real do cliente ("qual a diferença entre G5 e G20?").
- **Leve.** Sem frameworks, sem imagens pesadas. O único custo relevante de carregamento são as fontes.

---

## 2. Problemas de estrutura HTML (bloqueiam publicação)

| # | Problema | Onde | Impacto |
|---|----------|------|---------|
| H1 | `<title>`, `<meta name="description">`, os `<link>` de fontes e o `<style>` principal estão **dentro do `<body>`**. O `<head>` só tem charset, viewport e um CSS genérico do wrapper do Claude. | linhas 1–8 | HTML inválido. Crawlers podem ignorar a description, e o título funciona só porque o navegador tolera o erro. |
| H2 | `<html>` sem `lang="pt-BR"`. | linha 1 | Leitores de tela pronunciam com regras do inglês, e o Chrome oferece "traduzir esta página". |
| H3 | Restos do gerador: `<meta name="claude:viewport-fit-sides">`, `body::before` e `padding` com `safe-area-inset` em `:root`, e um primeiro `<style>` que define `font:14px` e `color-scheme:light` para ser sobrescrito logo depois. | linhas 1, 3, 30 | Código morto e confuso. |
| H4 | O logo é um WebP em **base64 duplicado** (header e footer, cerca de 7 KB cada). | linhas 199, 547 | Não entra no cache do navegador e infla o HTML. Deve virar um arquivo `logo.webp` (e um SVG, se existir vetor). |
| H5 | `<meta charset=utf8>` | linha 1 | Funciona, mas o padrão é `utf-8`. |
| H6 | Estilos inline (`style="padding-top:0"`, `style="display:flex…"` no footer, `style="width:20%"` nos medidores). | 440, 488, 547, 412 | Difícil de manter. |
| H7 | Os IDs dos SVGs são genéricos e globais (`body`, `glass`, `sky`, `film`, `beam`). | SVGs | Se o SVG for reaproveitado como componente, ou aparecer duas vezes, os gradientes colidem. |
| H8 | CSS sem uso: `.contact div.row`, `counter-reset:s`. | 130, 153 | Código morto. |

## 3. Bugs e problemas de UX

1. **Âncoras escondem o título sob o header fixo** (confirmado no navegador). `scroll-padding-top` só considera o `safe-area-inset`, não os 77 px do header. Nas seções `#visite` e `#localizacao`, que têm `padding-top:0` inline, clicar em "Horários e contato" ou "Como chegar" deixa o título "Fale com a Duchan" / "Venha até a loja" atrás do header. Correção: `html{scroll-padding-top:calc(77px + env(safe-area-inset-top))}`, ou `scroll-margin-top` nas seções.
2. **No mobile, a navegação desaparece** (`.nav{display:none}` abaixo de 880 px) e não há menu hambúrguer. Num site de uma página isso é aceitável, mas hoje no celular, que deve ser mais de 80% do tráfego desse público, o usuário só consegue rolar. Vale ter pelo menos um menu compacto ou atalhos fixos.
3. **Três CTAs de WhatsApp visíveis ao mesmo tempo** no mobile (botão do header, botão do hero e o FAB verde). O FAB verde também foge da paleta. Sugestão: esconder o FAB enquanto o hero estiver visível (IntersectionObserver).
4. **O horário está escrito à mão em 6 lugares** (status do hero, faixa de specs, passo 2, tabela, texto da seção e constantes `OPEN`/`CLOSE` no JS). Telefone e link do WhatsApp se repetem cerca de 7 vezes. Se o horário mudar, alguém vai esquecer de um. Isso precisa ter **uma única fonte de dados**.
5. **Feriados não existem para o status.** Num feriado, o site diz "Aberto agora". É preciso uma lista de datas fechadas (ou pelo menos o aviso "consulte feriados").
6. **O status só é calculado ao carregar a página.** Quem deixa a aba aberta das 17:20 às 17:40 continua vendo "Aberto". Um `setInterval` de 1 minuto resolve.
7. **A lógica do "abre amanhã/segunda"** funciona, mas está escrita de forma redundante (linha 572: a condição é sobrescrita logo em seguida). Deve ser reescrita, com testes.
8. **"Copiar endereço"** não volta ao texto original depois de copiar, e no fallback (`sel()`) o texto vira "Endereço selecionado" sem que o usuário entenda o que fazer.
9. **O mapa é uma ilustração SVG genérica**, não o mapa real. O link para o Google Maps funciona, mas o desenho sugere uma rua que não corresponde à geografia real. Opções: um mapa estático real (imagem gerada uma vez) ou um iframe carregado só no clique (facade), para não pesar a página.

## 4. Acessibilidade

- Muitos textos de **10–12 px** em caixa alta monoespaçada (`.eyebrow`, `.spec small`, `.readout small`, a tag "hoje"). Ficam legíveis, mas no limite, ainda mais no sol, que é onde o público vai ver no celular. O mínimo deveria ser 12–13 px.
- O resultado do simulador não é anunciado para leitores de tela: falta `aria-live="polite"` no painel de leitura.
- Os medidores (`.meter`) não têm `role="meter"` nem `aria-valuenow`.
- A tabela de horários não tem `<caption>` nem `<th scope="row">`.
- Os passos de "Como funciona" são `<div>`, mas deveriam ser uma `<ol>` (são uma sequência).
- O logo do footer tem `alt="Duchan Sound Car"` ao lado do texto "Duchan Sound Car" (o leitor de tela fala o nome duas vezes). Deveria ser `alt=""`.
- O SVG do hero tem `role="img"` dentro de um wrapper com `aria-hidden`, o que é contraditório (inofensivo, mas deve ser limpo).

## 5. SEO e presença local (a maior oportunidade)

Para uma loja física numa cidade pequena, o site existe principalmente para **aparecer no Google quando alguém busca "insulfilme Bariri" ou "som automotivo Bariri"** e para **gerar um bom preview quando o link é compartilhado no WhatsApp**. Hoje o protótipo não faz nenhuma das duas coisas bem.

- **Sem Open Graph / Twitter Card** (`og:title`, `og:description`, `og:image`). O link compartilhado no WhatsApp aparece sem imagem. Para esse negócio é provavelmente **o item de maior retorno da lista**.
- **Sem dados estruturados.** Falta JSON-LD `AutoPartsStore`/`AutoRepair` (subtipos de `LocalBusiness`) com endereço, telefone, `openingHoursSpecification`, `geo`, `sameAs` (Instagram/Facebook). Isso ajuda o Google a mostrar horário e endereço direto na busca.
- Sem `favicon`, `apple-touch-icon` e `theme-color`.
- Sem `canonical`, `robots.txt` e `sitemap.xml`.
- **Página única = uma palavra-chave principal.** Se houver interesse em ranquear para "insulfilme", "multimídia" e "LED" separadamente, faz sentido ter uma página por serviço no futuro (a stack sugerida abaixo já suporta isso).
- O site precisa andar junto com o **Perfil da Empresa no Google** (Google Business Profile). Na busca local, ele pesa mais que o próprio site.

## 6. Conteúdo e credibilidade (crítica mais importante)

O design está pronto, mas **o conteúdo ainda é de template**:

- **Nenhuma foto real.** Nem da loja, nem de carros instalados, nem de antes/depois de insulfilme ou de painel com multimídia. Para serviço automotivo, galeria de trabalhos é o principal argumento de venda. O cliente compra porque viu o carro do vizinho.
- **Nenhuma prova social:** sem avaliações do Google, depoimentos, número de carros atendidos ou anos de mercado.
- **Afirmações vagas:** "marcas de mercado" (quais? Pioneer, JBL, Taramps, 3M…?), "acabamento de fábrica", "sem fila". Sem marcas nem garantia declarada, o texto não convence.
- **Faltam informações de confiança:** garantia do serviço, formas de pagamento (Pix, cartão, parcelamento) e CNPJ/razão social no rodapé.
- ⚠️ **O Facebook aponta para `MartelinhoDeOuroSoundCar`.** O nome não bate com a marca "Duchan". Confirmar com o cliente se é a página certa (nome antigo? outro negócio?).
- ⚠️ **Risco legal no simulador de insulfilme:**
  - O simulador trata o número da película como se fosse a transmissão final ("G20 → Luz que passa 20%"). Na prática, o vidro original já tem tonalidade, então o resultado final fica **mais escuro** que o número da película. Um G70 no vidro lateral dianteiro pode ficar abaixo do mínimo legal.
  - A descrição do G70 ("Quase transparente… mantendo a visão clara") pode ser lida como "pode usar em qualquer vidro".
  - Sugestão: mostrar, junto de cada opção, **em quais vidros ela é permitida**, e validar o texto com o cliente com base na resolução vigente do CONTRAN (Res. 960/2022, que substituiu a 254/2007). Os percentuais devem ser conferidos pelo cliente antes de ir ao ar.
- Mensagem do WhatsApp sempre igual ("Gostaria de um orçamento"). Ela poderia variar por CTA ("Olá! Vi no site o insulfilme G20…"). Isso ajuda o atendimento e permite medir de onde veio cada lead.

## 7. Performance e privacidade

- **Fontes:** 3 famílias pelo Google Fonts, sendo Archivo com eixo de largura **e** peso variáveis (`wdth 62..125, wght 400..900`). É o maior peso da página e bloqueia a renderização do texto. Recomendação: hospedar as fontes localmente (Fontsource), carregar só o subset `latin` e limitar os eixos ao intervalo usado (o protótipo só usa larguras de 106 a 118% e pesos de 700 a 800 em Archivo).
- Hospedar as fontes localmente também evita enviar o IP do visitante ao Google em cada visita (boa prática de LGPD).
- Quando a galeria de fotos entrar, as imagens passam a ser o maior risco de performance. Será preciso AVIF/WebP, `srcset` responsivo e `loading="lazy"`. A stack precisa resolver isso automaticamente.
- **Sem métrica nenhuma.** O cliente vai perguntar "quantas pessoas vieram pelo site?". Falta rastrear os cliques nos links `wa.me`.

---

## 8. Sugestões de stack

### Recomendação principal: **Astro + TypeScript + CSS puro (tokens do protótipo)**

Por que é a melhor escolha para este projeto:

- É um **site de conteúdo com pouquíssima interatividade** (status de horário, simulador e copiar endereço). O Astro gera HTML estático e só envia JS para as "ilhas" interativas. O resultado fica tão leve quanto o protótipo, mas organizado.
- **Componentização sem custo de JS:** `Header.astro`, `Hero.astro`, `Services.astro`, `TintSimulator.astro`…, com o CSS escopado por componente. Isso resolve o problema H7 (IDs colidindo).
- **Uma fonte de dados** em `src/data/site.ts` (telefone, endereço, horário, feriados, serviços, películas). A partir dela são gerados a tabela, o status, o JSON-LD, os links do WhatsApp e o rodapé. Isso resolve os bugs 4 e 5.
- **`astro:assets`** otimiza as fotos da galeria (AVIF/WebP, tamanhos responsivos) sem configuração.
- Integrações prontas para `sitemap` e Fontsource, e um caminho natural para criar páginas por serviço (`/insulfilme`, `/som-automotivo`) se o SEO pedir.
- O CSS do protótipo já é bem escrito e baseado em tokens, então **não há motivo para reescrever em Tailwind**. Basta migrar para `src/styles/tokens.css` e os estilos de cada componente.

| Camada | Escolha | Observação |
|--------|---------|------------|
| Framework | Astro 7 (saída estática) | Sem servidor, custo zero de hospedagem |
| Linguagem | TypeScript | Tipar `site.ts` evita erros de horário e telefone |
| Estilo | CSS puro + custom properties (tokens atuais) | Escopado por componente |
| Interatividade | TS vanilla em `<script>` do Astro | Preact só se o simulador crescer muito |
| Fontes | `@fontsource-variable/archivo`, `@fontsource/instrument-sans`, `@fontsource/jetbrains-mono` | Self-host, subset latin |
| Imagens | `astro:assets` | AVIF/WebP automáticos |
| SEO | `@astrojs/sitemap` + JSON-LD gerado de `site.ts` + OG image | |
| Analytics | Umami ou Plausible (sem cookies, dispensa banner) ou GA4 + banner de consentimento | Evento por clique em WhatsApp |
| Qualidade | Biome (lint + format), Vitest (lógica de horário/feriado, com testes de fuso), Playwright (smoke test), Lighthouse CI | |
| CI/CD | GitHub Actions → Cloudflare Pages (ou Netlify / Vercel) | Plano gratuito sobra; domínio `.com.br` via Registro.br |
| Pacotes | pnpm | |

**Edição pelo cliente (opcional):** se o cliente quiser trocar fotos da galeria, promoções ou horário sozinho, dá para adicionar o **Keystatic** ou o **Decap CMS**. Os dois são CMS baseados em Git, gratuitos, com um painel em `/admin` que grava commits no repositório e dispara o deploy. Sem banco de dados e sem mensalidade.

### Alternativas

- **Vite + HTML/TS vanilla (mínimo).** Mantém o protótipo quase como está, separando CSS/JS em arquivos e usando um plugin de partials. É a opção mais barata, mas vira o mesmo problema de duplicação assim que houver uma segunda página ou uma galeria. Só faz sentido se o orçamento for muito pequeno e o site nunca for crescer.
- **Next.js (React).** Só se o roadmap incluir funcionalidades de aplicação: **agendamento online com calendário**, área do cliente, painel administrativo, loja de acessórios com pagamento. Para o escopo atual, é exagero: mais JS no cliente, mais complexidade e hospedagem mais cara.
- **WordPress.** Só se o cliente exigir editar tudo sozinho e já tiver hospedagem. As desvantagens são manutenção de plugins, superfície de ataque, performance pior e mensalidade de hospedagem. O Astro com Keystatic cobre a necessidade de edição sem esses custos.

### Estrutura sugerida (Astro)

```
src/
  data/site.ts              # telefone, endereço, horários, feriados, serviços, películas
  lib/hours.ts              # isOpen(), nextOpening() — puro e testável
  lib/whatsapp.ts           # waLink(mensagem)
  components/
    Header.astro  Hero.astro  Services.astro  TintSimulator.astro
    Steps.astro  Hours.astro  Contact.astro  Location.astro  Cta.astro
    Footer.astro  WhatsAppFab.astro  SeoHead.astro (meta, OG, JSON-LD)
  styles/tokens.css  global.css
  assets/logo.webp  gallery/*.jpg
  pages/index.astro
public/  favicon.svg  og.jpg  robots.txt
tests/   hours.test.ts
```

---

## 9. Plano priorizado

**P0 — antes de publicar**
1. Migrar para Astro com `<head>` correto, `lang="pt-BR"`, sem restos do gerador.
2. Centralizar os dados em `site.ts`, reescrever a lógica de horário com feriados e testes.
3. Open Graph + favicon + JSON-LD `LocalBusiness`.
4. Corrigir o deslocamento das âncoras sob o header.
5. Revisar com o cliente: link do Facebook, textos do simulador (legislação) e se a loja abre aos sábados.

**P1 — logo após**
6. Galeria de trabalhos com fotos reais (otimizada).
7. Avaliações do Google, marcas trabalhadas, garantia, formas de pagamento e CNPJ.
8. Analytics com evento de clique no WhatsApp e mensagens pré-preenchidas por serviço.
9. Fontes self-hosted e com subset.
10. Ajustes de acessibilidade (seção 4) e menu mobile.

**P2 — evolução**
11. Páginas por serviço para SEO.
12. CMS (Keystatic/Decap) se o cliente quiser autonomia.
13. Mapa real com carregamento no clique.

## 10. Perguntas para levar ao cliente

- A página do Facebook `MartelinhoDeOuroSoundCar` é mesmo da Duchan?
- Abre aos sábados? Em quais feriados fecha?
- Tem fotos de trabalhos feitos (ou pode tirar)? Fotos da fachada?
- Quais marcas trabalha? Oferece garantia? De quanto tempo?
- Formas de pagamento e parcelamento?
- Já tem domínio? Perfil no Google Business configurado?
- Quer editar algo sozinho depois (fotos, promoções, horário)?
