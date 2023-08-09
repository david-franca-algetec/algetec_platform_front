// Route.get('/demandFiles/all', 'DemandFilesController.index')

// Route.get('/demandFiles//:id', 'DemandFilesController.getUrl')

// Route.delete('/demandFiles/delete/:id', 'DemandFilesController.delete')

import { api } from '../config/reducers/apiSlice';
import { User } from '../models';

interface IDemandFiles {
  id: number;
  demand_id: number;
  department_id: number;
  user_id: number;
  link: string;
  created_at: string;
  updated_at: string;
  department?: null;
  user: User;
}

export const uploadApi = api.injectEndpoints({
  endpoints: (build) => ({
    getDemandFiles: build.query<IDemandFiles[], void>({
      query: () => 'demandFiles/all',
    }),
    getUrl: build.query<{ url: string }, number>({
      query: (id) => `demandFiles/getUrl/${id}`,
    }),
    deleteDemandFile: build.mutation<void, number>({
      query: (id) => ({
        url: `demandFiles/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Demands'],
    }),
  }),
});

export const { useDeleteDemandFileMutation } = uploadApi;
