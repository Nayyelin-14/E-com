import { CustomUser } from "../../middlewares/isAuth";
import Product from "../../models/products.model";
import User from "../../models/user.model";
import asyncHandler from "../../utils/asynHandler";
import { NextFunction, Request, Response } from "express";
import {
  ProductImagesQueue,
  RemoveProductImagesQueue,
} from "../../utils/queueHelper";
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

      is_Featured,
      is_newArrival,

      category,
      colors,
      sizes,
      instock_count,
    } = req.body;

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one product image required" });
    }
    const newProduct = await Product.create({
      name,
      description,
      price,
      rating_count,

      is_Featured,
      is_newArrival,

      category,
      colors,
      sizes,
      instock_count,
      user: userId,
    });
    await Promise.all(
      files.map(async (file) => {
        const originalName = file.originalname.split(".")[0];
        const uniqueFileName = `${originalName}_${Date.now()}`;

        // enqueue job
        await ProductImagesQueue({
          buffer: file.buffer,
          fileName: uniqueFileName,
          userId: userId,
          folder: "products",
          width: 1200,
          height: 1200,
          quality: 70,
          productId: newProduct._id!.toString(),
        });
      })
    );

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

      const imagesToDelete = product.images.map((img) => img.public_alt);

      try {
        if (imagesToDelete.length > 0) {
          await Promise.all(
            imagesToDelete.map(async (alt) => {
              if (alt) {
                await RemoveProductImagesQueue({
                  public_alt: alt,
                  product_Id: product._id!.toString(),
                });
              }
            })
          );
        }
        await Product.findByIdAndDelete(productId);
      } catch (error) {
        throw new Error("Failed to delete product");
      }
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

      const existingImages = req.body.existingImages
        ? JSON.parse(req.body.existingImages)
        : [];
      const newImages = req.files as Express.Multer.File[];

      //find images to delete in cloud
      const imagesToDelete = product.images.filter(
        (img: any) =>
          !existingImages.some(
            (exImg: any) => exImg.public_alt === img.public_alt
          )
      );
      console.log(imagesToDelete);
      if (imagesToDelete.length > 0) {
        await Promise.all(
          imagesToDelete.map(async (img) => {
            if (img.public_alt) {
              await RemoveProductImagesQueue({
                public_alt: img.public_alt,
                product_Id: product._id!.toString(),
              });
            }
          })
        );
      }
      if (newImages && newImages.length > 0) {
        await Promise.all(
          newImages.map(async (file) => {
            await ProductImagesQueue({
              buffer: file.buffer,
              fileName: file.originalname,
              folder: "products",
              userId: userID,
              width: 800, // or whatever you want
              height: 800,
              quality: 80,
              productId: product._id!.toString(),
            });
          })
        );
      }

      // Partial update - only update fields that are provided
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { $set: req.body },
        {
          new: true, //  updated document
          runValidators: true, // Run schema validators
        }
      );

      res.status(200).json({
        success: true,
        message:
          "Product updated successfully. Images are uploading in the background",
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

      const query: any = {};
      if (keyword) query.name = { $regex: keyword as string, $options: "i" };
      if (category) query.category = category;
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
      if (size) {
        const sizeArray = (size as string).split(",").filter(Boolean);
        query.sizes = { $in: sizeArray };
      }

      if (color) {
        const colorArray = (color as string).split(",").filter(Boolean);
        query.colors = { $in: colorArray };
      }

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

      const product = await Product.findById(productId);

      if (!product) {
        res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      console.error("❌ Error fetching product:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error while fetching product",
        error: (error as Error).message,
      });
    }
  }
);

export const getFeaturedProducts = asyncHandler(
  async (req: CustomUser, res: Response, next: NextFunction) => {
    try {
      const featuredProducts = await Product.find({ is_Featured: true }).sort({
        createdAt: -1,
      });

      if (featuredProducts.length === 0) {
        res.status(404).json({ message: "No featured products found" });
        return;
      }

      return res.status(200).json({
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
      // Find all products where `is_newArrival` is true, sorted by latest first
      const newArrivals = await Product.find({ is_newArrival: true }).sort({
        createdAt: -1,
      });

      // If no products found, return 404
      if (!newArrivals || newArrivals.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No new arrivals found",
        });
      }

      // Otherwise return success response
      return res.status(200).json({
        success: true,
        count: newArrivals.length,
        products: newArrivals,
      });
    } catch (error) {
      console.error("❌ Error fetching new arrivals:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error while fetching new arrivals",
        error: (error as Error).message,
      });
    }
  }
);

export const GetProductFilters = asyncHandler(
  async (req: CustomUser, res: Response, next: NextFunction) => {
    try {
      // Distinct field values
      const sizes = await Product.distinct("sizes");
      const colors = await Product.distinct("colors");
      const categories = await Product.distinct("category");

      // Aggregate min & max price
      const priceRange = await Product.aggregate([
        {
          $group: {
            _id: null,
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
          },
        },
      ]);

      // Format response
      const result = {
        sizes: sizes.sort(),
        colors: colors.sort(),
        categories: categories.sort(),

        minPrice: priceRange[0].minPrice || 0,
        maxPrice: priceRange[0].maxPrice || 0,
      };

      res.status(200).json({
        isSuccess: true,
        message: "Filters fetched successfully",
        filters: result,
      });
    } catch (error) {
      next(error);
    }
  }
);
