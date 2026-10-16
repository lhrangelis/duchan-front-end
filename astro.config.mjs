// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: trocar pelo domínio definitivo antes de publicar (usado em canonical, OG e sitemap).
export default defineConfig({
  site: 'https://www.duchansoundcar.com.br',
  integrations: [sitemap()],
});
