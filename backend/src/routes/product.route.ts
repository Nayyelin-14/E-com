import express from "express";
import { authenticate, authorization } from "../middlewares/isAuth";
import {
  createProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewArrivals,
  getProductsWithFilter,
  getSingleProduct,
  updateProduct,
} from "../controllers/Products/products.con";
import { productValidator } from "../utils/validations";
import { validateProductCreaion } from "../middlewares/validate.midd";

const router = express.Router();

router.post(
  "/create-product",
  authenticate,
  authorization(["admin"]),
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
  updateProduct
);
router.get("/getallproducts", authenticate, getProductsWithFilter);
router.get("/is_featured", getFeaturedProducts);
router.get("/:productId", getSingleProduct);
router.get("/new-arrivals", getNewArrivals);
export default router;
