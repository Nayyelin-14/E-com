import { z } from "zod";

export const Image_Types = [
  "image/jpg",
  "image/png",
  "image/jpeg",
  "image/webp",
];
export const productSchema = z.object({
  name: z
    .string("Product name is required")
    .min(3, "Product name must be at least 3 characters")
    .trim(),

  description: z
    .string("Description must be a string")
    .min(10, "Description must be at least 10 characters"),

  price: z
    .number("Price is required")
    .min(0, "Price must be greater tahn zero")
    .positive("Price must be a positive number"),

  rating_count: z
    .number()
    .int("Rating count must be an integer")
    .nonnegative("Rating count must be a non-negative integer")
    .optional(),

  is_Featured: z.boolean("is_Featured must be a boolean").optional(),

  is_newArrival: z.boolean("is_newArrival must be a boolean").optional(),

  images: z
    .array(
      z.object({
        file: z.instanceof(File).optional(),
        url: z.string(),
        public_alt: z.string().optional(),
      })
    )
    .min(1, "At least one image is required"),

  category: z.string("Category is required").nonempty("Category is required"),

  colors: z.array(z.string()).min(1, "At least one color is required"),

  sizes: z
    .array(z.enum(["xs", "s", "m", "lg", "xl", "xxl"]))
    .min(1, "At least one size is required"),
  instock_count: z
    .number("Stock count is required")
    .int("Stock count must be a non-negative integer")
    .nonnegative("Stock count must be a non-negative integer"),
});
