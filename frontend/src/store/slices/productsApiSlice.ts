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
  }),
});

export const {
  useGetFeaturedQuery,
  useGetNewArrivalsQuery,
  useGetSingleProductQuery,
} = productsApiSlice;
