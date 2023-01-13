import { CheckedState } from '@radix-ui/react-checkbox';
import { useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';

import { DashboardComponent, Stack } from '../../components';
import { DropdownMenuProps } from '../../components/DropdownMenu';
import { Captions, TableComponent, TableComponentProps } from '../../components/Table';
import { useAppDispatch, useAppSelector } from '../../config/hooks';
import {
  addManyToInstitutionsCart,
  addToInstitutionsCart,
  clearInstitutionsCart,
  removeFromInstitutionsCart,
} from '../../config/reducers/institutionSlice';
import { handleStringDate } from '../../helpers';
import { useGetInstitutionsQuery } from '../../services/institution.service';
import { CreateInstitution } from './Create';
import { EditClient } from './Edit';

interface ContentValue {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export function ClientsPage() {
  const { institutions: institutionsCart } = useAppSelector((state) => state.institution);
  const { data: institutionsData, isLoading } = useGetInstitutionsQuery();
  const [closeDialog, setCloseDialog] = useState(false);
  const dispatch = useAppDispatch();

  const captions = useMemo<Captions[]>(
    () => [
      { caption: 'ID', tooltip: 'Identificação', accessor: 'id', sortable: true },
      { caption: 'Nome', accessor: 'name', sortable: true },
      { caption: 'Criação', accessor: 'created_at', sortable: true },
      { caption: 'Atualização', accessor: 'updated_at', sortable: true },
    ],
    [],
  );

  const content = useMemo<TableComponentProps<ContentValue>['content']>(
    () =>
      institutionsData
        ? institutionsData.map((institution) => ({
            id: institution.id,
            value: {
              id: institution.id.toString(),
              name: institution.name,
              created_at: handleStringDate(institution.created_at),
              updated_at: handleStringDate(institution.updated_at),
            },
            checked: !!institutionsCart.find((cartInstitution) => cartInstitution.id === institution.id),
            onCheckedChange: (checked: CheckedState) =>
              checked === true
                ? dispatch(addToInstitutionsCart(institution))
                : dispatch(removeFromInstitutionsCart(institution)),
          }))
        : [],
    [institutionsData, institutionsCart],
  );

  const exportData = useMemo(() => {
    const data = institutionsCart.map((institution) => ({
      id: institution.id,
      name: institution.name,
      created_at: handleStringDate(institution.created_at),
      updated_at: handleStringDate(institution.updated_at),
    }));
    return data;
  }, [institutionsCart]);

  const exportHeaders = useMemo(() => {
    const headers = [
      { label: 'ID', key: 'id' },
      { label: 'Nome', key: 'name' },
      { label: 'Criado em', key: 'created_at' },
      { label: 'Atualizado em', key: 'updated_at' },
    ];
    return headers;
  }, []);

  const menu = useMemo<DropdownMenuProps[]>(
    () => [
      {
        label: 'Seleção',
        content: [
          {
            label: 'Selecionar tudo',
            value: 'all',
            onClick: () => dispatch(addManyToInstitutionsCart(institutionsData || [])),
          },
          {
            label: 'Limpar seleção',
            value: 'none',
            onClick: () => dispatch(clearInstitutionsCart()),
          },
          {
            label: (
              <CSVLink headers={exportHeaders} data={exportData}>
                <span>Exportar Laboratórios</span>
              </CSVLink>
            ),
            value: 'export',
          },
        ],
      },
    ],
    [institutionsData, exportData, exportHeaders],
  );

  return (
    <DashboardComponent isLoading={isLoading}>
      <Stack
        css={{
          width: '100%',
        }}
      >
        <TableComponent
          title="Instituições"
          captions={captions}
          content={content}
          menu={menu}
          closeDialog={closeDialog}
          create={{
            element: <CreateInstitution onClose={setCloseDialog} />,
            subject: 'Institution',
          }}
          editElement={<EditClient id={1} onClose={setCloseDialog} />}
          editTitle="Editar Instituição"
        />
      </Stack>
    </DashboardComponent>
  );
}
