import { api } from '../config/reducers/apiSlice';
import { AssetTag, AssetTagCreate, AssetTagUpdate } from '../models/assetTag.model';

export const assertTagApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAssetTags: build.query<AssetTag[], void>({
      query: () => 'assetTags/all',
      providesTags: ['AssetTag'],
    }),
    storeAssetTag: build.mutation<AssetTag, AssetTagCreate>({
      query: (body) => ({
        url: 'assetTags/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AssetTag'],
    }),
    updateAssetTag: build.mutation<AssetTag, AssetTagUpdate>({
      query: (body) => ({
        url: `assetTags/update/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['AssetTag'],
    }),
    destroyAssetTag: build.mutation<void, number>({
      query: (id) => ({
        url: `assetTags/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AssetTag'],
    }),
  }),
});

export const { useGetAssetTagsQuery, useStoreAssetTagMutation, useUpdateAssetTagMutation, useDestroyAssetTagMutation } =
  assertTagApi;
