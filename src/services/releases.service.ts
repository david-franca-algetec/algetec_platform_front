import { api } from '../config/reducers/apiSlice';

export interface ReleaseType {
  name: string;
  id: number;
  color: string;
}

export interface Release {
  id: number;
  experiment_id: number;
  version: string;
  user_id: number;
  created_at: string;
  experiment: {
    id: number;
    name: string;
  };
  author: {
    email: string;
    name: string;
    id: number;
  };
  releaseType: ReleaseType[];
  updated_at: string;
  id_0: boolean;
  id_5000: boolean;
  id_6000: boolean;
  play_store: boolean;
  languages: boolean;
  description: string;
  platform_a: boolean;
}

export type ReleaseResponse = Omit<Release, 'releaseType'> & {
  releaseType: ReleaseType;
};

export type ReleaseCreate = Pick<Release, 'user_id' | 'version' | 'experiment_id' | 'description'> & {
  releaseTypes: number[];
};

export type ReleaseUpdate = Partial<
  Pick<Release, 'id_0' | 'id_5000' | 'id_6000' | 'play_store' | 'languages' | 'description' | 'platform_a'> & {
    releaseTypes: number[];
  }
> & {
  id: number;
};

export const releaseApi = api.injectEndpoints({
  endpoints: (build) => ({
    getReleases: build.query<ReleaseResponse[], void>({
      query: () => '/releases/all',
      providesTags: ['Releases'],
      transformResponse: (response: Release[]) => {
        const res: ReleaseResponse[] = [];
        response.forEach((release) => {
          if (release.releaseType.length === 1) {
            res.push({ ...release, releaseType: release.releaseType[0] });
          }
          if (release.releaseType.length > 1) {
            release.releaseType.forEach((releaseType) => res.push({ ...release, releaseType }));
          }
        });
        return res;
      },
    }),
    getReleasesById: build.query<[Release], number>({
      query: (id) => `/releases/show/${id}`,
      providesTags: ['Releases'],
    }),
    createRelease: build.mutation<Release, ReleaseCreate>({
      query: (release) => ({
        url: '/releases/create',
        method: 'POST',
        body: release,
      }),
      invalidatesTags: ['Releases'],
    }),
    updateRelease: build.mutation<Release, ReleaseUpdate>({
      query: (release) => ({
        url: `/releases/update/${release.id}`,
        method: 'PUT',
        body: release,
      }),
      invalidatesTags: ['Releases'],
    }),
    deleteRelease: build.mutation<void, number>({
      query: (id) => ({
        url: `/releases/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Releases'],
    }),
  }),
});

export const {
  useCreateReleaseMutation,
  useGetReleasesQuery,
  useGetReleasesByIdQuery,
  useDeleteReleaseMutation,
  useUpdateReleaseMutation,
} = releaseApi;
