import { api } from '../config/reducers/apiSlice';
import { Role, RoleCreate, RoleUpdate } from '../models/role.model';

export const roleApi = api.injectEndpoints({
  endpoints: (build) => ({
    getRoles: build.query<Role[], void>({
      query: () => 'roles/all',
      providesTags: ['Role'],
    }),
    createRole: build.mutation<Role, RoleCreate>({
      query: (body) => ({
        url: 'roles/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Role'],
    }),
    updateRole: build.mutation<Role, RoleUpdate>({
      query: (body) => ({
        url: `roles/update/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Role'],
    }),
    deleteRole: build.mutation<void, number>({
      query: (id) => ({
        url: `roles/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Role'],
    }),
  }),
});

export const { useGetRolesQuery, useCreateRoleMutation, useUpdateRoleMutation, useDeleteRoleMutation } = roleApi;
