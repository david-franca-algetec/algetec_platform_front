import { api } from '../config/reducers/apiSlice';
import { IssueFile } from '../models/issuesFile.model';

export const issuesFilesApi = api.injectEndpoints({
  endpoints: (build) => ({
    allIssuesFiles: build.query<IssueFile[], void>({
      query: () => 'issuesFiles/all',
      providesTags: ['IssuesFiles'],
    }),
    updateIssuesFiles: build.mutation({
      query: (id) => `issuesFiles/show/${id}`,
      invalidatesTags: ['IssuesFiles'],
    }),
    createIssuesFiles: build.mutation({
      query: () => "issuesFiles/create",
      invalidatesTags: ['IssuesFiles'],
    }),
    deleteIssuesFiles: build.mutation<void, number>({
      query: (id) => `issuesFiles/delete/${id}`,
      invalidatesTags: ['IssuesFiles'],
    }),
  }),
});

export const {
  useAllIssuesFilesQuery,
  useCreateIssuesFilesMutation,
  useDeleteIssuesFilesMutation,
  useUpdateIssuesFilesMutation,
} = issuesFilesApi;
