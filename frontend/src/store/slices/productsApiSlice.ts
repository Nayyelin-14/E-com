import type { FiltersMeta } from "@/index.types";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNewArrivals: builder.query({
      query: () => ({
        url: "/products/new-arrivals",
        method: "GET",
      }),
    }),
    getFeatured: builder.query({
      query: () => ({
        url: "/products/is_featured",
        method: "GET",
      }),
    }),
    getSingleProduct: builder.query({
      query: (id: string) => ({
        url: `/products/details/${id}`,
        method: "GET",
      }),
    }),
    getFiltersMeta: builder.query<FiltersMeta, string>({
      query: () => ({
        url: `/products/filters/meta`,
        method: "GET",
      }),
    }),
    getAllProductsWithFilters: builder.query({
      query: ({
        keyword,
        category,
        sizes,
        minPrice,
        maxPrice,
        colors,
        sortBy,
      }) => {
        const params = new URLSearchParams();

        if (Array.isArray(sizes) && sizes.length > 0) {
          params.append("size", sizes.join(","));
        }

        if (Array.isArray(colors) && colors.length > 0) {
          params.append("color", colors.join(","));
        }
        if (keyword) params.append("keyword", keyword);
        if (category) params.append("category", category);
        if (minPrice) params.append("minPrice", minPrice);
        if (maxPrice) params.append("maxPrice", maxPrice);
        if (sortBy) params.append("sortBy", sortBy);

        return `/products/getallproducts?${params.toString()}`;
      },
    }),
  }),
});

export const {
  useGetFeaturedQuery,
  useGetNewArrivalsQuery,
  useGetAllProductsWithFiltersQuery,
  useGetSingleProductQuery,
  useGetFiltersMetaQuery,
} = productsApiSlice;
