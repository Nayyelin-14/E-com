import bcrypt from "bcryptjs";
import mongoose, { Schema, model, Document, Types } from "mongoose";
interface Image {
  url: string;
  public_alt: string;
}
export interface IProduct extends Document {
  user: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  rating_count: number;
  createdAt?: Date;
  updatedAt?: Date;
  is_Featured: boolean;
  is_newArrival: boolean;
  images: Image[];
  category: string;
  colors: string[];
  sizes: string[];
  instock_count: number;
}

const productSchema = new Schema<IProduct>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    rating_count: {
      type: Number,
      default: 0,
      min: [0, "Rating count cannot be negative"],
    },
    is_Featured: {
      type: Boolean,
      default: false,
    },
    is_newArrival: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [
        {
          url: String,
          public_alt: String,
        },
      ],
      required: [true, "At least one image is required"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },
    colors: {
      type: [String],
      required: true,
    },
    sizes: {
      type: [String],
      required: true,
    },
    instock_count: {
      type: Number,
      required: [true, "Stock count is required"],
      min: [0, "Stock count cannot be negative"],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
