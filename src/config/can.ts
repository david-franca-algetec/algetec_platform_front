import { AbilityBuilder, createMongoAbility, InferSubjects } from '@casl/ability';

import { User } from '../models';
import { store } from './store';

type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';
export type Subjects = InferSubjects<
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

// enum ROLE {
//   ADMIN = 'Administrador',
//   LEADER = 'Líder de Equipe',
//   DEVELOPER = 'Desenvolvedor'
// }

const ability = createMongoAbility<[Actions, Subjects]>();

export const CAN = (action: Actions, subject: Subjects) => ability.can(action, subject);

const defineAbilitiesFor = (user: User) => {
  const { can, cannot, rules } = new AbilityBuilder(() => ability);

  if (user) {
    if (user.role.admin) {
      can('manage', ['Role', 'Institution', 'Department', 'User']);
    } else if (user.role.assets) {
      can('manage', ['Asset', 'AssetTag', 'ContentType']);
    } else if (user.role.demands) {
      can('read', 'Demand');
      can('update', 'Demand');
    } else if (user.role.demands_admin) {
      can(['delete', 'create'], 'Demand');
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
