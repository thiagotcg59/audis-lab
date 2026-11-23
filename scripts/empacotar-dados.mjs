// Pacote de dados para levar o acervo entre o computador e a versão do GitHub Pages.
//   node scripts/empacotar-dados.mjs                       dados/  ->  pacotes/audis-dados-AAAA-MM-DD.json.gz
//   node scripts/empacotar-dados.mjs --abrir <arquivo> <pasta-nova>   pacote -> pasta no formato de dados/
// Abrir um pacote nunca escreve por cima de uma pasta existente: confira o resultado e só então
// use-o (AUDIS_DADOS=<pasta-nova> npm run dev) ou troque a pasta dados/ por ele.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg', 'application/pdf': 'pdf', 'video/mp4': 'mp4', 'video/webm': 'webm', 'text/plain': 'txt', 'text/csv': 'csv', 'text/markdown': 'md', 'application/json': 'json' };
const TIPO = Object.fromEntries(Object.entries(EXT).map(([t, e]) => [e, t]));

function empacotar() {
  const dados = path.resolve(raiz, process.env.AUDIS_DADOS || 'dados');
  const db = {}, assets = {};
  const andar = (dir, partes) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const nome = decodeURIComponent(e.isDirectory() ? e.name : e.name.replace(/\.json$/, ''));
      if (e.isDirectory()) andar(path.join(dir, e.name), [...partes, nome]);
      else if (e.name.endsWith('.json')) db[[...partes, nome].join('/')] = JSON.parse(fs.readFileSync(path.join(dir, e.name), 'utf8'));
    }
  };
  andar(path.join(dados, 'db'), []);
  const dirAssets = path.join(dados, 'assets');
  if (fs.existsSync(dirAssets)) for (const f of fs.readdirSync(dirAssets)) {
    const [id, ext] = f.split('.');
    if (/^[a-f0-9]{32}$/.test(id)) assets[id] = { tipo: TIPO[ext] || 'application/octet-stream', base64: fs.readFileSync(path.join(dirAssets, f)).toString('base64') };
  }
  const saida = path.join(raiz, 'pacotes');
  fs.mkdirSync(saida, { recursive: true });
  const arq = path.join(saida, `audis-dados-${new Date().toISOString().slice(0, 10)}.json.gz`);
  fs.writeFileSync(arq, zlib.gzipSync(JSON.stringify({ formato: 'audis-dados', versao: 1, geradoEm: new Date().toISOString(), db, assets }), { level: 9 }));
  console.log(`${arq}\n${Object.keys(db).length} documentos, ${Object.keys(assets).length} imagem(ns), ${(fs.statSync(arq).size / 1048576).toFixed(1)} MB`);
}

function abrir(arquivo, destino) {
  if (!arquivo || !destino) throw new Error('uso: node scripts/empacotar-dados.mjs --abrir <arquivo> <pasta-nova>');
  destino = path.resolve(destino);
  if (fs.existsSync(destino)) throw new Error('a pasta já existe (não escrevo por cima): ' + destino);
  let buf = fs.readFileSync(arquivo);
  if (buf[0] === 0x1f && buf[1] === 0x8b) buf = zlib.gunzipSync(buf);
  const p = JSON.parse(buf.toString('utf8'));
  if (p.formato !== 'audis-dados') throw new Error('não é um pacote de dados do Audis');
  for (const [caminho, valor] of Object.entries(p.db)) {
    const partes = caminho.split('/').map(encodeURIComponent);
    const f = path.join(destino, 'db', ...partes) + '.json';
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, JSON.stringify(valor, null, 2));
  }
  fs.mkdirSync(path.join(destino, 'assets'), { recursive: true });
  for (const [id, a] of Object.entries(p.assets || {})) if (/^[a-f0-9]{32}$/.test(id)) fs.writeFileSync(path.join(destino, 'assets', `${id}.${EXT[a.tipo] || 'bin'}`), Buffer.from(a.base64, 'base64'));
  console.log(`${destino}\n${Object.keys(p.db).length} documentos, ${Object.keys(p.assets || {}).length} imagem(ns)`);
}

try {
  const i = process.argv.indexOf('--abrir');
  if (i > 0) abrir(process.argv[i + 1], process.argv[i + 2]); else empacotar();
} catch (e) { console.error(e.message); process.exit(1); }
