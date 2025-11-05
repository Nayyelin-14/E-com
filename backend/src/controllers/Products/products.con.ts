import { CustomUser } from "../../middlewares/isAuth";
import Product from "../../models/products.model";
import User from "../../models/user.model";
import asyncHandler from "../../utils/asynHandler";
import { NextFunction, Request, Response } from "express";
export const createProduct = asyncHandler(
  async (req: CustomUser, res: Response, next: NextFunction) => {
    // Get user ID from authenticated request (assuming auth middleware sets req.user)
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401);
      throw new Error("User not authenticated");
    }
    const existingUser = await User.findById(userId);
    if (!existingUser || existingUser?.role !== "admin") {
      res.status(403);
      throw new Error("Unauthorized User");
    }

    const {
      name,
      description,
      price,
      rating_count,
      createdAt,
      updatedAt,
      is_Featured,
      is_newArrival,
      images,
      category,
      colors,
      sizes,
      instock_count,
    } = req.body;

    const newProduct = await Product.create({
      name,
      description,
      price,
      rating_count,
      createdAt,
      updatedAt,
      is_Featured,
      is_newArrival,
      images,
      category,
      colors,
      sizes,
      instock_count,
      user: userId,
    });

    if (newProduct) {
      res.status(200).json({
        isSuccess: true,
        message: "New Product is created successfully!!!",
        newProduct,
      });
    } else {
      res.status(400).json({
        isSuccess: false,
        message: "Something went wrong",
      });
    }
  }
);

export const deleteProduct = asyncHandler(
  async (req: CustomUser, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const userID = req.user?.userId;

      if (!userID) {
        res.status(401);
        throw new Error("User not authenticated");
      }

      const product = await Product.findById(productId);

      if (!product) {
        res.status(404);
        throw new Error("Product not found");
      }

      // Check if user owns the product or is admin
      if (product.user.toString() !== userID && req.user?.role !== "admin") {
        res.status(403);
        throw new Error("Not authorized to delete this product");
      }

      await Product.findByIdAndDelete(productId);

      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);

export const updateProduct = asyncHandler(
  async (req: CustomUser, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const userID = req.user?.userId;

      if (!userID) {
        res.status(401);
        throw new Error("User not authenticated");
      }

      const product = await Product.findById(productId);

      if (!product) {
        res.status(404);
        throw new Error("Product not found");
      }

      // Check if user owns the product or is admin
      if (product.user.toString() !== userID && req.user?.role !== "admin") {
        res.status(403);
        throw new Error("Not authorized to update this product");
      }

      // Partial update - only update fields that are provided
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { $set: req.body },
        {
          new: true, // Return updated document
          runValidators: true, // Run schema validators
        }
      );

      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  }
);
export const getProductsWithFilter = asyncHandler(
  async (req: CustomUser, res: Response, next: NextFunction) => {
    try {
      const { keyword, category, size, minPrice, maxPrice, color, sortBy } =
        req.query;
      const userID = req.user?.userId;

      if (!userID) {
        res.status(401).json({ message: "User is not authenticated" });
        return;
      }

      const query: any = {};
      if (keyword) query.name = { $regex: keyword as string, $options: "i" };
      if (category) query.category = category;
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
      if (size) query.sizes = { $in: [size] };
      if (color) query.colors = { $in: [color] };

      const sortOptions: any = {};
      if (sortBy === "price_asc") sortOptions.price = 1;
      if (sortBy === "price_desc") sortOptions.price = -1;
      if (sortBy === "latest") sortOptions.createdAt = -1;
      if (sortBy === "rating") sortOptions.rating_count = -1;

      const products = await Product.find(query).sort(sortOptions);

      if (!products.length) {
        res.status(404).json({ message: "No products found" });
        return;
      }

      res.status(200).json({ success: true, count: products.length, products });
    } catch (error) {
      next(error);
    }
  }
);

export const getSingleProduct = asyncHandler(
  async (req: CustomUser, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const userID = req.user?.userId;

      // Optional: restrict to authenticated users
      if (!userID) {
        res.status(401).json({ message: "User is not authenticated" });
        return;
      }

      const product = await Product.findById(productId);

      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      next(error);
    }
  }
);

export const getFeaturedProducts = asyncHandler(
  async (req: CustomUser, res: Response, next: NextFunction) => {
    try {
      const userID = req.user?.userId;

      // Optional: restrict to authenticated users
      if (!userID) {
        res.status(401).json({ message: "User is not authenticated" });
        return;
      }
      const featuredProducts = await Product.find({ is_Featured: true }).sort({
        createdAt: -1,
      });

      if (featuredProducts.length === 0) {
        res.status(404).json({ message: "No featured products found" });
        return;
      }

      res.status(200).json({
        success: true,
        count: featuredProducts.length,
        products: featuredProducts,
      });
    } catch (error) {
      next(error);
    }
  }
);
export const getNewArrivals = asyncHandler(
  async (req: CustomUser, res: Response, next: NextFunction) => {
    try {
      const userID = req.user?.userId;

      // Optional: restrict to authenticated users
      if (!userID) {
        res.status(401).json({ message: "User is not authenticated" });
        return;
      }
      const newArrivals = await Product.find({ is_newArrival: true }).sort({
        createdAt: -1,
      });

      if (newArrivals.length === 0) {
        res.status(404).json({ message: "No new arrivals found" });
        return;
      }

      res.status(200).json({
        success: true,
        count: newArrivals.length,
        products: newArrivals,
      });
    } catch (error) {
      next(error);
    }
  }
);
