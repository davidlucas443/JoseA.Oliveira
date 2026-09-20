import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const baseDir = path.resolve('public/images/properties');
fs.mkdirSync(baseDir, { recursive: true });

const names = [
  'apartamento-1', 'apartamento-2', 'apartamento-3', 'apartamento-4',
  'apartamento-5', 'apartamento-6', 'apartamento-7', 'apartamento-8',
  'apartamento-9', 'apartamento-10', 'apartamento-11', 'apartamento-12',
  'apartamento-13', 'apartamento-14', 'apartamento-15', 'apartamento-16',
  'casa-1', 'casa-2', 'casa-3', 'casa-4',
];

for (const [index, name] of names.entries()) {
  const paletteA = index % 2 === 0 ? '#D8D3CB' : '#BFC8C1';
  const paletteB = index % 3 === 0 ? '#F7F5F1' : '#EEEAE4';
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="${paletteA}"/><stop offset="100%" stop-color="${paletteB}"/></linearGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#bg)"/>
    <rect x="90" y="110" width="1020" height="580" rx="28" fill="rgba(255,255,255,0.14)"/>
    <rect x="150" y="170" width="520" height="90" rx="18" fill="rgba(255,255,255,0.16)"/>
    <rect x="150" y="310" width="430" height="18" rx="9" fill="rgba(255,255,255,0.18)"/>
    <rect x="150" y="352" width="470" height="18" rx="9" fill="rgba(255,255,255,0.18)"/>
    <rect x="150" y="394" width="410" height="18" rx="9" fill="rgba(255,255,255,0.18)"/>
    <circle cx="910" cy="270" r="120" fill="rgba(255,255,255,0.18)"/>
    <rect x="740" y="420" width="230" height="150" rx="26" fill="rgba(255,255,255,0.18)"/>
  </svg>
  `;

  await sharp(Buffer.from(svg)).webp({ quality: 82 }).toFile(path.join(baseDir, `${name}.webp`));
}

const ogSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#66736B"/>
        <stop offset="100%" stop-color="#252B29"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <rect x="90" y="90" width="1020" height="450" rx="28" fill="rgba(255,255,255,0.14)"/>
    <text x="160" y="330" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="700" fill="white">José A. Oliveira</text>
    <text x="160" y="400" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="rgba(255,255,255,0.88)">Corretor imobiliário em São Paulo</text>
  </svg>
`;

await sharp(Buffer.from(ogSvg)).webp({ quality: 80 }).toFile(path.resolve('public/images/og-cover.webp'));

console.log(`Generated ${names.length + 1} image files in ${baseDir}`);
