import Loader from "@/common/Loader";
import Filters from "@/components/Filters";
import ProductList from "@/components/Products/ProductList";
import { useGetAllProductsWithFiltersQuery } from "@/store/slices/productsApiSlice";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

const AllProducts = () => {
  const allowedFilters = [
    "keyword",
    "category",
    "color",
    "size",
    "minPrice",
    "maxPrice",
  ];
  const location = useLocation();
  const navigate = useNavigate();
  const QueryParams = new URLSearchParams(location.search);
  const initialKeyword = QueryParams.get("keyword") || "";
  const categoryFromURL = QueryParams.get("category") || "";
  // Get multiple colors and sizes from URL (comma-separated)
  const colorsFromURL =
    QueryParams.get("color")?.split(",").filter(Boolean) || [];
  const sizesFromURL =
    QueryParams.get("size")?.split(",").filter(Boolean) || [];
  const minPriceFromURL = QueryParams.get("minPrice") || "";
  const maxPriceFromURL = QueryParams.get("maxPrice") || "";
  const filters = {
    keyword: initialKeyword,
    category: categoryFromURL,
    colors: colorsFromURL,
    sizes: sizesFromURL,
    minPrice: minPriceFromURL ? Number(minPriceFromURL) : undefined,
    maxPrice: maxPriceFromURL ? Number(maxPriceFromURL) : undefined,
  };

  const invalidFilters = Array.from(QueryParams.keys()).filter(
    (key) => !allowedFilters.includes(key)
  );

  const {
    data,
    isLoading: dataLoading,
    error,
    isFetching,
    refetch,
  } = useGetAllProductsWithFiltersQuery(filters, {
    refetchOnMountOrArgChange: true,
  });

  const handlePriceChange = (min: string, max: string) => {
    if (min) {
      QueryParams.set("minPrice", min);
    } else {
      QueryParams.delete("minPrice");
    }

    if (max) {
      QueryParams.set("maxPrice", max);
    } else {
      QueryParams.delete("maxPrice");
    }

    navigate(`/products?${QueryParams.toString()}`, { replace: true });
  };

  const handleFilterChange = (
    filterType: "color" | "size",
    value: string,
    isChecked: boolean
  ): void => {
    const currentValues =
      QueryParams.get(filterType)?.split(",").filter(Boolean) || [];

    let newValues;
    if (isChecked) {
      // Add value if checked
      newValues = currentValues.includes(value)
        ? currentValues
        : [...currentValues, value];
    } else {
      // Remove value if unchecked
      newValues = currentValues.filter((v) => v !== value);
    }

    // Update or remove the param
    if (newValues.length > 0) {
      QueryParams.set(filterType, newValues.join(","));
    } else {
      QueryParams.delete(filterType);
    }

    navigate(`/products?${QueryParams.toString()}`, { replace: true });
  };
  const activeFiltersList = Object.entries(filters).flatMap(
    ([key, value]): { key: string; value: string | number }[] => {
      if (Array.isArray(value)) return value.map((v) => ({ key, value: v }));
      if (typeof value === "string" && value.trim() !== "")
        return [{ key, value }];
      if (typeof value === "number") return [{ key, value }];
      return [];
    }
  );

  useEffect(() => {
    if (invalidFilters.length) {
      toast.warning(`Ignoring invalid filters: ${invalidFilters.join(", ")}`);
      navigate("/products", { replace: true });
    }
  }, [invalidFilters, invalidFilters.length, navigate]);

  let content;

  if (dataLoading || isFetching) {
    content = (
      <div className="flex-1 flex items-center justify-center">
        <Loader />
      </div>
    );
  } else if (error) {
    content = (
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
        <svg
          className="w-24 h-24 mx-auto text-red-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-2xl font-semibold text-gray-700">
          Something went wrong
        </h3>
        <p className="text-gray-500 max-w-md">
          We couldn't load the products. Please try again later.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  } else if (!data?.products || data.products.length === 0) {
    content = (
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
        <svg
          className="w-24 h-24 mx-auto text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="text-2xl font-semibold text-gray-700">
          No Products Found
        </h3>
        <p className="text-gray-500 max-w-md">
          {initialKeyword || categoryFromURL
            ? `We couldn't find any products matching your search criteria.`
            : `There are no products available at the moment.`}
        </p>
        {(initialKeyword || categoryFromURL) && (
          <button
            onClick={() => navigate("/products")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Products
          </button>
        )}
      </div>
    );
  } else {
    content = (
      <div className="flex-1">
        <ProductList products={data.products} />
      </div>
    );
  }

  return (
    <div className="flex gap-6 min-h-[60vh] px-4 my-10">
      <div className="w-[200px] flex-shrink-0">
        <Filters
          selectedColors={colorsFromURL}
          selectedSizes={sizesFromURL}
          onFilterChange={handleFilterChange}
          onPriceChange={handlePriceChange}
          filterCount={activeFiltersList?.length}
          minPrice={minPriceFromURL}
          maxPrice={maxPriceFromURL}
        />
      </div>
      {content}
    </div>
  );
};

export default AllProducts;
