export type Category = 'strategy' | 'party' | 'family';

export type Product = {
  id: number;
  name: string;
  category: Category;
  price: number;
  image: string;
};
