import { api } from '../config/reducers/apiSlice';
import { ContentType, ContentTypeCreate, ContentTypeUpdate } from '../models/contentType.model';

export const contentTypeApi = api.injectEndpoints({
  endpoints: (build) => ({
    getContentTypes: build.query<ContentType[], void>({
      query: () => 'contentTypes/all',
      providesTags: ['ContentType'],
    }),
    createContentType: build.mutation<ContentType, ContentTypeCreate>({
      query: (body) => ({
        url: 'contentTypes/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ContentType'],
    }),
    updateContentType: build.mutation<ContentType, ContentTypeUpdate>({
      query: (body) => ({
        url: `contentTypes/update/${body.id}}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['ContentType'],
    }),
    destroyContentType: build.mutation<void, number>({
      query: (id) => ({
        url: `contentTypes/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ContentType'],
    }),
  }),
});

export const {
  useGetContentTypesQuery,
  useCreateContentTypeMutation,
  useUpdateContentTypeMutation,
  useDestroyContentTypeMutation,
} = contentTypeApi;
