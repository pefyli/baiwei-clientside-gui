export class ShoppingCart {
  cart_id: number;
  member_id: number;
  product_id: number;
  amount: string;
  create_datetime: string;
  update_datetime: string;

  constructor(data: any) {
    this.cart_id = data.cart_id;
    this.member_id = data.member_id;
    this.product_id = data.product_id;
    this.amount = data.amount;
    this.create_datetime = data.create_datetime;
    this.update_datetime = data.update_datetime;
  }
}
