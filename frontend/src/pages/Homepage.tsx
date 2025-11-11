import ProductList from "../components/Products/ProductList";

import {
  useGetFeaturedQuery,
  useGetNewArrivalsQuery,
} from "@/store/slices/productsApiSlice";

const Homepage = () => {
  const { data: featuredProducts = [] } = useGetFeaturedQuery(undefined);
  const { data: newProducts = [] } = useGetNewArrivalsQuery(undefined);

  return (
    <main className="my-10">
      <div className="mb-10">
        <h1 className="text-center text-2xl font-bold mb-10">Populars</h1>
        <ProductList products={newProducts.products} />
      </div>
      <div>
        <h1 className="text-center text-2xl font-bold mb-10">
          Featured Products
        </h1>
        <ProductList products={featuredProducts.products} />
      </div>
    </main>
  );
};

export default Homepage;
