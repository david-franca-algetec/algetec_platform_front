import { AbilityBuilder, createMongoAbility, InferSubjects } from '@casl/ability';

import { Asset } from '../models/asset.model';
import { AssetTag } from '../models/assetTag.model';
import { ContentType } from '../models/contentType.model';
import { Demand } from '../models/demands.model';
import { Department } from '../models/department.model';
import { Experiment } from '../models/experiments.model';
import { Institution } from '../models/institution.model';
import { Role } from '../models/role.model';
import { Tag } from '../models/tag.model';
import { User } from '../models/user.model';
import { store } from './store';

type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';
export type Subjects = InferSubjects<
  | Asset
  | AssetTag
  | ContentType
  | Demand
  | Department
  | Experiment
  | Institution
  | Role
  | Tag
  | User
  | 'Asset'
  | 'AssetTag'
  | 'ContentType'
  | 'Demand'
  | 'Department'
  | 'Experiment'
  | 'Institution'
  | 'Role'
  | 'Tag'
  | 'User'
  | 'all'
>;

const ability = createMongoAbility<[Actions, Subjects]>();

export const CAN = (action: Actions, subject: Subjects) => ability.can(action, subject);

const defineAbilitiesFor = (user: Omit<User, 'department'> | null) => {
  const { can, cannot, rules } = new AbilityBuilder(() => ability);

  if (user) {
    can('read', 'all');

    if (user.role.admin) {
      can('manage', ['Role', 'Institution', 'Department', 'User']);
    }
    if (user.role.assets) {
      can('manage', ['Asset', 'AssetTag', 'ContentType']);
    }
    if (user.role.demands) {
      can('read', 'Demand');
      can('update', 'Demand');
    }
    if (user.role.demands_admin) {
      can(['delete', 'create'], 'Demand');
    } else {
      cannot('manage', 'User');
      cannot('manage', 'Institution');
      cannot('manage', 'Demand');
    }
  } else {
    cannot('read', 'all');
  }

  return rules;
};

store.subscribe(() => {
  const { auth } = store.getState();
  if (auth.user) {
    ability.update(defineAbilitiesFor(auth.user));
  }
});
