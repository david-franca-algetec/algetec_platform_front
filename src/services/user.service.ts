import { api } from '../config/reducers/apiSlice';
import { User, UserCreate, UserUpdate } from '../models/user.model';

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<User[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
    getUserById: build.query<User, number>({
      query: (id) => `/users/${id}`,
      providesTags: ['User'],
    }),
    storeUser: build.mutation<User, UserCreate>({
      query: (user) => ({
        url: '/users/create',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: build.mutation<User, UserUpdate>({
      query: (user) => ({
        url: `/users/${user.id}`,
        method: 'PUT',
        body: user,
      }),
      invalidatesTags: ['User'],
    }),
    destroyUser: build.mutation<User, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useStoreUserMutation,
  useUpdateUserMutation,
  useDestroyUserMutation,
  useGetUserByIdQuery,
} = userApi;
