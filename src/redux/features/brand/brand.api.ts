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
    createBrand: builder.mutation<IResponse<ICategory>, FormData>({
      query: (formData) => ({
        url: "/brand/create-brand",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["BRANDS"],
    }),

    // ⭐ UPDATE CATEGORY
    updateBrand: builder.mutation<
      IResponse<ICategory>,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/brand/${id}`,
        method: "PATCH",
        data: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        "BRANDS",
        { type: "BRAND", id },
      ],
    }),

    // ⭐ DELETE CATEGORY
    deleteBrand: builder.mutation<IResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/brand/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "BRANDS",
        { type: "BRAND", id },
      ],
    }),

    // ⭐ GET SINGLE CATEGORY (by slug)
    getSingleBrand: builder.query<IResponse<ICategory>, string>({
      query: (slug) => ({
        url: `/brand/${slug}`,
        method: "GET",
      }),
      providesTags: (result, error, slug) => [
        { type: "BRAND", id: slug },
      ],
    }),

    // ⭐ GET ALL CATEGORIES
    getAllBrands: builder.query<GetAllBrandsResponse | undefined, GetQueryParams>({
      query: (params) => ({
        url: "/brand/all-brands",
        method: "GET",
        params
      }),
      providesTags: ["BRANDS"],
    }),

    //
    getAllTrashBrands: builder.query<GetAllBrandsResponse, GetQueryParams>({
      query: (params) => ({
        url: "/brand/all-trash-brands",
        method: "GET",
        params,
      }),
      providesTags: ["BRANDS"],
    }),

    // ⭐ TRASH UPDATE PRODUCT and Restore both work
    trashUpdateBrand: builder.mutation<IResponse<IBrand>, { _id: string;}>({
      query: ({ _id }) => ({
        url: `/product/brand-trash/${_id}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { _id }) => ["BRANDS", { type: "BRAND", _id }],
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
    useTrashUpdateBrandMutation,
    useGetAllTrashBrandsQuery,
} = brandApi;
