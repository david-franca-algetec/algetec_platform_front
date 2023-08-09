import { api } from '../config/reducers/apiSlice';
import { IssueTag } from '../models/issueTag.model';

export const issuesTagsApi = api.injectEndpoints({
  endpoints: (build) => ({
    allIssuesTags: build.query<IssueTag[], void>({
      query: () => 'issueTags/all',
      providesTags: ['IssuesTags'],
    }),
    updateIssuesTags: build.mutation<IssueTag, number>({
      query: (id) => `issueTags/show/${id}`,
      invalidatesTags: ['IssuesTags'],
    }),
    createIssuesTags: build.mutation({
      query: () => `issueTags/create`,
      invalidatesTags: ['IssuesTags'],
    }),
  }),
});

export const { useAllIssuesTagsQuery } = issuesTagsApi;
