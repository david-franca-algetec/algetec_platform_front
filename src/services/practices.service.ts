import { api } from '../config/reducers/apiSlice';
import { Experiment } from '../models/experiments.model';

export interface Area {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CompetenceArea {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Curriculum {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Competence {
  id: number;
  curriculum_id: number;
  competence_area_id: number;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
  competence_area: CompetenceArea;
  curriculum: Curriculum;
}

export interface Skill {
  id: number;
  competence_id: number;
  code: string;
  description: string;
  notes: string;
  created_at: string;
  updated_at: string;
  competence: Competence;
}

export type ExperimentWithArea = Experiment & {
  areas: Area[];
};

export interface Practice {
  id: number;
  experiment_id: number;
  name: string;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
  experiment: ExperimentWithArea;
  skills: Skill[];
}

export type UpdatePracticeProps = Pick<Practice, 'name' | 'description' | 'experiment_id' | 'code'> & {
  areas: string[];
};

export type UpdatePractice = Partial<UpdatePracticeProps> & { id: number };

interface PracticesCreate {
  code: string;
  name: string;
  description: string;
  experiment_id: number;
  areas: string[];
}

const practicesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPractices: builder.query<Practice[], void>({
      query: () => '/practices/all',
      providesTags: ['Practices'],
    }),
    showPractice: builder.query<Practice, number>({
      query: (id) => `/practices/show/${id}`,
      providesTags: ['Practices'],
      transformResponse: (response: Practice[]) => response[0],
    }),
    createPractice: builder.mutation<void, PracticesCreate>({
      query: (data) => ({
        url: '/practices/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Practices'],
    }),
    deletePractice: builder.mutation<void, number>({
      query: (id) => ({
        url: `/practices/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Practices'],
    }),
    updatePractice: builder.mutation<void, UpdatePractice>({
      query: (data) => ({
        url: `/practices/update/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Practices'],
    }),
    allAreas: builder.query<Area[], void>({
      query: () => '/practices/allAreas',
      providesTags: ['Areas'],
    }),
  }),
});

export const {
  useGetPracticesQuery,
  useCreatePracticeMutation,
  useDeletePracticeMutation,
  useAllAreasQuery,
  useShowPracticeQuery,
  useUpdatePracticeMutation,
} = practicesApi;
