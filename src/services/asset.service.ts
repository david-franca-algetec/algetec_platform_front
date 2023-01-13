/* eslint-disable no-param-reassign */
import { api } from '../config/reducers/apiSlice';
import { handleStringDate } from '../helpers';
import { Asset, AssetCreate, AssetUpdate } from '../models/asset.model';

export const assertApi = api.injectEndpoints({
  endpoints: (build) => ({
    allAssets: build.query<Asset[], void>({
      query: () => 'assets/all',
      transformResponse: (response: Asset[]) => {
        response.forEach((asset) => {
          asset.created_at = handleStringDate(asset.created_at) || new Date().toISOString();
          asset.updated_at = handleStringDate(asset.updated_at) || new Date().toISOString();
        });
        return response;
      },
      providesTags: ['Asset'],
    }),
    createAsset: build.mutation<Asset, AssetCreate>({
      query: (body) => ({
        url: 'assets/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Asset'],
    }),
    updateAsset: build.mutation<Asset, AssetUpdate>({
      query: (body) => ({
        url: `assets/update/${body.id}}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Asset'],
    }),
    deleteAsset: build.mutation<void, number>({
      query: (id) => ({
        url: `assets/delete/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useAllAssetsQuery, useCreateAssetMutation, useUpdateAssetMutation, useDeleteAssetMutation } = assertApi;
