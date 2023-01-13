// eslint-disable-next-line import/no-cycle
import { Asset } from './asset.model';

export type ContentType = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  assets: Omit<Asset, 'modifier' | 'experiments' | 'assetTags' | 'contentType' | 'developers' | 'creator'>[];
};

export type ContentTypeCreate = Pick<ContentType, 'name'>;

export type ContentTypeUpdate = Pick<ContentType, 'id' | 'name'>;
