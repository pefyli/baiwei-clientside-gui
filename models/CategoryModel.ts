export class Category {
  category_id: number;
  category_name: string;
  create_datetime: string;
  update_datetime: string;

  constructor(data: any) {
    this.category_id = data.category_id;
    this.category_name = data.category_name;
    this.create_datetime = data.create_datetime;
    this.update_datetime = data.update_datetime;
  }
}
