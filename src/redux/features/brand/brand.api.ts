import { baseApi } from "../baseApi";
import type { GetQueryParams, IBrand, ICategory, IPaginationMeta, IResponse } from "@/types";

interface GetAllBrandsResponse {
    success: boolean;
    data: IBrand[];
    meta: IPaginationMeta;
}

export const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ⭐ CREATE CATEGORY
    createBrand: builder.mutation<IResponse<IBrand>, FormData>({
      query: (formData) => ({
        url: "/brand/create-brand",
        method: "POST",
        data: formData,
      })
    }),

    // ⭐ UPDATE CATEGORY
    updateBrand: builder.mutation<
      IResponse<IBrand>,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/brand/${id}`,
        method: "PATCH",
        data: formData,
      })
    }),

    // ⭐ DELETE CATEGORY
    deleteBrand: builder.mutation<IResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/brand/${id}`,
        method: "DELETE",
      })
    }),

    // ⭐ GET SINGLE CATEGORY (by slug)
    getSingleBrand: builder.query<IResponse<IBrand>, string>({
      query: (slug) => ({
        url: `/brand/${slug}`,
        method: "GET",
      }),
    }),

    // ⭐ GET ALL CATEGORIES
    getAllBrands: builder.query<GetAllBrandsResponse | undefined, GetQueryParams>({
      query: (params) => ({
        url: "/brand/all-brands",
        method: "GET",
        params
      })
    }),

  }),

  overrideExisting: true,
});


export const {
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useGetSingleBrandQuery,
  useGetAllBrandsQuery,
} = brandApi;
