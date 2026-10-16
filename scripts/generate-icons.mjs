// Gera favicon, apple-touch-icon e a imagem Open Graph a partir do logo.
// Uso: node scripts/generate-icons.mjs
// TODO: quando houver logo vetorial e fotos reais, trocar a OG por uma foto da loja/trabalho.
import sharp from 'sharp';

const logo = 'src/assets/logo.webp';
const night = '#0E1114';

await sharp(logo).resize(96, 96).png().toFile('public/favicon.png');

await sharp({ create: { width: 180, height: 180, channels: 4, background: night } })
  .composite([{ input: await sharp(logo).resize(150, 150, { kernel: 'lanczos3' }).toBuffer(), gravity: 'center' }])
  .png()
  .toFile('public/apple-touch-icon.png');

const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${night}"/>
  <rect x="0" y="622" width="1200" height="8" fill="#F7BF00"/>
  <text x="300" y="250" font-family="Arial Narrow, Arial, sans-serif" font-weight="800" font-size="92" fill="#ECEEEF">DUCHAN</text>
  <text x="304" y="300" font-family="Consolas, monospace" font-size="28" letter-spacing="12" fill="#8E979F">SOUND CAR</text>
  <text x="80" y="430" font-family="Arial, sans-serif" font-weight="700" font-size="46" fill="#ECEEEF">Som, insulfilme, LED e acessórios</text>
  <text x="80" y="490" font-family="Arial, sans-serif" font-size="34" fill="#F7BF00">Bariri - SP · (14) 98152-1835</text>
</svg>`;

await sharp(Buffer.from(og))
  .composite([{ input: await sharp(logo).resize(180, 180, { kernel: 'lanczos3' }).toBuffer(), left: 80, top: 130 }])
  .jpeg({ quality: 86 })
  .toFile('public/og.jpg');

console.log('ok: public/favicon.png, public/apple-touch-icon.png, public/og.jpg');
