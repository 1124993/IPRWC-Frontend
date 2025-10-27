export interface CartItem {
  productId: number;
  productName: string;
  price: number;     // unit price
  quantity: number;
  lineTotal: number;
}

export interface AddCartItemRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
