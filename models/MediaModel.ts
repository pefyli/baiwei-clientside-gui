export class Media {
  product_media_id: number;
  product_media: { type: string; data: number[] };
  product_id: number;
  media_type: number;
  display_location: number;
  create_datetime: string;

  constructor(data: any) {
    this.product_media_id = data.product_media_id;
    this.product_media = data.product_media;
    this.product_id = data.product_id;
    this.media_type = data.media_type;
    this.display_location = data.display_location;
    this.create_datetime = data.create_datetime;
  }
}
