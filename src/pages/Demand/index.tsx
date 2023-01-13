import { CheckedState } from '@radix-ui/react-checkbox';
import { useMemo } from 'react';
import { CSVLink } from 'react-csv';

import { DashboardComponent, Stack } from '../../components';
import { StyledLink } from '../../components/Dashboard/styles';
import { DropdownMenuProps } from '../../components/DropdownMenu';
import { Captions, Content, TableComponent } from '../../components/Table';
import { useAppDispatch, useAppSelector } from '../../config/hooks';
import {
  addManyToDemandsCart,
  addToDemandsCart,
  clearDemandsCart,
  removeFromDemandsCart,
} from '../../config/reducers/cartSlice';
import { handleStringDate } from '../../helpers';
import { DemandStatus } from '../../models/enum/demandStatus.enum';
import { useGetDemandsQuery } from '../../services/demands.service';
import CreateDemandPage from './Create';
import { EditDemandPage } from './Edit';

interface ContentValues {
  id: string;
  experiment: JSX.Element;
  client: string;
  status: DemandStatus;
  scripting: number;
  modeling: number;
  coding: number;
  testing: number;
  ualab: number;
  created_at: string | null;
  updated_at: string | null;
}

export function DemandPage() {
  const { demands: demandCart } = useAppSelector((state) => state.cart);
  const { data: demandsData, isLoading } = useGetDemandsQuery();

  const dispatch = useAppDispatch();

  const captions = useMemo<Captions[]>(
    () => [
      { caption: 'ID', tooltip: 'Identificador', accessor: 'id', sortable: true },
      { caption: 'Experimento', accessor: 'experiment', sortable: false },
      { caption: 'Cliente', accessor: 'client', sortable: true },
      { caption: 'Status', accessor: 'status', sortable: true },
      { caption: 'R', tooltip: 'Roteirização', accessor: 'scripting', sortable: true },
      { caption: 'M', tooltip: 'Modelagem', accessor: 'modeling', sortable: true },
      { caption: 'P', tooltip: 'Programação', accessor: 'coding', sortable: true },
      { caption: 'T', tooltip: 'Testes', accessor: 'testing', sortable: true },
      { caption: 'U', tooltip: 'UALAB', accessor: 'ualab', sortable: true },
      { caption: 'Criação', accessor: 'created_at', sortable: true },
      { caption: 'Atualização', accessor: 'updated_at', sortable: true },
    ],
    [],
  );

  const content = useMemo<Content<ContentValues>[]>(
    () =>
      demandsData
        ? demandsData.map((demand) => ({
            id: demand.id,
            value: {
              id: demand.id.toString(),
              experiment: <StyledLink to={`/dashboard/production/${demand.id}`}>{demand.experiments.name}</StyledLink>,
              client: demand.institutions.name,
              status: demand.status,
              scripting: demand.scripting,
              modeling: demand.modeling,
              coding: demand.coding,
              testing: demand.testing,
              ualab: demand.ualab,
              created_at: handleStringDate(demand.created_at),
              updated_at: handleStringDate(demand.updated_at),
            },
            checked: !!demandCart.find((cartDemand) => cartDemand.id === demand.id),
            onCheckedChange: (checked: CheckedState) =>
              checked === true ? dispatch(addToDemandsCart(demand)) : dispatch(removeFromDemandsCart(demand)),
          }))
        : [],
    [demandsData, demandCart],
  );

  const exportData = useMemo(() => {
    const data = demandCart.map((demand) => ({
      id: demand.id,
      institution_id: demand.institution_id,
      experiment_id: demand.experiment_id,
      status: demand.status,
      created_at: demand.created_at,
      updated_at: demand.updated_at,
    }));

    return data;
  }, [demandCart]);

  const exportHeaders = useMemo(() => {
    const headers = [
      { label: 'ID', key: 'id' },
      { label: 'ID da Instituição', key: 'institution_id' },
      { label: 'ID do Experimento', key: 'experiment_id' },
      { label: 'Status', key: 'status' },
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
            onClick: () => dispatch(addManyToDemandsCart(demandsData || [])),
          },
          {
            label: 'Limpar seleção',
            value: 'none',
            onClick: () => dispatch(clearDemandsCart()),
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
    [demandsData, exportData, exportHeaders],
  );

  return (
    <DashboardComponent isLoading={isLoading}>
      <Stack
        css={{
          width: '100%',
        }}
      >
        <TableComponent
          title="Entregas"
          captions={captions}
          content={content}
          menu={menu}
          closeDialog={false}
          create={{
            element: <CreateDemandPage />,
            link: true,
            subject: 'Demand',
          }}
          editElement={<EditDemandPage />}
          editTitle="Editar Entrega"
          updateLink
        />
      </Stack>
    </DashboardComponent>
  );
}
