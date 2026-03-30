import { baseApi } from "../baseApi";
import type { IResponse, GetQueryParams, IPaginationMeta, IProduct } from "@/types";

interface GetAllFoodsResponse {
  success: boolean;
  data: IProduct[];
  meta: IPaginationMeta;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ⭐ CREATE PRODUCT
    createProduct: builder.mutation<IResponse<IProduct>, FormData>({
      query: (formData) => ({
        url: "/product/create-product",
        method: "POST",
        data: formData,
      }),
    }),

    // ⭐ UPDATE PRODUCT
    updateProduct: builder.mutation<IResponse<IProduct>, { _id: string; formData: FormData }>({
      query: ({ _id, formData }) => ({
        url: `/product/${_id}`,
        method: "PATCH",
        data: formData,
      })
    }),

    // ⭐ DELETE PRODUCT
    deleteProduct: builder.mutation<IResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
    }),

    // ⭐ GET SINGLE PRODUCT
    getSingleProduct: builder.query<IResponse<IProduct>, string>({
      query: (slug) => ({
        url: `/product/${slug}`,
        method: "GET",
      }),
    }),

    // ⭐ GET ALL products
    getAllProducts: builder.query<GetAllFoodsResponse, GetQueryParams>({
      query: (params) => ({
        url: "/product/all-products",
        method: "GET",
        params,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetSingleProductQuery,
  useDeleteProductMutation,
  useGetAllProductsQuery
} = productApi;
