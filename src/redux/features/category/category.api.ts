import { baseApi } from "../baseApi";
import type { GetQueryParams, ICategory, IPaginationMeta, IResponse } from "@/types";

interface GetAllCategoriesResponse {
    success: boolean;
    data: ICategory[];
    meta: IPaginationMeta;
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ⭐ CREATE CATEGORY
    createCategory: builder.mutation<IResponse<ICategory>, FormData>({
      query: (formData) => ({
        url: "/category/create-category",
        method: "POST",
        data: formData,
      }),
    }),

    // ⭐ UPDATE CATEGORY
    updateCategory: builder.mutation<
      IResponse<ICategory>,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/category/${id}`,
        method: "PATCH",
        data: formData,
      })
    }),

    // ⭐ DELETE CATEGORY
    deleteCategory: builder.mutation<IResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      })
    }),

    // ⭐ GET SINGLE CATEGORY (by slug)
    getSingleCategory: builder.query<IResponse<ICategory>, string>({
      query: (slug) => ({
        url: `/category/${slug}`,
        method: "GET",
      })
    }),

    // ⭐ GET ALL CATEGORIES
    getAllCategories: builder.query<GetAllCategoriesResponse | undefined, GetQueryParams>({
      query: (params) => ({
        url: "/category/all-categories",
        method: "GET",
        params
      })
    }),

  }),

  overrideExisting: true,
});


export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetSingleCategoryQuery,
  useGetAllCategoriesQuery,
} = categoryApi;
