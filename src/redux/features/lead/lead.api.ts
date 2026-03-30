import { baseApi } from "../baseApi";
import type { IResponse, GetQueryParams, IPaginationMeta } from "@/types";
import {ILead, ILeadApiResponse, ILeadResponse, LeadInput} from "@/types/lead.types";

interface GetAllLeadResponse {
  success: boolean;
  data: ILead[];
  meta: IPaginationMeta;
}

export const leadApi = baseApi.injectEndpoints({

  // CREATE USER
  endpoints: (builder) => ({
    createLead: builder.mutation<IResponse<ILeadResponse>, LeadInput>({
      query: (formData) => ({
        url: "/lead/create-lead",
        method: "POST",
        data: formData,
      }),
    }),

    // UPDATE USER
    updateLead: builder.mutation<
        IResponse<ILead>,
        { id: string; data: LeadInput }
    >({
      query: ({ id, data }) => ({
        url: `/lead/${id}`,
        method: "PATCH",
        data: data,
      }),
    }),

    // DELETE USER
    deleteLead: builder.mutation<IResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/lead/${id}`,
        method: "DELETE",
      })
    }),

    // GET SINGLE USER
    getSingleLead: builder.query<ILeadApiResponse, string>({
      query: (id) => ({
        url: `/lead/${id}`,
        method: "GET",
      }),
    }),

    getAllLead: builder.query<GetAllLeadResponse, GetQueryParams>({
      query: (params) => ({
        url: "/lead/all-leads",
        method: "GET",
        params: params
      })
    }),


  }),
  overrideExisting: true,
});

export const {
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useGetSingleLeadQuery,
  useGetAllLeadQuery,
} = leadApi;
