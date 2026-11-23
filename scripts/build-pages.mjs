// Gera site/: a versão que roda no GitHub Pages, com os dados guardados no navegador (veja pages/).
// Uso: node scripts/build-pages.mjs   (minifica com esbuild se ele estiver instalado)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { montarJs } from './build.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.join(raiz, 'site');
fs.rmSync(site, { recursive: true, force: true });
fs.mkdirSync(site, { recursive: true });

let js = montarJs();
let css = fs.readFileSync(path.join(raiz, 'src/app.css'), 'utf8');
try {
  const esbuild = await import('esbuild');
  js = (await esbuild.transform(js, { minify: true, target: 'es2022', charset: 'utf8' })).code;
  css = (await esbuild.transform(css, { loader: 'css', minify: true, charset: 'utf8' })).code;
} catch { console.log('esbuild não instalado: site/ sai sem minificar.'); }

fs.writeFileSync(path.join(site, 'app.js'), js);
fs.writeFileSync(path.join(site, 'app.css'), css);
fs.copyFileSync(path.join(raiz, 'dev/claude-shim.js'), path.join(site, 'claude-shim.js'));
for (const f of ['index.html', 'dados.html', 'sw.js', 'armazem.js']) fs.copyFileSync(path.join(raiz, 'pages', f), path.join(site, f));
fs.writeFileSync(path.join(site, '.nojekyll'), '');
console.log(`site/ pronto: app.js ${(Buffer.byteLength(js) / 1024).toFixed(0)} KB`);
