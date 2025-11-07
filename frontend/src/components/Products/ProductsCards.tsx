import React from "react";
import ProductRating from "./ProductRating";
import { useNavigate } from "react-router";
export interface ProductsCardsProps {
  id: string;
  name: string;
  image: string; // ✅ single image URL
  sizes: string[];
  rating: number;
  category: string;
  price: number;
  colors: string[];
}

const ProductsCards: React.FC<ProductsCardsProps> = ({
  name,
  id,
  image,
  sizes,
  rating,
  category,
  price,
  colors,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white"
      onClick={() => navigate(`/products/${id}`)}
    >
      {/* Image Container with fixed aspect ratio */}
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-2">
        {/* Category */}
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {category}
        </p>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[1rem]">
          {name.length > 20 ? name.slice(0, 20) + "...." : name}
        </h3>

        {/* Rating */}
        <ProductRating ratingCount={rating} />

        {/* Sizes */}
        {sizes && sizes.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {sizes.map((size, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs border border-gray-300 rounded"
              >
                {size}
              </span>
            ))}
          </div>
        )}

        {/* Colors */}
        {colors && colors.length > 0 && (
          <div className="flex gap-2">
            {Array.isArray(colors) ? (
              colors.map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))
            ) : (
              <span className="text-sm text-gray-600">{colors}</span>
            )}
          </div>
        )}

        {/* Price */}
        <p className="text-xl font-bold text-gray-900 mt-3">${price}</p>
      </div>
    </div>
  );
};

export default ProductsCards;
