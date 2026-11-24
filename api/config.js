// Diz ao app publicado se a IA e a voz estão configuradas neste endereço. Não revela chave nem senha.
import { iaConfigurada } from '../ia/claude.mjs';
import { vozConfigurada } from '../ia/voz.mjs';

export default function handler(req, res) {
  res.setHeader('cache-control', 'no-store');
  const senha = !!process.env.AUDIS_SENHA;
  res.status(200).json({ ia: iaConfigurada() && senha, voz: vozConfigurada() && senha });
}
