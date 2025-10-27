export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  description: string;
  category: 'MEN' | 'WOMEN' | 'UNISEX';
  archived: boolean;
}
