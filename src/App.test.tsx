import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the main title and catalog section', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /Encontre seu imóvel com orientação em cada etapa/i })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: /Imóveis de grandes construtoras/i })).toHaveLength(2);
    expect(screen.getByRole('heading', { name: /Perguntas frequentes/i })).toBeInTheDocument();
    expect(screen.getAllByRole('img', { name: /Logo JAO/i })).toHaveLength(2);
  });
});
