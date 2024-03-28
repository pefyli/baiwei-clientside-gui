export class Member {
  member_id: number;
  member_name: string;
  account: string;
  password: string;
  phone: string;
  address: string;
  role_id: number;
  create_datetime: Date;
  picture: string;

  constructor(data: any) {
    this.member_id = data.member_id;
    this.member_name = data.member_name;
    this.account = data.account;
    this.password = data.password;
    this.phone = data.phone;
    this.address = data.address;
    this.role_id = data.role_id;
    this.create_datetime = data.create_datetime;
    this.picture = data.picture;
  }
}
