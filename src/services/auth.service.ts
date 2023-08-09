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

export interface ICaptchaResponse {
  success: boolean;
  challenge_ts: string; // timestamp of the challenge load
  hostname: string; // the hostname of the site where the reCAPTCHA was solved
  'error-codes': number[]; // optional
}

export interface ICaptchaRequest {
  secret: string; // Required. The shared key between your site and reCAPTCHA.
  response: string; // Required. The user response token provided by the reCAPTCHA client-side integration on your site.
  remoteip?: string; // Optional. The user's IP address.
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
    captchaVerify: build.mutation<ICaptchaResponse, ICaptchaRequest>({
      query: (body) => ({
        url: "https://www.google.com/recaptcha/api/siteverify",
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
