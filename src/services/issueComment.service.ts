import { api } from '../config/reducers/apiSlice';

export interface IssueCommentsCreate {
  issue_id: number; // id da issue a qual o comentário vai pertencer
  comment: string;
}

export const issuesCommentsApi = api.injectEndpoints({
  endpoints: (build) => ({
    createIssuesComments: build.mutation<void, IssueCommentsCreate>({
      query: (body) => ({
        url: `issueComments/create`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Issues'],
    }),
  }),
});

export const { useCreateIssuesCommentsMutation } = issuesCommentsApi;
