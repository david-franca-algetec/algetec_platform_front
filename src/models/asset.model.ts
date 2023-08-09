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
