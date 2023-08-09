import { api } from '../config/reducers/apiSlice';

export const imagesApi = api.injectEndpoints({
  endpoints: (build) => ({
    createImage: build.mutation<{ links: string[] }, FormData>({
      query: (body) => ({
        url: 'images/create',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCreateImageMutation } = imagesApi;
