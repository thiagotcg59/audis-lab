// Junta as partes de src/ no app.js publicado e copia o CSS e o index.html para dist/.
// Uso: node scripts/build.mjs            (gera dist/ legível, igual ao código de src/)
//      node scripts/build.mjs --minify   (gera dist/ minificado com esbuild, para publicar menor)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(raiz, 'src');

export function partesJs() {
  const modulos = fs.readdirSync(path.join(src, 'modulos')).filter(f => f.endsWith('.js')).sort().map(f => path.join('modulos', f));
  return ['00-vendor.js', '10-nucleo-1.js', ...modulos, '90-nucleo-2.js'].map(f => path.join(src, f));
}

export function montarJs() {
  return partesJs().map(f => {
    let t = fs.readFileSync(f, 'utf8');
    if (!t.endsWith('\n')) t += '\n';
    return t;
  }).join('');
}

async function principal() {
  const minify = process.argv.includes('--minify');
  const dist = path.join(raiz, 'dist');
  fs.mkdirSync(dist, { recursive: true });
  let js = montarJs();
  let css = fs.readFileSync(path.join(src, 'app.css'), 'utf8');
  if (minify) {
    const esbuild = await import('esbuild');
    js = (await esbuild.transform(js, { minify: true, target: 'es2022', charset: 'utf8' })).code;
    css = (await esbuild.transform(css, { loader: 'css', minify: true, charset: 'utf8' })).code;
  }
  fs.writeFileSync(path.join(dist, 'app.js'), js);
  fs.writeFileSync(path.join(dist, 'app.css'), css);
  fs.copyFileSync(path.join(src, 'index.html'), path.join(dist, 'index.html'));
  const kb = n => (n / 1024).toFixed(0) + ' KB';
  console.log(`dist/ pronto${minify ? ' (minificado)' : ''}: app.js ${kb(Buffer.byteLength(js))}, app.css ${kb(Buffer.byteLength(css))}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) principal().catch(e => { console.error(e); process.exit(1); });
