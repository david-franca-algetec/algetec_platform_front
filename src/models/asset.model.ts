import { AssetTag } from './assetTag.model';
import { ContentType } from './contentType.model';
import { Experiment } from './experiments.model';
import { User } from './user.model';

export type Asset = {
  id: number;
  created_by_id: number;
  modified_by_id: null;
  content_type_id: number;
  name: string;
  description: string;
  image: string;
  file: string;
  variant: number;
  version: string;
  note: null;
  isClean: true;
  isRegistry: false;
  created_at: string;
  updated_at: string;
  modifier: null | User;
  experiments: Array<Experiment>;
  assetTags: Array<AssetTag>;
  contentType: ContentType;
  developers: Array<User>;
  creator: User;
};

export type AssetCreate = Pick<
  Asset,
  | 'name'
  | 'description'
  | 'version'
  | 'image'
  | 'file'
  | 'variant'
  | 'content_type_id'
  | 'created_by_id'
  | 'developers'
  | 'assetTags'
  | 'experiments'
  | 'isClean'
  | 'isRegistry'
>;

export type AssetUpdate = Omit<AssetCreate, 'created_by_id'> & {
  id: number;
  modified_by_id: number;
};
