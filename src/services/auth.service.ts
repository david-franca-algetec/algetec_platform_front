import { api } from '../config/reducers/apiSlice';
import { UserCreate, UserResponse } from '../models/user.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  email: string;
  name: string;
  role_id: number;
  department_id: number;
  expires_at: string;
  created_at: string;
  updated_at: string;
  id: number;
}

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<UserResponse, LoginRequest>({
      query: (body) => ({
        url: 'login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    register: build.mutation<RegisterResponse, UserCreate>({
      query: (body) => ({
        url: 'users/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: 'logout',
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApi;

export const {
  endpoints: { login: loginEndpoint, register: registerEndpoint, logout: logoutEndpoint },
} = authApi;
