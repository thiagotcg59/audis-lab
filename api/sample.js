// Função do Vercel: recebe os pedidos de IA do app publicado e chama o Claude.
// Variáveis de ambiente no Vercel (Settings › Environment Variables):
//   ANTHROPIC_API_KEY  chave da API do Claude
//   AUDIS_SENHA        senha que você digita no app (em "Dados neste aparelho") para liberar a IA
import { pedirClaude, iaConfigurada, senhaConfere } from '../ia/claude.mjs';

export default async function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ code: 'invalid_request', message: 'use POST' });
  if (!iaConfigurada() || !process.env.AUDIS_SENHA) return res.status(503).json({ code: 'unavailable', message: 'A IA não está configurada neste endereço.' });
  if (!senhaConfere(req.headers['x-audis-senha'])) return res.status(401).json({ code: 'not_granted', message: 'Senha da IA incorreta.' });
  const cancelar = new AbortController();
  res.on('close', () => { if (!res.writableEnded) cancelar.abort(); });
  try {
    const corpo = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    return res.status(200).json(await pedirClaude(corpo, { signal: cancelar.signal }));
  } catch (e) {
    if (res.writableEnded || res.destroyed) return;
    return res.status(e.status && e.status !== 499 ? e.status : 500).json({ code: e.code || 'upstream_error', message: e.message || String(e) });
  }
}
