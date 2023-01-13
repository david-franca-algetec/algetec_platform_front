import { api } from '../config/reducers/apiSlice';
import { Department, DepartmentCreate, DepartmentUpdate } from '../models/department.model';

export const departmentApi = api.injectEndpoints({
  endpoints: (build) => ({
    getDepartments: build.query<Department[], void>({
      query: () => 'departments/all',
      providesTags: ['Department'],
    }),
    createDepartment: build.mutation<Department, DepartmentCreate>({
      query: (body) => ({
        url: 'departments/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Department'],
    }),
    updateDepartment: build.mutation<Department, DepartmentUpdate>({
      query: (body) => ({
        url: `departments/update/${body.id}}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Department'],
    }),
    destroyDepartment: build.mutation<void, number>({
      query: (id) => ({
        url: `departments/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Department'],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDestroyDepartmentMutation,
} = departmentApi;
