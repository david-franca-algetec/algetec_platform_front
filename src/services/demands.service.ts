import { api } from '../config/reducers/apiSlice';
import { IDemand, DemandCreate, DemandUpdate } from '../models/demands.model';
import { Experiment } from '../models/experiments.model';

export const demandsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getDemands: build.query<IDemand[], void>({
      query: () => 'demands/all',
      providesTags: ['Demands'],
    }),
    getDemandById: build.query<IDemand, number>({
      query: (id) => `demands/show/${id}`,
      providesTags: ['Demands'],
    }),
    storeDemand: build.mutation<IDemand, DemandCreate>({
      query: (body) => ({
        url: 'demands/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Demands'],
    }),
    updateDemand: build.mutation<IDemand, DemandUpdate>({
      query: (body) => ({
        url: `demands/update/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Demands'],
    }),
    destroyDemand: build.mutation<void, number>({
      query: (id) => ({
        url: `demands/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Demands'],
    }),
    getExperiments: build.query<Experiment[], void>({
      query: () => 'demands/experiments',
      providesTags: ['Experiments'],
    }),
  }),
});

export const {
  useGetDemandsQuery,
  useStoreDemandMutation,
  useUpdateDemandMutation,
  useDestroyDemandMutation,
  useGetExperimentsQuery,
  useGetDemandByIdQuery,
} = demandsApi;
