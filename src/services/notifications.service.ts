import { api } from '../config/reducers/apiSlice';

interface Notification {
  id: number;
  user_id: number;
  title: string;
  description: string;
  link: string;
  read: false;
  created_at: string;
  updated_at: string;
}

interface UpdateNotification {
  all?: boolean;
  id?: number[];
}

export const notificationsApi = api.injectEndpoints({
  endpoints: (build) => ({
    allNotifications: build.query<Notification[], void>({
      query: () => 'notifications/all',
      providesTags: ['Notifications'],
    }),
    notificationsById: build.query<Notification, number>({
      query: (id) => `notifications/show/${id}`,
      providesTags: ['Notifications'],
    }),
    updateNotifications: build.mutation<void, UpdateNotification>({
      query: (body) => ({
        url: 'notifications/update',
        method: 'PUT',
        params: body,
      }),
      invalidatesTags: ['Notifications'],
    }),
    deleteNotifications: build.mutation<void, UpdateNotification>({
      query: (body) => ({
        url: 'notifications/delete',
        method: 'DELETE',
        params: body,
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useAllNotificationsQuery,
  useDeleteNotificationsMutation,
  useUpdateNotificationsMutation,
  useNotificationsByIdQuery,
} = notificationsApi;
