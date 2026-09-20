export const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

export const formatCurrency = (value: number) => currency.format(value);

export const formatArea = (value: number) => `${value} m²`;

export const formatPhoneForWhatsApp = (phone: string) => phone.replace(/\D/g, '');

export const normalizeText = (value: string) => value.toLowerCase().trim();
