import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { properties } from './data/properties';
import { propertyCatalogNote, siteConfig } from './config/site';
import type { Property, PropertyFilters } from './types/property';
import { formatArea, formatCurrency, normalizeText } from './utils/formatters';
import { buildSimulationMessage, getWhatsAppUrl } from './utils/whatsapp';

const defaultFilters: PropertyFilters = {
  search: '',
  region: 'all',
  type: 'all',
  category: 'all',
  builder: 'all',
  bedrooms: 'all',
  priceRange: 'all',
  mcmv: false,
  sort: 'menor-preco',
};

const regionOptions = ['all', 'Zona Leste', 'Zona Sul', 'Zona Norte', 'Zona Oeste', 'Osasco', 'Guarulhos', 'Grande São Paulo'];
const typeOptions = ['all', 'Apartamento', 'Casa'];
const categoryOptions = ['all', 'Na planta', 'Em construção', 'Quase pronto', 'Pronto', 'Imóvel avulso'];
const builderOptions = ['all', ...new Set(properties.map((property) => property.builder))];
const bedroomsOptions = ['all', '1', '2', '3', '4'];
const priceOptions = ['all', '0-400000', '400001-600000', '600001-800000', '800001-999999'];
const whatsappGreeting = 'Olá, José! Visitei seu site e gostaria de conhecer as opções de imóveis disponíveis.';
const visitMessage = 'Olá, José! Gostaria de consultar os decorados disponíveis e agendar uma visita.';
const faqItems = [
  ['Como encontro o imóvel certo?', 'José reúne possibilidades de diferentes construtoras e imóveis avulsos de acordo com seu perfil. Disponibilidade, valores e condições são confirmados no atendimento.'],
  ['José atende quais regiões?', 'O atendimento cobre São Paulo, Grande São Paulo e interior, de forma online ou presencial conforme a necessidade.'],
  ['Posso visitar um imóvel decorado?', 'Sim. Fale com José pelo WhatsApp para consultar os decorados disponíveis e combinar uma visita.'],
  ['A pré-simulação garante aprovação de crédito?', 'Não. Ela serve apenas para organizar o primeiro contato. A aprovação depende da análise da instituição financeira e das regras vigentes.'],
  ['Como funciona o atendimento?', 'José entende seu perfil, compara opções de localização, configuração e condições, e acompanha você nas próximas etapas da escolha.'],
];
const navigationItems = [
  ['Início', '#inicio'],
  ['Imóveis', '#imoveis'],
  ['Sobre José', '#sobre-jose'],
  ['Simulação', '#simulacao'],
  ['Perguntas frequentes', '#faq'],
];

