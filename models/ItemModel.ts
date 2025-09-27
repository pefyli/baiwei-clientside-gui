export class Item {
  item_id: number;
  product_id: number;
  product_name?: string;
  quantity: number;
  spec: string;
  color: string;
  price: number;
  create_datetime: string;
  update_datetime: string;

  constructor(data: any) {
    this.item_id = data.item_id;
    this.product_id = data.product_id;
    this.quantity = data.quantity;
    this.spec = data.spec;
    this.color = data.color;
    this.price = data.price;
    this.create_datetime = data.create_datetime;
    this.update_datetime = data.update_datetime;
  }
}
