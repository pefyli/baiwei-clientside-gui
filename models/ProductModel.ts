import type { Item } from "./ItemModel";

export class Product {
  product_id: number;
  category_id: number;
  product_name: string;
  product_description: string;
  mediaUrls: string[];
  items: Item[];
  create_datetime: string;
  update_datetime: string;

  constructor(data: any) {
    this.product_id = data.product_id;
    this.category_id = data.category_id;
    this.product_name = data.product_name;
    this.product_description = data.product_description;
    this.items = data.items;
    this.create_datetime = data.create_datetime;
    this.update_datetime = data.update_datetime;
    this.mediaUrls = data.mediaUrls;
  }
}
