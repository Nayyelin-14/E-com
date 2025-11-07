// ProductList.tsx
import type { ProductProps } from "@/index.types";
import ProductsCards from "./ProductsCards";

const ProductList = ({ products }: ProductProps) => {
  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products &&
        products.length > 0 &&
        products.map((p, index) => (
          <ProductsCards
            key={index}
            id={p._id}
            name={p.name}
            image={p.images[0]?.url}
            colors={Array.isArray(p.colors) ? p.colors : [p.colors]}
            rating={p.rating_count}
            category={p.category}
            price={p.price}
            sizes={p.sizes}
          />
        ))}
    </main>
  );
};

export default ProductList;
