export type PropertyType = 'Apartamento' | 'Casa';
export type PropertyCategory =
  | 'Na planta'
  | 'Em construção'
  | 'Quase pronto'
  | 'Pronto'
  | 'Imóvel avulso';

export interface Property {
  id: string;
  slug: string;
  name: string;
  builder: string;
  type: PropertyType;
  category: PropertyCategory;
  region: string;
  city: string;
  neighborhood: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  deliveryDate?: string;
  mcmv: boolean;
  featured: boolean;
  description: string;
  highlights: string[];
  images: string[];
}

export interface PropertyFilters {
  search: string;
  region: string;
  type: string;
  category: string;
  builder: string;
  bedrooms: string;
  priceRange: string;
  mcmv: boolean;
  sort: 'menor-preco' | 'maior-preco';
}
