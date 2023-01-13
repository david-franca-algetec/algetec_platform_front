import { api } from '../config/reducers/apiSlice';
import { Institution, InstitutionCreate, InstitutionUpdate } from '../models/institution.model';

export const institutionApi = api.injectEndpoints({
  endpoints: (build) => ({
    getInstitutions: build.query<Institution[], void>({
      query: () => '/institutions/all',
      providesTags: ['Institution'],
    }),
    getInstitution: build.query<Institution[], number>({
      query: (id) => `/institutions/show/${id}`,
      providesTags: ['Institution'],
    }),
    createInstitution: build.mutation<Institution, InstitutionCreate>({
      query: (institution) => ({
        url: '/institutions/create',
        method: 'POST',
        body: institution,
      }),
      invalidatesTags: ['Institution'],
    }),
    updateInstitution: build.mutation<Institution, InstitutionUpdate>({
      query: (institution) => ({
        url: `/institutions/update/${institution.id}`,
        method: 'PUT',
        body: institution,
      }),
      invalidatesTags: ['Institution'],
    }),
    deleteInstitution: build.mutation<Institution, number>({
      query: (id) => ({
        url: `/institutions/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Institution'],
    }),
  }),
});

export const {
  useGetInstitutionsQuery,
  useGetInstitutionQuery,
  useCreateInstitutionMutation,
  useUpdateInstitutionMutation,
  useDeleteInstitutionMutation,
} = institutionApi;
