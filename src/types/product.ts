export interface Metadata {
  animation_url: string | null;
  attributes: Attribute[] | null;
  chain: Chain;
  contract_address: string;
  created_at: string;
  description: string | null;
  external_url: string | null;
  id: string;
  image: string | null;
  name: string | null;
  updated_at: string | null;
  youtube_url: string | null;
}

export interface Pricing {
  id: number;
  product_id: number;
  currency: string;
  currency_type: string;
  amount: number;
}

export interface Attribute {
  trait_type: string;
  value: string | number | boolean;
}

export interface Chain {
  id: string;
  name: string;
}

export interface ProductsResult {
  productData: Product[];
}
export interface Product {
  id: number;
  name: string;
  description: string;
  rarity: string;
  contract_address: string;
  metadata_id: string;
  pricing: Pricing[];
}

export interface ProductWithMetadata extends Product {
  metadata: Metadata | undefined
}
