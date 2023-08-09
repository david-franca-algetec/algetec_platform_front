import { api } from '../config/reducers/apiSlice';
import { Calendar, CalendarCreate, CalendarUpdate } from '../models/calendar.model';

export interface ICalendarForUser {
  demand_id: number;
  experiment_id: number;
  type: string;
  user_id: number;
  user_name: string;
  date_start: string;
  date_end: string;
}

export const calendarApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllCalendar: build.query<Calendar[], { userId?: number[]; tags?: number[] } | void>({
      query: (arg) => {
        const route = "calendars/all";
        if (arg) {
          const { tags, userId } = arg;
          if (tags && tags.length > 0 && userId) {
            const tagsConcat = tags.map((tag) => `tags=${tag}`).join('&');
            const userConcat = userId.map((id) => `userId=${id}`).join('&');
            return `${route}?${userConcat}&${tagsConcat}`;
          }
          if (userId) {
            const userConcat = userId.map((id) => `userId=${id}`).join('&');
            return `${route}?${userConcat}`;
          }
          if (tags && tags.length > 0) {
            const tagsConcat = tags.map((tag) => `tags=${tag}`).join('&');
            return `${route}?${tagsConcat}`;
          }
        }
        return route;
      },
      providesTags: ['Calendar'],
    }),
    getByUserIdCalendar: build.query<Calendar[], number>({
      query: (id) => `calendars/byUser/${id}`,
      providesTags: ['Calendar'],
    }),
    getByTagIdCalendar: build.query<Calendar, number>({
      query: (id) => `calendars/byTags/${id}`,
      providesTags: ['Calendar'],
    }),
    storeCalendar: build.mutation<Calendar, CalendarCreate>({
      query: (body) => ({
        url: 'calendars/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Calendar'],
    }),
    updateCalendar: build.mutation<Calendar, CalendarUpdate>({
      query: (body) => ({
        url: `calendars/update/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Calendar'],
    }),
    destroyCalendar: build.mutation<void, number>({
      query: (id) => ({
        url: `calendars/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Calendar'],
    }),
    getCalendarForUser: build.query<ICalendarForUser[], number[]>({
      query: (ids) => `calendars/forUsers?${ids.map((id) => `userId=${id}`).join('&')}`,
    }),
  }),
});

export const { useGetAllCalendarQuery, useGetCalendarForUserQuery } = calendarApi;
