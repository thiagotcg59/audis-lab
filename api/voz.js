// Função do Vercel: recebe um parágrafo do app publicado e devolve o áudio lido pela ElevenLabs.
// Variáveis de ambiente no Vercel (Settings › Environment Variables):
//   ELEVENLABS_API_KEY   chave da API da ElevenLabs
//   ELEVENLABS_VOICE_ID  id da voz
//   AUDIS_SENHA          a mesma senha da IA, digitada no app em "Dados neste aparelho"
import { senhaConfere } from '../ia/claude.mjs';
import { pedirVoz, vozConfigurada } from '../ia/voz.mjs';

export default async function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ code: 'invalid_request', message: 'use POST' });
  if (!vozConfigurada() || !process.env.AUDIS_SENHA) return res.status(503).json({ code: 'unavailable', message: 'A voz não está configurada neste endereço.' });
  if (!senhaConfere(req.headers['x-audis-senha'])) return res.status(401).json({ code: 'not_granted', message: 'Senha incorreta.' });
  const cancelar = new AbortController();
  res.on('close', () => { if (!res.writableEnded) cancelar.abort(); });
  try {
    const corpo = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    if (corpo.testar) return res.status(200).json({ ok: true }); // só confere a senha, sem gastar caracteres
    const { tipo, dados } = await pedirVoz(corpo, { signal: cancelar.signal });
    res.setHeader('content-type', tipo);
    return res.status(200).send(dados);
  } catch (e) {
    if (res.writableEnded || res.destroyed) return;
    return res.status(e.status >= 400 && e.status < 600 ? e.status : 500).json({ code: e.code || 'upstream_error', message: e.message || String(e) });
  }
}
