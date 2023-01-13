import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

import { RootState } from '../store';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders(headers, { getState }) {
    const { token } = (getState() as RootState).auth; // get token from redux store
    if (token) {
      headers.set('Authorization', `Bearer ${token.token}`); // set token to header
    }
    return headers; // headers are now correctly set
  },
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 2 }); // retry up to 6 times
export const api = createApi({
  reducerPath: 'api', // this is the name of the reducer
  baseQuery: baseQueryWithRetry, // or baseQuery
  tagTypes: [
    'AssetTag',
    'Department',
    'ContentType',
    'Login',
    'User',
    'Asset',
    'Demands',
    'Role',
    'Institution',
    'Experiments',
  ], // <--- add tagTypes
  endpoints: () => ({}), // <--- add endpoints
});
