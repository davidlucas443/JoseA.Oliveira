import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the main title and catalog section', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /Encontre seu imóvel com orientação em cada etapa/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Imóveis em destaque/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Construtoras em destaque/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Cury 6 empreendimentos/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Imóveis Minha Casa Minha Vida/i })).toBeInTheDocument();
    expect(screen.getByText('21 resultados')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ver todos os 9 destaques' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ver mais 15 imóveis' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Perguntas frequentes/i })).toBeInTheDocument();
    expect(screen.getAllByRole('img', { name: /José A. Oliveira, corretor de imóveis, CRECI 331912-F/i })).toHaveLength(2);
  });

  it('filters the catalog by region and shows an empty state for an unmatched search', () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText('Região'), { target: { value: 'Zona Oeste' } });
    expect(screen.getByText('5 resultados')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Busca'), { target: { value: 'empreendimento inexistente' } });
    expect(screen.getByRole('heading', { name: 'Nenhum imóvel encontrado' })).toBeInTheDocument();
  });

  it('filters the catalog from a featured builder card', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('link', { name: /Cury 6 empreendimentos/i }));

    expect(screen.getByLabelText('Construtora')).toHaveValue('Cury');
    expect(screen.getByText('6 resultados')).toBeInTheDocument();
  });
});
