// Teste rápido: sobe o servidor local com uma CÓPIA dos dados, abre as telas principais no Chromium
// e confere que carregam sem erro. Não altera a pasta dados/.
// Antes da primeira vez:  npm install  &&  npx playwright install chromium
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { chromium } = createRequire(import.meta.url)('playwright');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'audis-smoke-'));
const origem = path.join(raiz, 'dados');
if (fs.existsSync(origem)) fs.cpSync(origem, tmp, { recursive: true });
const PORT = String(5200 + Math.floor(Math.random() * 500));
const srv = spawn(process.execPath, [path.join(raiz, 'dev/server.mjs')], { env: { ...process.env, PORT, AUDIS_DADOS: tmp, ANTHROPIC_API_KEY: '', GEMINI_API_KEY: '', AUDIS_IA: '' }, stdio: 'pipe' });
await new Promise((ok, no) => { srv.stdout.on('data', d => String(d).includes('http://') && ok()); srv.on('exit', c => no(new Error('servidor saiu: ' + c))); setTimeout(() => no(new Error('servidor não subiu')), 15000); });

const rotas = [
  ['/', 'Seu estudo, hoje.'], ['/missoes', 'Missões do dia'], ['/missoes?aba=semana', 'Plano da semana'], ['/material', 'Material Único'],
  ['/erros', 'Meus Erros'], ['/erros?aba=raiox', 'Raio-X dos erros'], ['/flashcards', 'Flashcards da banca'], ['/mapas', 'Seus mapas'], ['/edital', 'Edital'], ['/professor', null],
  ['/desempenho', 'Seu desempenho'], ['/conquistas', 'Seu mapa de conquista'], ['/radar', 'Radar da banca'], ['/adicionar', null],
];
const browser = await chromium.launch();
let falhas = 0;
try {
  for (const [rota, titulo] of rotas) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const erros = [];
    page.on('pageerror', e => erros.push(e.message));
    page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) erros.push(m.text()); });
    await page.goto(`http://127.0.0.1:${PORT}/#${rota}`);
    await page.waitForTimeout(rota === '/' ? 5000 : 2500);
    const h1 = await page.locator('main h1').first().innerText().catch(() => null);
    const ok = !erros.length && h1 && (!titulo || h1.includes(titulo));
    if (!ok) falhas++;
    console.log(`${ok ? 'ok  ' : 'FALHA'} ${rota.padEnd(22)} ${h1 || '(sem título)'}${erros.length ? '  erros: ' + erros.slice(0, 2).join(' | ') : ''}`);
    await page.close();
  }
  // gravação: cria uma semana em branco no plano e confere que foi salva no disco (na cópia)
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`http://127.0.0.1:${PORT}/#/missoes?aba=semana`); await page.waitForTimeout(3000);
  for (let i = 0; i < 3; i++) { await page.click('button[aria-label="Próxima semana"]'); await page.waitForTimeout(150); }
  const branco = page.locator('text=Começar em branco');
  if (await branco.count()) { await branco.click(); await page.waitForTimeout(1500); }
  const gravou = fs.existsSync(path.join(tmp, 'db', 'plano')) && fs.readdirSync(path.join(tmp, 'db', 'plano')).length > 0;
  if (!gravou) falhas++;
  console.log(`${gravou ? 'ok  ' : 'FALHA'} gravação no banco local (plano da semana)`);
} finally {
  await browser.close(); srv.kill(); fs.rmSync(tmp, { recursive: true, force: true });
}
console.log(falhas ? `\n${falhas} falha(s).` : '\nTudo certo.');
process.exit(falhas ? 1 : 0);
