import { api } from '../config/reducers/apiSlice';
import { CreateDemandLog, IDemand } from '../models/demands.model';
import { Experiment } from '../models/experiments.model';
import { ISchedule } from '../models/schedule.model';
import { DemandTags } from '../models/tag.model';

export interface MassUpdate {
  id: number;
  scripting_startedAt?: string;
  scripting_finishedAt?: string;
  scripting_deadline?: number;
  designing_startedAt?: string;
  designing_finishedAt?: string;
  designing_deadline?: number;
  modeling_startedAt?: string;
  modeling_finishedAt?: string;
  modeling_deadline?: number;
  coding_startedAt?: string;
  coding_finishedAt?: string;
  coding_deadline?: number;
  testing_startedAt?: string;
  testing_finishedAt?: string;
  testing_deadline?: number;
  ualab_startedAt?: string;
  ualab_finishedAt?: string;
  ualab_deadline?: number;
}

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
    storeDemand: build.mutation<IDemand, FormData>({
      query: (body) => ({
        url: 'demands/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Demands'],
    }),
    updateDemand: build.mutation<IDemand, { id: number; formData: FormData }>({
      query: (body) => ({
        url: `demands/update/${body.id}`,
        method: 'PUT',
        body: body.formData,
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
    }),
    inactiveLogById: build.mutation<void, { id: number; active: boolean }>({
      query: (body) => ({
        url: `demands/byLog/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Demands'],
    }),
    createLog: build.mutation<void, CreateDemandLog>({
      query: (body) => ({
        url: 'demands/createLog',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Demands'],
    }),
    getByUser: build.query<ISchedule[], number>({
      query: (id) => `demands/byUser/${id}`,
      providesTags: ['Demands'],
    }),
    getDemandsTags: build.query<DemandTags[], void>({
      query: () => 'demandTags/all',
      providesTags: ['Demands'],
    }),
    massUpdateDemands: build.mutation<void, { data: MassUpdate[] }>({
      query: (body) => ({
        url: 'demands/massUpdate',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Demands'],
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
  useInactiveLogByIdMutation,
  useCreateLogMutation,
  useGetByUserQuery,
  useGetDemandsTagsQuery,
  useMassUpdateDemandsMutation,
} = demandsApi;
