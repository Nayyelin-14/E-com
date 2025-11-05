import { body } from "express-validator";

export const productValidator = [
  body("name")
    .notEmpty()
    .withMessage("Product name is required")
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Product name must be at least 2 characters"),

  body("description").isString().withMessage("Description must be a string"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),

  body("rating_count")
    .isInt({ min: 0 })
    .withMessage("Rating count must be a non-negative integer"),

  body("is_Featured").isBoolean().withMessage("is_Featured must be a boolean"),

  body("is_newArrival")
    .isBoolean()
    .withMessage("is_newArrival must be a boolean"),

  body("images").isArray({ min: 1 }).withMessage("Images must be an array"),
  body("images.*.url").notEmpty().withMessage("Must have url"),
  body("images.*.public_alt").notEmpty().withMessage("Must have public_alt"),
  body("category")
    .notEmpty()
    .withMessage("category is required")
    .isString()
    .withMessage("category must be a string"),

  body("colors").isArray().withMessage("Colors must be an array of strings"),

  body("sizes").isArray().withMessage("Sizes must be an array of strings"),

  body("instock_count")
    .notEmpty()
    .withMessage("Stock count is required")
    .isInt({ min: 0 })
    .withMessage("Stock count must be a non-negative integer"),
];

export const ProfleUpdateValidator = [
  body("email").isEmail().withMessage("Valid email is required").escape(),
  body("name").notEmpty().trim().withMessage("Name is required").escape(),
];

export const PasswordValidator = [
  body("oldPassword")
    .notEmpty()
    .withMessage("Old password is required")
    .isLength({ min: 7 })
    .withMessage("Old password must be at least 7 characters long"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 7 })
    .withMessage("New password must be at least 7 characters long")
    .custom((value, { req }) => {
      if (value === req.body.oldPassword) {
        throw new Error("New password must be different from old password");
      }
      return true;
    }),
];
