import express from "express";
import { authenticate, authorization } from "../middlewares/isAuth";
import {
  createProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewArrivals,
  GetProductFilters,
  getProductsWithFilter,
  getSingleProduct,
  updateProduct,
} from "../controllers/Products/products.con";
import { productValidator } from "../utils/validations";
import { validateProductCreaion } from "../middlewares/validate.midd";
import uploadMiddleware from "../middlewares/uploadMiddleware";

const router = express.Router();

router.post(
  "/create-product",
  authenticate,
  authorization(["admin"]),
  uploadMiddleware.array("productImages"), // MUST RUN FIRST
  productValidator,
  validateProductCreaion,
  createProduct
);

router.delete(
  "/delete-product/:productId",
  authenticate,
  authorization(["admin"]),
  deleteProduct
);
router.put(
  "/update-product/:productId",
  authenticate,
  authorization(["admin"]),
  uploadMiddleware.array("productImages"), // MUST RUN FIRST
  productValidator,
  validateProductCreaion,
  updateProduct
);
router.get("/getallproducts", getProductsWithFilter);
router.get("/new-arrivals", getNewArrivals);

router.get("/is_featured", getFeaturedProducts);
router.get("/details/:productId", getSingleProduct);
router.get("/filters/meta", GetProductFilters);
export default router;
