import { useEffect, useMemo, useState } from 'react';

import { DashboardComponent, Flex, Grid, Inline, Stack, Title } from '../../components';
import { Card } from '../../components/Card';
import { Chart } from '../../components/Chart';
import { Select } from '../../components/Select';
import { User } from '../../models';
import { IDemand } from '../../models/demands.model';
import { useGetDemandsQuery } from '../../services/demands.service';
import { useGetUsersQuery } from '../../services/user.service';
import { Text } from './styles';

type SelectOption = {
  label: string;
  value: string;
};

export function Dashboard() {
  const [select, setSelect] = useState('issues');
  const { data: demandsData } = useGetDemandsQuery();
  const { data: usersData } = useGetUsersQuery();

  const [users, setUsers] = useState<User[]>([]);
  const [issues, setIssues] = useState<IDemand[]>([]);

  const [items1, setItems1] = useState<SelectOption[]>([]);
  const [items2, setItems2] = useState<SelectOption[]>([]);

  const [select1, setSelect1] = useState<string | undefined>(undefined);
  const [select2, setSelect2] = useState<string | undefined>(undefined);

  const selectItems: SelectOption[] = useMemo(
    () => [
      {
        label: 'Entregas',
        value: 'issues',
      },
      {
        label: 'Usuários',
        value: 'users',
      },
      {
        label: 'Equipes',
        value: 'teams',
      },
    ],
    [],
  );

  const teamsItems: SelectOption[] = useMemo(
    () => [
      {
        label: 'Todas as Equipes',
        value: 'all',
      },
      {
        label: 'Roteirização',
        value: 'Roteirização',
      },
      {
        label: 'Modelos',
        value: 'Modelos',
      },
      {
        label: 'Programação',
        value: 'Programação',
      },
      {
        label: 'Testes',
        value: 'Testes',
      },
      {
        label: 'UALAB',
        value: 'UALAB',
      },
    ],
    [],
  );
  const generateNumberArray = (length: number) =>
    Array(length)
      .fill(0)
      .map(() => Math.floor(Math.random() * 100));

  const series = useMemo(() => {
    const seriesRaw = [];

    if (select === 'issues') {
      seriesRaw.length = 0;
      seriesRaw.push(
        {
          name: 'Ideal',
          data: [100, 80, 60, 40, 20],
        },
        ...issues.map((issue) => ({
          name: issue.experiments.name,
          data: generateNumberArray(5),
        })),
      );
    }
    if (select === 'users') {
      seriesRaw.length = 0;
      seriesRaw.push(
        {
          name: 'Ideal',
          data: [100, 80, 60, 40, 20],
        },
        ...users.map((user) => ({
          name: user.name,
          data: generateNumberArray(5),
        })),
      );
    }
    if (select === 'teams') {
      seriesRaw.length = 0;
      seriesRaw.push(
        {
          name: 'Ideal',
          data: [100, 80, 60, 40, 20],
        },
        ...teamsItems.slice(1).map((team) => ({
          name: team.label,
          data: generateNumberArray(5),
        })),
      );
    }
    if (select1 !== 'none' && select !== 'issues') {
      const filteredSeries = seriesRaw.filter((serie) => serie.name === select1);
      seriesRaw.length = 0;
      seriesRaw.push(
        {
          name: 'Ideal',
          data: [100, 80, 60, 40, 20],
        },
        ...filteredSeries,
      );
    }
    return seriesRaw;
  }, [select, select1, issues, users, teamsItems]);

  useEffect(() => {
    if (demandsData) {
      setIssues(demandsData);
    }
  }, [demandsData]);

  useEffect(() => {
    if (usersData) {
      setUsers(usersData);
    }
  }, [usersData]);

  useEffect(() => {
    if (select === 'issues') {
      setItems1([
        {
          label: 'Todas as Entregas',
          value: 'all',
        },
        ...issues.map((issue) => ({
          label: issue.experiments.name,
          value: issue.experiments.name,
        })),
      ]);
      setItems2(teamsItems);
      setSelect1('all');
      setSelect2('all');
    }
    if (select === 'users') {
      setSelect1('none');
      setSelect2('all');
      setItems1([
        {
          label: 'Selecione um Usuário',
          value: 'none',
        },
        ...users.map((user) => ({
          label: user.name,
          value: user.name,
        })),
      ]);
      setItems2([
        {
          label: 'Todas as Entregas',
          value: 'all',
        },
        ...issues.map((issue) => ({
          label: issue.experiments.name,
          value: issue.experiments.name,
        })),
      ]);
    }
    if (select === 'teams') {
      setSelect1('none');
      setSelect2('all');
      const teams = [];
      teams.push(
        {
          label: 'Selecione uma Equipe',
          value: 'none',
        },
        ...teamsItems.slice(1),
      );
      setItems1(teams);
      setItems2([
        {
          label: 'Todas as Entregas',
          value: 'all',
        },
        ...issues.map((issue) => ({
          label: issue.experiments.name,
          value: issue.experiments.name,
        })),
      ]);
    }
  }, [select, issues, users, teamsItems]);

  return (
    <DashboardComponent>
      <Stack
        css={{
          width: '100%',
        }}
      >
        <Flex>
          <Text css={{ marginLeft: 0 }} size="large">
            Velocidade de Produção
          </Text>
        </Flex>
        <Inline css={{ gap: '$md', marginBottom: '$md' }}>
          <Select items={selectItems} value={select} onValueChange={setSelect} />
          <Select items={items1} value={select1} onValueChange={setSelect1} />
          {select1 !== 'none' && <Select items={items2} value={select2} onValueChange={setSelect2} />}
        </Inline>
        <Grid
          css={{
            gridTemplateColumns: '4fr, 1fr',
            gap: '$md',
            width: '100%',
            height: '100%',
            alignItems: 'center',
          }}
        >
          <Card
            css={{
              gridArea: '1 / 1 / 2 / 2',
              width: 'auto',
              height: '100%',
            }}
          >
            <Chart
              text="Pontos"
              series={series}
              categories={['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']}
              dashArray={[5]}
            />
          </Card>

          <Card
            css={{
              gridArea: '1 / 2 / 2 / 3',
              width: 'auto',
              height: '100%',
              alignItems: 'start',
              justifyContent: 'start',
            }}
          >
            <Text css={{ marginLeft: 0 }}>Velocidade Média</Text>
            <Title>{Math.floor(Math.random() * 100)} pt / dia</Title>
          </Card>
        </Grid>
      </Stack>
    </DashboardComponent>
  );
}
