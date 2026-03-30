import { IRegister, IRegisterResponse } from "@/types/auth.types";
import { baseApi } from "../baseApi";
import type { IUser, IUserApiResponse, IResponse, GetQueryParams, IPaginationMeta } from "@/types";

interface GetAllUsersResponse {
  success: boolean;
  data: IUser[];
  meta: IPaginationMeta;
}

export const userApi = baseApi.injectEndpoints({

  // CREATE USER
  endpoints: (builder) => ({
    register: builder.mutation<IResponse<IRegisterResponse>, FormData>({
      query: (formData) => ({
        url: "/user/create-user",
        method: "POST",
        data: formData,
      }),
    }),

    // UPDATE USER
    updateUser: builder.mutation<
      IResponse<IUser>,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        data: data,
      }),
    }),

    // DELETE USER
    deleteUser: builder.mutation<IResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
    }),

    // GET SINGLE USER
    getSingleUser: builder.query<IUserApiResponse, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
    }),

    getAllUsers: builder.query<GetAllUsersResponse, GetQueryParams>({
      query: (params) => ({
        url: "/user/all-users",
        method: "GET",
        params: params
      }),
    }),

    getAllCustomers: builder.query<GetAllUsersResponse, GetQueryParams>({
      query: (params) => ({
        url: "/user/all-customers",
        method: "GET",
        params: params
      }),
    }),

    //  GET ME (Logged-in user's own profile)
    getMe: builder.query<IUserApiResponse, void>({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useRegisterMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetSingleUserQuery,
  useGetAllUsersQuery,
  useGetAllCustomersQuery,
  useGetMeQuery
} = userApi;
