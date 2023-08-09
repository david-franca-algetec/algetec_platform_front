import { ClearOutlined, DislikeTwoTone, LikeTwoTone } from '@ant-design/icons';
import { grass, purple, tomato } from '@radix-ui/colors';
import { nanoid } from '@reduxjs/toolkit';
import { Button, Card, Col, List, Row, Select, Statistic, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { DateTimeChart, RadialChart } from '../../components';
import { useAppSelector } from '../../config/hooks';

import { handleStringDate } from '../../helpers';
import { sortByDate } from '../../helpers/sortDate';
import { User } from '../../models';
import { Calendar } from '../../models/calendar.model';
import { Demand, IDemand, TeamLog } from '../../models/demands.model';
import { DemandStatus } from '../../models/enum/demandStatus.enum';

type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

interface IChartDashboardProps {
  calendar: Calendar[];
  users: User[];
  demands: IDemand[];
  onSelect1Change: (value: string) => void;
  onSelect2Change: (value: string) => void;
  onSelect3Change: (value: string) => void;
}

export function ChartsDashboard({
  calendar,
  demands,
  users,
  onSelect1Change,
  onSelect2Change,
  onSelect3Change,
}: IChartDashboardProps) {
  const { select1, select2, select3 } = useAppSelector((state) => state.dashboard);
  const { demandsDay } = useAppSelector((state) => state.calendar);

  const [items1, setItems1] = useState<SelectOption[]>([]);
  const [items2, setItems2] = useState<SelectOption[]>([]);

  const [realMedia, setRealMedia] = useState(0);
  const [idealMedia, setIdealMedia] = useState(0);

  const [radial, setRadial] = useState<number[]>([]);

  const selectItems: SelectOption[] = useMemo(
    () => [
      {
        label: 'Entregas',
        value: 'demands',
      },
      {
        label: 'Usuários',
        value: 'users',
        disabled: true,
      },
      {
        label: 'Equipes',
        value: 'teams',
        disabled: true,
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
        value: 'Scripting',
      },
      {
        label: 'Modelos',
        value: 'Modeling',
      },
      {
        label: 'Programação',
        value: 'Coding',
      },
      {
        label: 'Testes',
        value: 'Testing',
      },
      {
        label: 'UALAB',
        value: 'Ualab',
      },
    ],
    [],
  );

  const series = useMemo(() => {
    setRealMedia(0);
    setIdealMedia(0);
    const seriesRaw = [];

    if (select1 === 'demands') {
      seriesRaw.length = 0;
      seriesRaw.push(
        {
          name: 'Ideal',
          data: [],
        },
        ...demands.map((demand) => ({
          name: demand.experiments.name,
          data: [],
        })),
      );
    }
    if (select1 === 'users') {
      seriesRaw.length = 0;
      seriesRaw.push(
        {
          name: 'Ideal',
          data: [100, 80, 60, 40, 20],
        },
        ...users.map((user) => ({
          name: user.name,
          data: [],
        })),
      );
    }
    if (select1 === 'teams') {
      seriesRaw.length = 0;
      seriesRaw.push(
        {
          name: 'Ideal',
          data: [],
        },
        ...teamsItems.slice(1).map((team) => ({
          name: team.label,
          data: [],
        })),
      );
    }
    if (select2 !== 'none' && select1 !== 'demands') {
      const filteredSeries = seriesRaw.filter((serie) => serie.name === select2);
      seriesRaw.length = 0;
      seriesRaw.push(
        {
          name: 'Ideal',
          data: [100, 80, 60, 40, 20],
        },
        ...filteredSeries,
      );
    }
    if (select1 === 'demands' && select2 !== 'all' && select3 === 'all') {
      const filteredIssue = demands.find((demand) => demand.id === Number(select2));
      if (!filteredIssue) return seriesRaw;
      const demand = new Demand(filteredIssue);
      setRadial(demand.radial);
    }
    if (select1 === 'demands' && select2 !== 'all' && select3 !== 'all') {
      const filteredIssue = demands.find((demand) => demand.id === Number(select2));

      if (!filteredIssue) return seriesRaw;
      const demand = new Demand(filteredIssue);
      const dashboard = demand.toDashboard(select3 as TeamLog);

      seriesRaw.length = 0;

      if (dashboard) {
        setRealMedia(dashboard.actualSpeed);
        setIdealMedia(dashboard.idealSpeed);

        seriesRaw.push(
          {
            name: 'Real',
            data: dashboard.real,
          },
          {
            name: 'Ideal',
            data: dashboard.ideal,
          },
        );
      }
    }
    return seriesRaw;
  }, [select1, select2, select3, demands, users, teamsItems]);

  const isDemandLate = (demandValue: IDemand): boolean => {
    const teams: TeamLog[] = ['Coding', 'Modeling', 'Scripting', 'Testing', 'Ualab'];
    let isLate = false;
    if (dayjs(demandValue.finished_at).valueOf() < dayjs().valueOf()) {
      teams.forEach((team) => {
        const demandDashboard = new Demand(demandValue).toDashboard(team);
        if (demandDashboard && demandDashboard.actualSpeed < demandDashboard.idealSpeed) {
          isLate = true;
        }
      });
    }

    return isLate;
  };

  const dataSource = useMemo(
    () =>
      demands
        .filter((item) => item.status !== DemandStatus.READY)
        .filter((item) => {
          if (calendar.find((value) => value.demand_id === item.id)) {
            return item;
          }
          return null;
        })
        .filter((item) => {
          const startOfMonth = dayjs(demandsDay).startOf('month').valueOf();
          const endOfMonth = dayjs(demandsDay).endOf('month').valueOf();
          const itemDay = dayjs(item.finished_at).valueOf();

          if (itemDay >= startOfMonth && itemDay <= endOfMonth) {
            return item;
          }
          return null;
        })
        .filter((item) => item)
        .sort((a, b) => sortByDate(a.finished_at, b.finished_at)),
    [demands, demandsDay, calendar],
  );

  const handleClear = () => {
    onSelect1Change('demands');
    onSelect2Change('all');
    onSelect3Change('all');
  };

  useEffect(() => {
    if (select1 === 'demands') {
      setItems1([
        {
          label: 'Todas as Entregas',
          value: 'all',
        },
        ...demands.map((demand) => ({
          label: `${demand.experiments.id} - ${demand.experiments.name} #${demand.id}`,
          value: demand.id.toString(),
        })),
      ]);
      setItems2(teamsItems);
      if (!select2) {
        onSelect2Change('all');
      }
      if (!select3) {
        onSelect3Change('all');
      }
    }
    if (select1 === 'users') {
      onSelect2Change('none');
      onSelect3Change('all');
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
        ...demands.map((demand) => ({
          label: demand.experiments.name,
          value: demand.experiments.name,
        })),
      ]);
    }
    if (select1 === 'teams') {
      onSelect2Change('none');
      onSelect3Change('all');
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
        ...demands.map((demand) => ({
          label: demand.experiments.name,
          value: demand.experiments.name,
        })),
      ]);
    }
  }, [select1, demands, users, teamsItems]);

  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col lg={7} md={12} sm={12} xs={24}>
          <Select
            className="w-full"
            optionFilterProp="label"
            options={selectItems}
            value={select1}
            onChange={onSelect1Change}
          />
        </Col>
        <Col lg={7} md={12} sm={12} xs={24}>
          <Select
            className="w-full"
            optionFilterProp="label"
            showSearch
            options={items1}
            value={select2}
            onChange={onSelect2Change}
          />
        </Col>
        <Col lg={7} md={12} sm={12} xs={24}>
          {select2 !== 'none' && (
            <Select
              className="w-full"
              optionFilterProp="label"
              showSearch
              options={items2}
              value={select3}
              onChange={onSelect3Change}
            />
          )}
        </Col>
        <Col lg={3} md={12} sm={12} xs={24}>
          <Button block icon={<ClearOutlined />} onClick={handleClear}>
            Limpar
          </Button>
        </Col>
        {/* eslint-disable-next-line no-nested-ternary */}
        {select1 === 'demands' && select2 !== 'all' && select3 === 'all' ? (
          <Col span={24}>
            <Card
              style={{
                width: '100%',
              }}
            >
              <RadialChart series={radial} />
            </Card>
          </Col>
        ) : select1 === 'demands' && select2 === 'all' && select3 === 'all' ? (
          <Col span={24}>
            <List
              loading={!demands}
              grid={{ column: 3, lg: 3, md: 2, sm: 1, xs: 1, gutter: 16 }}
              pagination={{
                showSizeChanger: true,
                pageSizeOptions: [9, 18, 36, 72],
                defaultPageSize: 9,
              }}
              dataSource={dataSource}
              renderItem={(item) => (
                <List.Item key={nanoid()} style={{ padding: 0 }}>
                  <Card hoverable onClick={() => onSelect2Change(item.id.toString())}>
                    <Statistic
                      title={
                        <Typography.Text ellipsis>{`${item.experiment_id} - ${item.experiments.name}`}</Typography.Text>
                      }
                      value={handleStringDate(item.finished_at, 'DD/MM/YY') || ''}
                      precision={2}
                      valueStyle={{
                        color: !isDemandLate(item) ? grass.grass9 : tomato.tomato9,
                      }}
                      prefix={
                        !isDemandLate(item) ? (
                          <LikeTwoTone twoToneColor={grass.grass9} />
                        ) : (
                          <DislikeTwoTone twoToneColor={tomato.tomato9} />
                        )
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
          </Col>
        ) : (
          <>
            <Col span={18}>
              <Card className="h-full">
                <DateTimeChart series={series} />
              </Card>
            </Col>
            <Col span={6}>
              <Row className="h-1/2 pb-4">
                <Card className="h-full w-full" style={{ color: purple.purple9 }}>
                  <Typography.Text strong>Velocidade Ideal</Typography.Text>
                  <Typography.Title level={2}>{idealMedia} %/dia</Typography.Title>
                </Card>
              </Row>
              <Row className="h-1/2">
                <Card className="h-full w-full" style={{ color: purple.purple9 }}>
                  <Typography.Text strong>Velocidade Média</Typography.Text>
                  <Typography.Title level={2}>{realMedia} %/dia</Typography.Title>
                </Card>
              </Row>
            </Col>
          </>
        )}
      </Row>
    </Card>
  );
}
