export type AssetTag = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export type AssetTagCreate = Pick<AssetTag, 'name'>;

export type AssetTagUpdate = AssetTagCreate & Pick<AssetTag, 'id'>;
