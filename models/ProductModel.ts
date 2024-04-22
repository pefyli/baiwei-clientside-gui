export class Product {
  product_id: number;
  category_id: number;
  product_name: string;
  price: number;
  product_description: string;
  inventory_quantity: number;
  create_datetime: string;
  update_datetime: string;

  constructor(data: any) {
    this.product_id = data.product_id;
    this.category_id = data.category_id;
    this.product_name = data.product_name;
    this.price = data.price;
    this.product_description = data.product_description;
    this.inventory_quantity = data.inventory_quantity;
    this.create_datetime = data.create_datetime;
    this.update_datetime = data.update_datetime;
  }
}