function App() {
  const [filters, setFilters] = useState<PropertyFilters>(defaultFilters);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    regiao: '',
    renda: '',
    fgts: false,
    somarRenda: false,
    tipoImovel: 'Apartamento',
    dormitorios: '2 dormitórios',
    prazo: 'Entre 12 e 24 meses',
    atendimento: 'Presencial',
    consent: false,
  });

  const filteredProperties = useMemo(() => {
    const filtered = properties.filter((property) => {
      const matchesSearch = !filters.search || [property.name, property.neighborhood, property.city].some((value) => normalizeText(value).includes(normalizeText(filters.search)));
      const matchesRegion = filters.region === 'all' || property.region === filters.region;
      const matchesType = filters.type === 'all' || property.type === filters.type;
      const matchesCategory = filters.category === 'all' || property.category === filters.category;
      const matchesBuilder = filters.builder === 'all' || property.builder === filters.builder;
      const matchesBedrooms = filters.bedrooms === 'all' || property.bedrooms.toString() === filters.bedrooms;
      const matchesMcmv = !filters.mcmv || property.mcmv;

      let matchesPrice = true;
      if (filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (Number.isFinite(min) && Number.isFinite(max)) {
          matchesPrice = property.price >= min && property.price <= max;
        } else if (Number.isFinite(min)) {
          matchesPrice = property.price >= min;
        }
      }

      return matchesSearch && matchesRegion && matchesType && matchesCategory && matchesBuilder && matchesBedrooms && matchesPrice && matchesMcmv;
    });

    return filtered.sort((a, b) => {
      if (filters.sort === 'maior-preco') return b.price - a.price;
      return a.price - b.price;
    });
  }, [filters]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedProperty) {
        setSelectedProperty(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedProperty]);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return;
    }

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) {
      document.documentElement.classList.add('reduced-motion');
    }
  }, []);

  const handleFilterChange = (key: keyof PropertyFilters, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters(defaultFilters);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = { ...formData };
    const message = buildSimulationMessage(data);
    const url = getWhatsAppUrl(message);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const updateField = (field: keyof typeof formData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const propertyCountLabel = `${filteredProperties.length} ${filteredProperties.length === 1 ? 'resultado' : 'resultados'}`;
  const contactLinks = {
    whatsapp: getWhatsAppUrl(whatsappGreeting),
    phone: `tel:${siteConfig.phone}`,
    email: `mailto:${siteConfig.email}`,
  };

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand-block">
            <img className="site-logo" src="/images/logo-jose-oliveira.png" alt="José A. Oliveira, corretor de imóveis, CRECI 331912-F" />
          </div>

          <nav className="desktop-nav" aria-label="Navegação principal">
            {navigationItems.map(([label, href]) => (
              <a key={label} href={href}>{label}</a>
            ))}
          </nav>

          <div className="header-actions">
            <a href={contactLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="button button-primary">Falar com José</a>
            <button className="menu-button" aria-label="Abrir menu" aria-expanded={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen((prev) => !prev)}>
              ☰
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="mobile-nav" aria-label="Menu móvel">
            {navigationItems.map(([label, href]) => (
              <a key={label} href={href} onClick={() => setIsMobileMenuOpen(false)}>{label}</a>
            ))}
          </nav>
        )}
      </header>

      <main>
        <section id="inicio" className="hero section">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Corretor imobiliário em São Paulo</p>
              <h1>Encontre seu imóvel com orientação em cada etapa.</h1>
              <p className="lead">Apartamentos e oportunidades em São Paulo, Grande São Paulo e interior, com atendimento próximo para ajudar você a comparar opções e tomar uma decisão mais segura.</p>
              <div className="cta-row">
                <a href="#imoveis" className="button button-primary">Conhecer os imóveis</a>
                <a href={contactLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="button button-secondary">Falar com José</a>
              </div>
              <ul className="hero-pills" aria-label="Indicadores do corretor">
                <li>CRECI {siteConfig.creci}</li>
                <li>Atendimento humano</li>
                <li>{siteConfig.serviceArea}</li>
              </ul>
            </div>
            <div className="hero-media">
              <div className="image-shell">
                <img src="/images/properties/edificios-cidade.jpeg" alt="Edifícios residenciais ilustrativos em uma cidade brasileira" loading="eager" />
              </div>
            </div>
          </div>
        </section>

        <section id="atendimento" className="section section-alt">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Áreas atendidas</p>
              <h2>Atendimento onde você procura</h2>
              <p>Encontre oportunidades em toda a cidade de São Paulo, Grande São Paulo e também no interior. José ajuda você a comparar localização, características e condições de cada imóvel.</p>
            </div>
            <div className="area-grid">
              {[['São Paulo', '/images/properties/edificios-cidade.jpeg'], ['Grande São Paulo', '/images/properties/edificios-condominio.jpeg'], ['Interior', '/images/properties/apartamento-decorado.jpeg']].map(([name, image]) => (
                <article className="area-card" key={name}>
                  <img src={image} alt={`${name}, imagem imobiliária ilustrativa`} loading="lazy" />
                  <div><h3>{name}</h3><p>Oportunidades ilustrativas para conhecer possibilidades.</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="imoveis" className="section catalog-wrap">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Catálogo</p>
              <h2>Imóveis de grandes construtoras</h2>
              <p>{propertyCatalogNote}</p>
            </div>

            <div className="catalog-toolbar">
              <div className="filter-toggle-wrap">
                <button className="button button-filter" onClick={() => setIsFilterOpen((prev) => !prev)}>
                  {isFilterOpen ? 'Ocultar filtros' : 'Exibir filtros'}
                </button>
              </div>
              <div className="results-count" aria-live="polite">{propertyCountLabel}</div>
            </div>

            <div className={`filters-panel ${isFilterOpen ? 'open' : ''}`}>
              <div className="filter-grid">
                <label>
                  <span>Busca</span>
                  <input type="search" value={filters.search} onChange={(event) => handleFilterChange('search', event.target.value)} placeholder="Nome, bairro ou cidade" />
                </label>

                <label>
                  <span>Região</span>
                  <select value={filters.region} onChange={(event) => handleFilterChange('region', event.target.value)}>
                    {regionOptions.map((option) => (
                      <option key={option} value={option}>{option === 'all' ? 'Todas' : option}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Tipo</span>
                  <select value={filters.type} onChange={(event) => handleFilterChange('type', event.target.value)}>
                    {typeOptions.map((option) => (
                      <option key={option} value={option}>{option === 'all' ? 'Todos' : option}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Estágio</span>
                  <select value={filters.category} onChange={(event) => handleFilterChange('category', event.target.value)}>
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>{option === 'all' ? 'Todos' : option}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Construtora</span>
                  <select value={filters.builder} onChange={(event) => handleFilterChange('builder', event.target.value)}>
                    {builderOptions.map((option) => (
                      <option key={option} value={option}>{option === 'all' ? 'Todas' : option}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Quartos</span>
                  <select value={filters.bedrooms} onChange={(event) => handleFilterChange('bedrooms', event.target.value)}>
                    {bedroomsOptions.map((option) => (
                      <option key={option} value={option}>{option === 'all' ? 'Qualquer' : `${option} quarto(s)`}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Faixa de preço</span>
                  <select value={filters.priceRange} onChange={(event) => handleFilterChange('priceRange', event.target.value)}>
                    {priceOptions.map((option) => (
                      <option key={option} value={option}>{option === 'all' ? 'Qualquer valor' : `R$ ${option.replace('-', ' a R$ ').replace('0-400000', '0 a 400.000').replace('400001-600000', '400.001 a 600.000').replace('600001-800000', '600.001 a 800.000').replace('800001-999999', '800.001 a 999.999')}`}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Ordenar</span>
                  <select value={filters.sort} onChange={(event) => handleFilterChange('sort', event.target.value)}>
                    <option value="menor-preco">Menor preço</option>
                    <option value="maior-preco">Maior preço</option>
                  </select>
                </label>

                <label className="checkbox-wrap">
                  <input type="checkbox" checked={filters.mcmv} onChange={(event) => handleFilterChange('mcmv', event.target.checked)} />
                  <span>Minha Casa Minha Vida</span>
                </label>
              </div>

              <div className="filter-actions">
                <button className="button button-secondary" onClick={clearFilters}>Limpar filtros</button>
              </div>
            </div>

            {filteredProperties.length === 0 ? (
              <div className="empty-state" role="status" aria-live="polite">
                <h3>Nenhum imóvel encontrado</h3>
                <p>Tente outra busca ou limpe os filtros para ampliar a busca.</p>
              </div>
            ) : (
              <div className="property-grid">
                {filteredProperties.map((property) => (
                  <article key={property.id} className="property-card">
                    <div className="property-media">
                      <img src={property.images[0]} alt={`Imóvel ${property.name}`} loading="lazy" />
                    </div>
                    <div className="property-body">
                      <div className="property-header-row">
                        <h3>{property.name}</h3>
                        <span className="property-builder">{property.builder}</span>
                      </div>
                      <p className="property-location">{property.neighborhood} • {property.region}</p>

                      <div className="property-price">{formatCurrency(property.price)}</div>

                      <div className="property-meta">
                        <span>{formatArea(property.area)}</span>
                        <span>{property.bedrooms} quartos</span>
                        <span>{property.parkingSpaces} vagas</span>
                      </div>

                      <div className="property-status-row">
                        <span className="status-pill">{property.category}</span>
                        {property.mcmv && <span className="status-pill status-green">MCMV</span>}
                      </div>

                      <button className="button button-primary full-width" onClick={() => setSelectedProperty(property)}>Ver detalhes</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="mcmv" className="section">
          <div className="container mcmv-grid">
            <div>
              <p className="eyebrow">Minha Casa Minha Vida</p>
              <h2>Organizar a decisão com clareza</h2>
              <p>José pode ajudar a mapear sua situação e a comparar alternativas com mais segurança, sem prometer aprovação.</p>
              <ul className="check-list">
                <li>Renda familiar</li>
                <li>Uso de FGTS</li>
                <li>Composição de renda</li>
                <li>Região desejada</li>
                <li>Documentação inicial</li>
                <li>Comparação entre aluguel e financiamento</li>
              </ul>
              <p className="small-note">“A pré-simulação não representa aprovação de crédito. Valores, subsídios, taxas e condições dependem das regras vigentes e da análise da instituição financeira.”</p>
            </div>
            <div className="info-card">
              <h3>Antes de seguir em frente</h3>
              <p>É importante reunir informações reais sobre renda e objetivos, para que a busca fique alinhada ao seu perfil e ao que a sua realidade permite.</p>
            </div>
          </div>
        </section>

        <section id="construtoras" className="section section-alt">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Empresas no catálogo</p>
              <h2>Imóveis de grandes construtoras</h2>
              <p>{propertyCatalogNote}</p>
            </div>
            <div className="builder-list">{['Cyrela', 'Vivaz', 'Plano & Plano', 'Kazzas', 'Cury', 'EPH', 'MRV', 'Vibra', 'QuintoAndar'].map((builder) => <span key={builder}>{builder}</span>)}</div>
          </div>
        </section>

        <section id="visitas" className="section visit-section">
          <div className="container visit-callout">
            <div><p className="eyebrow">Visitas</p><h2>Conheça os decorados</h2><p>Veja de perto os ambientes, as plantas e os detalhes dos empreendimentos. Fale com José para consultar os decorados disponíveis e agendar uma visita.</p></div>
            <button className="button button-primary" onClick={() => { const url = getWhatsAppUrl(visitMessage); if (url) window.open(url, '_blank', 'noopener,noreferrer'); }}>Agendar uma visita</button>
          </div>
        </section>

        <section id="sobre-jose" className="section section-alt">
          <div className="container about-grid">
            <div className="about-photo">
              <img src="/images/jose-oliveira-profissional.png" alt="José A. Oliveira, corretor de imóveis" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none'; event.currentTarget.nextElementSibling?.classList.add('visible'); }} />
              <span className="avatar-fallback">JAO</span>
            </div>
            <div>
              <p className="eyebrow">Sobre José</p>
              <h2>Um atendimento próximo, do primeiro contato à escolha do imóvel</h2>
              <div className="about-details"><strong>{siteConfig.realtorName}</strong><span>Corretor de imóveis</span><span>CRECI {siteConfig.creci}</span><span>Atendimento em {siteConfig.serviceArea}</span><a href={contactLinks.phone}>Telefone: {siteConfig.phoneDisplay}</a><a href={contactLinks.email}>E-mail: {siteConfig.email}</a></div>
              <p className="quote">“O conhecimento transforma uma simples transação na realização de um sonho.”</p>
              <p>José A. Oliveira atua no mercado imobiliário com foco em um atendimento claro, humano e personalizado. Seu trabalho começa entendendo o perfil, a região desejada e as necessidades de cada cliente para apresentar opções adequadas entre diferentes construtoras e imóveis disponíveis.</p>
              <div className="cta-row"><a href={contactLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="button button-primary">WhatsApp</a><a href={contactLinks.phone} className="button button-secondary">Ligar</a><a href={contactLinks.email} className="button button-secondary">E-mail</a></div>
            </div>
          </div>
        </section>

        <section id="simulacao" className="section form-section">
          <div className="container form-grid">
            <div>
              <p className="eyebrow">Pré-simulação</p>
              <h2>Receba orientação antes da decisão</h2>
              <p>Preencha os campos e abra uma mensagem organizada no WhatsApp de José. Nenhuma informação é armazenada ou enviada para APIs.</p>
            </div>

            <form onSubmit={handleFormSubmit} className="simulation-form">
              <div className="form-grid-two">
                <label>
                  <span>Nome</span>
                  <input type="text" value={formData.nome} onChange={(event) => updateField('nome', event.target.value)} required />
                </label>
                <label>
                  <span>WhatsApp</span>
                  <input type="tel" value={formData.whatsapp} onChange={(event) => updateField('whatsapp', event.target.value)} placeholder="(11) 99999-9999" inputMode="tel" required />
                </label>
              </div>

              <div className="form-grid-two">
                <label>
                  <span>Região desejada</span>
                  <input type="text" value={formData.regiao} onChange={(event) => updateField('regiao', event.target.value)} placeholder="São Paulo, Grande SP, Zona Sul..." required />
                </label>
                <label>
                  <span>Faixa de renda</span>
                  <select value={formData.renda} onChange={(event) => updateField('renda', event.target.value)} required>
                    <option value="">Selecione</option>
                    <option>Até R$ 4.000</option>
                    <option>R$ 4.001 a R$ 7.000</option>
                    <option>R$ 7.001 a R$ 12.000</option>
                    <option>Acima de R$ 12.000</option>
                  </select>
                </label>
              </div>

              <div className="form-grid-two compact-checks">
                <label className="checkbox-wrap"><input type="checkbox" checked={formData.fgts} onChange={(event) => updateField('fgts', event.target.checked)} /><span>Possui FGTS</span></label>
                <label className="checkbox-wrap"><input type="checkbox" checked={formData.somarRenda} onChange={(event) => updateField('somarRenda', event.target.checked)} /><span>Pretende somar renda</span></label>
              </div>

              <div className="form-grid-two">
                <label>
                  <span>Tipo de imóvel</span>
                  <select value={formData.tipoImovel} onChange={(event) => updateField('tipoImovel', event.target.value)}>
                    <option>Apartamento</option>
                    <option>Casa</option>
                    <option>Indiferente</option>
                  </select>
                </label>
                <label>
                  <span>Quantidade de dormitórios</span>
                  <select value={formData.dormitorios} onChange={(event) => updateField('dormitorios', event.target.value)}>
                    <option>1 dormitório</option>
                    <option>2 dormitórios</option>
                    <option>3 dormitórios</option>
                    <option>Indiferente</option>
                  </select>
                </label>
                <label>
                  <span>Prazo pretendido</span>
                  <select value={formData.prazo} onChange={(event) => updateField('prazo', event.target.value)}>
                    <option>Entre 12 e 24 meses</option>
                    <option>Até 12 meses</option>
                    <option>Mais de 24 meses</option>
                  </select>
                </label>
              </div>

              <label>
                <span>Atendimento</span>
                <select value={formData.atendimento} onChange={(event) => updateField('atendimento', event.target.value)}>
                  <option>Presencial</option>
                  <option>Online</option>
                  <option>Indiferente</option>
                </select>
              </label>

              <label className="checkbox-wrap consent-box">
                <input type="checkbox" checked={formData.consent} onChange={(event) => updateField('consent', event.target.checked)} required />
                <span>Autorizo o uso destas informações exclusivamente para que José entre em contato sobre minha busca por um imóvel.</span>
              </label>

              <button className="button button-primary" type="submit">Abrir WhatsApp</button>

            </form>
          </div>
        </section>

        <section id="faq" className="section section-alt faq-section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Dúvidas comuns</p>
              <h2>Perguntas frequentes</h2>
              <p>Informações rápidas para você entender o atendimento e os próximos passos.</p>
            </div>
            <div className="faq-list">
              {faqItems.map(([question, answer]) => (
                <details className="faq-item" key={question}>
                  <summary>{question}<span aria-hidden="true">+</span></summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-intro">
            <img className="site-logo footer-logo" src="/images/logo-jose-oliveira.png" alt="José A. Oliveira, corretor de imóveis, CRECI 331912-F" />
            <p>Orientação próxima para comparar imóveis e escolher com mais segurança.</p>
            <span className="footer-creci">CRECI {siteConfig.creci}</span>
          </div>

          <div className="footer-column">
            <h3>Contato</h3>
            <a href={contactLinks.phone}>{siteConfig.phoneDisplay}</a>
            <a href={contactLinks.email}>{siteConfig.email}</a>
            <span>{siteConfig.serviceArea}</span>
          </div>

          <div className="footer-column">
            <h3>Atalhos</h3>
            <a href={contactLinks.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href="#imoveis">Ver imóveis</a>
            <a href="#faq">Perguntas frequentes</a>
            <a href="#privacidade">Política de privacidade</a>
          </div>

          <div className="footer-note">
            <p>Atendimento para comparar localizações, configurações e condições de imóveis.</p>
            <span>© {new Date().getFullYear()} {siteConfig.realtorName}</span>
          </div>
        </div>
      </footer>

      {selectedProperty && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="property-modal-title" onClick={() => setSelectedProperty(null)}>
          <div className="property-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" aria-label="Fechar detalhes do imóvel" onClick={() => setSelectedProperty(null)}>×</button>
            <div className="modal-gallery">
              {selectedProperty.images.map((image, index) => (
                <img key={image} src={image} alt={`${selectedProperty.name} - imagem ${index + 1}`} loading="lazy" />
              ))}
            </div>
            <div className="modal-content">
              <div className="property-header-row">
                <h3 id="property-modal-title">{selectedProperty.name}</h3>
                <span className="property-builder">{selectedProperty.builder}</span>
              </div>
              <p className="property-location">{selectedProperty.neighborhood} • {selectedProperty.region}</p>
              <div className="property-price">{formatCurrency(selectedProperty.price)}</div>
              <p>{selectedProperty.description}</p>
              <ul className="feature-list">
                {selectedProperty.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
              </ul>
              <div className="detail-metadata">
                <span>{selectedProperty.category}</span>
                <span>{selectedProperty.type}</span>
                <span>{selectedProperty.bedrooms} quarto(s)</span>
                <span>{selectedProperty.bathrooms} banheiro(s)</span>
                <span>{selectedProperty.parkingSpaces} vaga(s)</span>
                <span>{formatArea(selectedProperty.area)}</span>
              </div>
              <div className="modal-actions">
                <a href="#simulacao" className="button button-primary" onClick={() => setSelectedProperty(null)}>Pré-simulação</a>
                <a href={siteConfig.whatsapp ? `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}` : '#simulacao'} className="button button-secondary" target={siteConfig.whatsapp ? '_blank' : undefined} rel={siteConfig.whatsapp ? 'noreferrer' : undefined}>WhatsApp</a>
              </div>
              <p className="small-note">Consulte disponibilidade e valores atualizados com José.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
