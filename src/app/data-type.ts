export interface login {
  email: string; 
  password: string;
}

export interface product{
  name:string,
  price:number,
  category:string,
  color:string,
  image:string,
  description:string,
  id:number,
  quantity:undefined | number,
  productId:undefined|number,
  thumbnail : string,
  title : string
}

// export interface cart{
//   name:string,
//   price:number,
//   category:string,
//   color:string,
//   image:string,
//   description:string,
//   id:number| undefined,
//   quantity:undefined | number,
//   productId:number,
//   userId:number
// }

export interface priceSummary{
  price:number,
  discount:number,
  tax:number,
  delivery:number,
  total:number
}

export interface order {
  email:string,
  address:string,
  contact:string,
  totalPrice:number,
  userId:string,
  id:number|undefined
}

export interface ApiResponse {
  products: product[];
  total: number;
  skip: number;
  limit: number;
}
