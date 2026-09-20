import { siteConfig } from '../config/site';
import { formatPhoneForWhatsApp } from './formatters';

export const buildSimulationMessage = (formData: Record<string, string | boolean>) => {
  const lines = [
    'Olá, José! Gostaria de fazer uma pré-simulação.',
    '',
    `Nome: ${String(formData.nome ?? '')}`,
    `WhatsApp: ${String(formData.whatsapp ?? '')}`,
    `Região desejada: ${String(formData.regiao ?? '')}`,
    `Tipo de imóvel: ${String(formData.tipoImovel ?? '')}`,
    `Quantidade de dormitórios: ${String(formData.dormitorios ?? '')}`,
    `Faixa de renda: ${String(formData.renda ?? '')}`,
    `FGTS: ${formData.fgts ? 'Sim' : 'Não'}`,
    `Composição de renda: ${formData.somarRenda ? 'Sim' : 'Não'}`,
    `Prazo para comprar: ${String(formData.prazo ?? '')}`,
    `Preferência de atendimento: ${String(formData.atendimento ?? '')}`,
    '',
    'Autorizo o uso destas informações exclusivamente para que José entre em contato sobre minha busca por um imóvel.',
  ];

  return lines.join('\n');
};

export const getWhatsAppUrl = (message: string) => {
  const phone = formatPhoneForWhatsApp(siteConfig.whatsapp);
  if (!phone) return '';
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};
