import type { Product } from "./ProductModel";

export class ShoppingCart {
  member_id: number;
  cart_id: number;
  amount: number;
  create_datetime: string;
  update_datetime: string;
  product: Product;

  constructor(data: any) {
    this.cart_id = data.cart_id;
    this.member_id = data.member_id;
    this.amount = data.amount;
    this.create_datetime = data.create_datetime;
    this.update_datetime = data.update_datetime;
    this.product = data.product;
  }
}
