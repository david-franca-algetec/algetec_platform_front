import { api } from '../config/reducers/apiSlice';

export interface ITemplate {
  id: number;
  name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export type TemplateCreate = Pick<ITemplate, 'name' | 'content'>;

export type TemplateUpdate = Partial<TemplateCreate> & { id: number };
export const templatesApi = api.injectEndpoints({
  endpoints: (build) => ({
    allTemplates: build.query<ITemplate[], void>({
      query: () => 'templates/all',
      providesTags: ['Templates'],
    }),
    showTemplate: build.query<ITemplate, number>({
      query: (id) => `templates/show/${id}`,
      providesTags: ['Templates'],
    }),
    updateTemplate: build.mutation<void, TemplateUpdate>({
      query: (body) => ({
        url: `templates/update/${body.id}`,
        body,
        method: 'PUT',
      }),
      invalidatesTags: ['Templates'],
    }),
    createTemplate: build.mutation<void, TemplateCreate>({
      query: (body) => ({
        url: "templates/create",
        body,
        method: 'POST',
      }),
      invalidatesTags: ['Templates'],
    }),
    deleteTemplate: build.mutation<void, number>({
      query: (id) => ({
        url: `templates/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Templates'],
    }),
  }),
});

export const {
  useCreateTemplateMutation,
  useAllTemplatesQuery,
  useDeleteTemplateMutation,
  useShowTemplateQuery,
  useUpdateTemplateMutation,
} = templatesApi;
