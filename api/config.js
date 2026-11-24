// Diz ao app publicado se a IA está configurada neste endereço. Não revela chave nem senha.
import { iaConfigurada } from '../ia/claude.mjs';

export default function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  res.status(200).json({ ia: iaConfigurada() && !!process.env.AUDIS_SENHA });
}
