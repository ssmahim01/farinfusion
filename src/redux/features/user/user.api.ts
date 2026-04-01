import { IRegisterResponse } from "@/types/auth.types";
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
      invalidatesTags: () => ["USERS"],
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
      invalidatesTags: (result, error, { id }) => [
        "USERS",
        { type: "USER", id },
      ],
    }),

    // DELETE USER
    deleteUser: builder.mutation<IResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "USERS",
        { type: "USER", id },
      ],
    }),

    // GET SINGLE USER
    getSingleUser: builder.query<IUserApiResponse, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "USER", id }],
    }),

    getAllUsers: builder.query<GetAllUsersResponse, GetQueryParams>({
      query: (params) => ({
        url: "/user/all-users",
        method: "GET",
        params: params
      }),
      providesTags: ["USERS"],
    }),

    getAllCustomers: builder.query<GetAllUsersResponse, GetQueryParams>({
      query: (params) => ({
        url: "/user/all-customers",
        method: "GET",
        params: params
      }),
      providesTags: ["CUSTOMERS"],
    }),

    //  GET ME (Logged-in user's own profile)
    getMe: builder.query<IUserApiResponse, void>({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),

      providesTags: ["ME", "USER"],
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
