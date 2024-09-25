export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number; 
  imageUrl: string; 
  size?: string;
}

export interface ICartContextType {
  cartItems: IProduct[];
  addToCart: (product: number) => Promise<boolean>;
  removeFromCart: (product: number) => void;
  total: number;
  proceedToBuy: () => Promise<void>;
  purchasedItems: IProduct[];
}
