export type OrderItem = {
  name: string;
  productId: string;
  quantity: number;
  price: number;
  image: string;
};

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  bill: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  updatedAt: string;
  createdAt: string;
  customer: string;
};
