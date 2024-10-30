export interface Project {
    name: string;
    cost: number;
    ID: string;
    delivered_products: string[];
    start_datum: number;
    purchased_on: null | Date;
  }