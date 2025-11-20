export interface User {
  user: {
    name: string;
    email: string;
    role: "customer" | "admin";
    profileImage?: {
      url: string;
      publicId: string;
      alt?: string;
    };
    createdAt?: string; // Dates as ISO strings
    updatedAt?: string;
  };
}

export interface LoginInputs {
  email: string;
  password: string;
}

export interface RegisterInputs extends LoginInputs {
  name: string;
}
export interface avatarInput {
  profileImage: string;
}
export interface EditableInfos {
  user?: { name: string; email: string; createdAt?: string };
}
export interface PasswordUpdate {
  oldPassword: string;
  newPassword: string;
}

export type Image = {
  url: string;
  _id?: string;
};
export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  rating_count: number;
  sizes: string[];
  colors: string[];
  images: Image[];
  instock_count: number;
  is_Featured: boolean;
  is_newArrival: boolean;
  createdAt: string | Date;
};

export type ProductProps = {
  products: Product[];
};

export type FiltersMeta = {
  filters: {
    sizes: string[];
    colors: string[];
    minPrice: number;
    maxPrice: number;
  };
};
export type ProductResponse = {
  success: boolean;
  data: Product;
  message?: string;
};

export type Response = {
  isSuccess: boolean;
  message?: string;
};
