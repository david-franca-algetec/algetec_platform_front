import { api } from '../config/reducers/apiSlice';

export interface ReleaseType {
  id: number;
  name: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface ReleaseTypeUpdate {
  id: number;
  color?: string;
  name?: string;
}

export type ReleaseTypeCreate = Pick<ReleaseType, 'color' | 'name'>;

export const releaseTypesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getReleaseTypes: build.query<ReleaseType[], void>({
      query: () => '/releaseTypes/all',
      providesTags: ['ReleaseTypes'],
    }),
    updateReleaseType: build.mutation<ReleaseType, ReleaseTypeUpdate>({
      query: (release) => ({
        url: `/releaseTypes/update/${release.id}`,
        method: 'PUT',
        body: release,
      }),
      invalidatesTags: ['ReleaseTypes'],
    }),
    createReleaseType: build.mutation<ReleaseType, ReleaseTypeCreate>({
      query: (release) => ({
        url: '/releaseTypes/create',
        method: 'POST',
        body: release,
      }),
      invalidatesTags: ['ReleaseTypes'],
    }),
    deleteReleaseType: build.mutation<void, number>({
      query: (id) => ({
        url: `/releaseTypes/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ReleaseTypes'],
    }),
  }),
});

export const { useCreateReleaseTypeMutation, useGetReleaseTypesQuery } = releaseTypesApi;
