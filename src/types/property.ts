export type PropertyRegion =
  | 'Centro'
  | 'Grande São Paulo'
  | 'Interior'
  | 'Litoral'
  | 'Zona Leste'
  | 'Zona Norte'
  | 'Zona Oeste'
  | 'Zona Sul';

export interface Property {
  id: string;
  slug: string;
  name: string;
  builder: string;
  type: 'Apartamento';
  region: PropertyRegion;
  city: string;
  location: string;
  areaLabel?: string;
  bedroomsLabel?: string;
  bedroomOptions?: number[];
  parkingLabel?: string;
  statusLabel?: string;
  featured: boolean;
  description: string;
  highlights: string[];
  images: string[];
  sourceUrl: string;
}

export interface PropertyFilters {
  search: string;
  region: string;
  builder: string;
  bedrooms: string;
  sort: 'nome' | 'regiao';
}
