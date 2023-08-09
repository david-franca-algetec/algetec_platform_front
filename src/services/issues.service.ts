import { isNil, omitBy } from 'lodash';
import { createSearchParams, URLSearchParamsInit } from 'react-router-dom';
import { api } from '../config/reducers/apiSlice';
import { Issue } from '../models/issues.models';

interface IssuesWithParams {
  data: Issue[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    first_page: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url?: string | null;
    previous_page_url?: string | null;
  };
}

export interface QueryString {
  page?: number;
  limit?: number;
  priority?: number[];
  problem?: string;
  responsible?: number[];
  creator?: number[];
  field?: string;
  order?: string;
  status?: string[];
  tag?: string[];
  approved?: boolean;
  experiment?: string;
  version?: string;
}

export const issuesApi = api.injectEndpoints({
  endpoints: (build) => ({
    allIssues: build.query<IssuesWithParams, QueryString>({
      query: (queryParams) => {
        const params = omitBy(queryParams, isNil) as URLSearchParamsInit;

        return `issues/all?${createSearchParams(params).toString()}`;
      },
      providesTags: ['Issues'],
    }),
    showIssues: build.query<Issue, number>({
      query: (id) => `issues/show/${id}`,
      providesTags: ['Issues'],
    }),
    updateIssues: build.mutation<void, { id: number; formData: FormData }>({
      query: (body) => ({
        url: `issues/update/${body.id}`,
        method: 'PUT',
        body: body.formData,
      }),
      invalidatesTags: ['Issues'],
    }),
    createIssues: build.mutation<void, FormData>({
      query: (body) => ({
        url: `issues/massCreate`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Issues'],
    }),
    deleteIssues: build.mutation<void, number>({
      query: (id) => ({
        url: `issues/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Issues'],
    }),
  }),
});

export const {
  useAllIssuesQuery,
  useCreateIssuesMutation,
  useDeleteIssuesMutation,
  useShowIssuesQuery,
  useUpdateIssuesMutation,
} = issuesApi;
