import { api } from '../config/reducers/apiSlice';
import { IChecklist, IChecklistCreate, IChecklistUpdate } from '../models/checklist.model';

interface Response {
  message: string;
}

export const checklistApi = api.injectEndpoints({
  endpoints: (build) => ({
    getChecklists: build.query<IChecklist[], void>({
      query: () => 'checklists/all',
      providesTags: ['Checklist'],
    }),
    createChecklist: build.mutation<Response, IChecklistCreate>({
      query: (body) => ({
        url: 'checklists/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Checklist'],
    }),
    updateChecklist: build.mutation<IChecklist, IChecklistUpdate>({
      query: (body) => ({
        url: `checklists/update/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Checklist'],
    }),
    destroyChecklist: build.mutation<void, number>({
      query: (id) => ({
        url: `checklists/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Checklist'],
    }),
  }),
});

export const {
  useGetChecklistsQuery,
  useCreateChecklistMutation,
  useUpdateChecklistMutation,
  useDestroyChecklistMutation,
} = checklistApi;
