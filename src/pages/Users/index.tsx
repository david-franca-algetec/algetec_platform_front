import { CheckedState } from '@radix-ui/react-checkbox';
import { useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';

import { DashboardComponent, Stack } from '../../components';
import { DropdownMenuProps } from '../../components/DropdownMenu';
import { Captions, TableComponent, TableComponentProps } from '../../components/Table';
import { useAppDispatch, useAppSelector } from '../../config/hooks';
import {
  addManyToUsersCart,
  addToUsersCart,
  clearUsersCart,
  removeFromUsersCart,
} from '../../config/reducers/cartSlice';
import { handleStringDate } from '../../helpers';
import { useGetUsersQuery } from '../../services/user.service';
import CreateUserPage from './Create';
import { EditUser } from './Edit';

type ContentValue = {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  role: string;
  department: string;
};

export function UsersPage() {
  const { users: usersCart } = useAppSelector((state) => state.cart);
  const { data: usersData, isLoading } = useGetUsersQuery();
  const [closeDialog, setCloseDialog] = useState(false);

  const dispatch = useAppDispatch();

  const captions = useMemo<Captions[]>(
    () => [
      { caption: 'ID', tooltip: 'Identificador', accessor: 'id', sortable: true },
      { caption: 'Nome', accessor: 'name', sortable: true },
      { caption: 'Email', accessor: 'email', sortable: true },
      { caption: 'Criação', accessor: 'created_at', sortable: true },
      { caption: 'Atualização', accessor: 'updated_at', sortable: true },
      { caption: 'Nível de Acesso', accessor: 'role', sortable: true },
      { caption: 'Equipe', accessor: 'department', sortable: true },
    ],
    [],
  );

  const content = useMemo<TableComponentProps<ContentValue>['content']>(
    () =>
      usersData
        ? usersData.map((user) => ({
            id: user.id,
            value: {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
              created_at: handleStringDate(user.created_at),
              updated_at: handleStringDate(user.updated_at),
              role: user.role.name,
              department: user.department.name,
            },
            checked: !!usersCart.find((cartUser) => cartUser.id === user.id),
            onCheckedChange: (checked: CheckedState) =>
              checked === true ? dispatch(addToUsersCart(user)) : dispatch(removeFromUsersCart(user)),
          }))
        : [],
    [usersData, usersCart],
  );

  const exportHeaders = useMemo(
    () => [
      { label: 'ID', key: 'id' },
      { label: 'Nome', key: 'name' },
      { label: 'Email', key: 'email' },
      { label: 'Criado em', key: 'created_at' },
      { label: 'Atualizado em', key: 'updated_at' },
      { label: 'Nível de Acesso', key: 'role.name' },
      { label: 'Equipe', key: 'department.name' },
    ],
    [],
  );

  const exportData = useMemo(() => {
    const data = usersData
      ? usersData.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: handleStringDate(user.created_at),
          updated_at: handleStringDate(user.updated_at),
          'role.name': user.role.name,
          'department.name': user.department.name,
        }))
      : [];

    return data;
  }, [usersData]);

  const menu = useMemo<DropdownMenuProps[]>(
    () => [
      {
        label: 'Seleção',
        content: [
          {
            label: 'Selecionar tudo',
            value: 'all',
            onClick: () => dispatch(addManyToUsersCart(usersData || [])),
          },
          {
            label: 'Limpar seleção',
            value: 'none',
            onClick: () => dispatch(clearUsersCart()),
          },
          {
            label: (
              <CSVLink headers={exportHeaders} data={exportData}>
                <span>Exportar Usuários</span>
              </CSVLink>
            ),
            value: 'export',
          },
        ],
      },
    ],
    [usersData, exportData, exportHeaders],
  );

  return (
    <DashboardComponent isLoading={isLoading}>
      <Stack
        css={{
          gap: '$sm',
          width: '100%',
        }}
      >
        <TableComponent
          title="Usuários"
          captions={captions}
          content={content}
          menu={menu}
          closeDialog={closeDialog}
          create={{
            element: <CreateUserPage onClose={setCloseDialog} />,
            subject: 'User',
          }}
          editElement={<EditUser onClose={setCloseDialog} id={1} />}
          editTitle="Editar Usuário"
        />
      </Stack>
    </DashboardComponent>
  );
}
