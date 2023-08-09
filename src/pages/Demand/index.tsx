/* eslint-disable react/jsx-props-no-spreading */
import {
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  ExportOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { blue, green, lime, orange, sky } from '@radix-ui/colors';
import { nanoid } from '@reduxjs/toolkit';
import {
  Button,
  Card,
  Col,
  InputNumber,
  message,
  Modal,
  Popover,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

import type { FilterValue, Key, SorterResult, SortOrder, TableRowSelection } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import { orderBy, uniqBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { createSearchParams, Link, useSearchParams } from 'react-router-dom';
import { DateField, SearchColumn, TagField, TextField } from '../../components';
import { UrlField } from '../../components/fields/url';
import { useAppDispatch, useAppSelector } from '../../config/hooks';
import { setDemandFilters } from '../../config/reducers/demandSlice';
import { businessDaysAdd, businessDaysSubtract, getUniqueColor, handleError } from '../../helpers';
import { businessDiffHours } from '../../helpers/isBusinessDay';
import { sortByDate } from '../../helpers/sortDate';
import { IDemand } from '../../models/demands.model';
import { DemandStatus } from '../../models/enum/demandStatus.enum';
import {
  MassUpdate,
  useDestroyDemandMutation,
  useGetDemandsQuery,
  useGetDemandsTagsQuery,
  useMassUpdateDemandsMutation,
} from '../../services/demands.service';
import { useGetInstitutionsQuery } from '../../services/institution.service';
import { useGetUsersQuery } from '../../services/user.service';

const { confirm } = Modal;

interface DataType {
  key: Key;
  id: number;
  experiment_id: number;
  experiment: string;
  client: string;
  status: DemandStatus;
  scripting: string;
  modeling: string;
  coding: string;
  testing: string;
  ualab: string;
  designing: string;
  created_at: string;
  updated_at: string;
  finished_at: string;
  tags: string[];
  creator: string;
}

interface RecalculateProps {
  ids: Key[];
}

function Recalculate({ ids }: RecalculateProps) {
  const [toast, contextHolder] = message.useMessage();
  // States
  const [time, setTime] = useState<number | null>(1);
  const [control, setControl] = useState<'add' | 'minus'>('add');
  // Fetch API
  const [update, { isLoading, isSuccess, isError, error }] = useMassUpdateDemandsMutation();
  const { data: demandsData, isLoading: demandsIsLoading } = useGetDemandsQuery();

  const massUpdate: MassUpdate[] = [];

  const handleFinish = () => {
    if (massUpdate.length) {
      update({ data: massUpdate });
    }
  };

  useEffect(() => {
    ids.forEach((key) => {
      if (demandsData && !demandsIsLoading && time && control) {
        const data = demandsData.find((el) => el.id === Number(key));
        if (data) {
          const values = {
            coding_startedAt:
              control === 'add'
                ? businessDaysAdd(dayjs(data.latest_coding_log.started_at), time).toISOString()
                : businessDaysSubtract(dayjs(data.latest_coding_log.started_at), time).toISOString(),
            testing_startedAt:
              control === 'add'
                ? businessDaysAdd(dayjs(data.latest_testing_log.started_at), time).toISOString()
                : businessDaysSubtract(dayjs(data.latest_testing_log.started_at), time).toISOString(),
            ualab_startedAt:
              control === 'add'
                ? businessDaysAdd(dayjs(data.latest_ualab_log.started_at), time).toISOString()
                : businessDaysSubtract(dayjs(data.latest_ualab_log.started_at), time).toISOString(),
            modeling_startedAt:
              control === 'add'
                ? businessDaysAdd(dayjs(data.latest_modeling_log.started_at), time).toISOString()
                : businessDaysSubtract(dayjs(data.latest_modeling_log.started_at), time).toISOString(),
            scripting_startedAt:
              control === 'add'
                ? businessDaysAdd(dayjs(data.latest_scripting_log.started_at), time).toISOString()
                : businessDaysSubtract(dayjs(data.latest_scripting_log.started_at), time).toISOString(),
            designing_startedAt:
              control === 'add'
                ? businessDaysAdd(dayjs(data.latest_designing_log.started_at), time).toISOString()
                : businessDaysSubtract(dayjs(data.latest_designing_log.started_at), time).toISOString(),
            coding_finishedAt:
              control === 'add'
                ? businessDaysAdd(dayjs(data.latest_coding_log.finished_at), time).toISOString()
                : businessDaysSubtract(dayjs(data.latest_coding_log.finished_at), time).toISOString(),
            testing_finishedAt:
              control === 'add'
                ? businessDaysAdd(dayjs(data.latest_testing_log.finished_at), time).toISOString()
                : businessDaysSubtract(dayjs(data.latest_testing_log.finished_at), time).toISOString(),
            ualab_finishedAt:
              control === 'add'
                ? businessDaysAdd(dayjs(data.latest_ualab_log.finished_at), time).toISOString()
                : businessDaysSubtract(dayjs(data.latest_ualab_log.finished_at), time).toISOString(),
            modeling_finishedAt:
              control === 'add'
                ? businessDaysAdd(dayjs(data.latest_modeling_log.finished_at), time).toISOString()
                : businessDaysSubtract(dayjs(data.latest_modeling_log.finished_at), time).toISOString(),
            scripting_finishedAt:
              control === 'add'
                ? businessDaysAdd(dayjs(data.latest_scripting_log.finished_at), time).toISOString()
                : businessDaysSubtract(dayjs(data.latest_scripting_log.finished_at), time).toISOString(),
            designing_finishedAt:
              control === 'add'
                ? businessDaysAdd(dayjs(data.latest_designing_log.finished_at), time).toISOString()
                : businessDaysSubtract(dayjs(data.latest_designing_log.finished_at), time).toISOString(),
          };
          massUpdate.push({
            ...values,
            id: data.id,
            designing_deadline: businessDiffHours(values.designing_finishedAt, values.designing_startedAt),
            coding_deadline: businessDiffHours(values.coding_finishedAt, values.coding_startedAt),
            testing_deadline: businessDiffHours(values.testing_finishedAt, values.testing_startedAt),
            ualab_deadline: businessDiffHours(values.ualab_finishedAt, values.ualab_startedAt),
            scripting_deadline: businessDiffHours(values.scripting_finishedAt, values.scripting_startedAt),
            modeling_deadline: businessDiffHours(values.modeling_finishedAt, values.modeling_startedAt),
          });
        }
      }
    });
  }, [ids, demandsData, demandsIsLoading, time, control]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('As datas das entregas foram alteradas com sucesso.').then();
    }
    if (isError && error && 'data' in error) {
      toast.error(handleError(error)).then();
    }
  }, [isSuccess, isError, error]);

  return (
    <Popover
      trigger="click"
      content={
        <Space>
          <Select
            className="w-32"
            options={[
              { label: 'Adiar', value: 'add' },
              { label: 'Antecipar', value: 'minus' },
            ]}
            value={control}
            onChange={setControl}
          />
          <InputNumber min={1} className="w-40" value={time} onChange={setTime} addonAfter="Dias Úteis" />
          <Button icon={<CalendarOutlined />} type="primary" onClick={handleFinish} loading={isLoading}>
            Aplicar
          </Button>
        </Space>
      }
    >
      {contextHolder}
      <Button block>Reagendar</Button>
    </Popover>
  );
}

export function DemandPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAppSelector((state) => state.auth);
  const {
    experiment,
    id,
    institutions: institutionsParams,
    status: statusParams,
    tags: tagsParams,
    sorterKey,
    order,
    author,
    scripting,
    testing,
    ualab,
    modeling,
    coding,
    designing,
  } = useAppSelector((state) => state.demand);
  const dispatch = useAppDispatch();
  const [toast, contextHolder] = message.useMessage();

  // call API
  const { data: usersData } = useGetUsersQuery();
  const { data: demandsData, isLoading } = useGetDemandsQuery();
  const [deleteDemand, { isLoading: isDeletingDemand }] = useDestroyDemandMutation();
  const { data: tagsData } = useGetDemandsTagsQuery();
  const { data: institutionsData } = useGetInstitutionsQuery();

  // States
  const demands = useMemo<IDemand[]>(() => demandsData || [], [demandsData]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const users = useMemo(
    () =>
      usersData ? orderBy(uniqBy(usersData, 'name'), 'name').map((el) => ({ text: el.name, value: el.name })) : [],
    [usersData],
  );

  const tags = useMemo(() => {
    const filter: { text: string; value: string }[] = [];
    if (tagsData) {
      orderBy(tagsData, 'name').forEach((tag) => {
        filter.push({ text: tag.name, value: tag.name });
      });
    }
    return [...new Set(filter)];
  }, [demands]);

  const institutions = useMemo(
    () =>
      orderBy(institutionsData, 'name')?.map((institution) => ({ text: institution.name, value: institution.name })) ||
      [],
    [institutionsData],
  );

  const handleStatusName = (status: DemandStatus) => {
    let color = '';
    switch (status) {
      case DemandStatus.READY:
        color = green.green10;
        break;
      case DemandStatus.DEVELOPMENT:
        color = blue.blue10;
        break;
      case DemandStatus.CORRECTION:
        color = orange.orange10;
        break;
      case DemandStatus.REVALIDATION:
        color = sky.sky10;
        break;
      case DemandStatus.VALIDATION:
        color = lime.lime10;
        break;
      default:
        break;
    }
    return color;
  };

  const showDeleteConfirm = (id: number) => {
    const demandName = demands.find((i) => i.id === id)?.experiments.name;
    confirm({
      title: `Deletar a Entrega ${demandName}?`,
      icon: <ExclamationCircleFilled />,
      content: 'Essa ação não pode ser desfeita!',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deleteDemand(id)
          .unwrap()
          .then(() => toast.success(`A Entrega ${demandName} foi deletada com sucesso.`))
          .catch((error) => (error && 'data' in error ? toast.error(handleError(error)) : null));
      },
      okButtonProps: {
        loading: isDeletingDemand,
      },
      maskStyle: {
        backdropFilter: 'blur(8px)',
      },
    });
  };

  const onFilters = (name: string, value?: string | string[] | null) => {
    dispatch(setDemandFilters({ name, value }));
  };

  const handleTableChange = (
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<DataType> | SorterResult<DataType>[],
  ) => {
    if (selectedRowKeys.length) {
      setSelectedRowKeys([]);
    }

    onFilters('id', filters.experiment_id?.shift() as string);
    onFilters('experiment', filters.experiment?.shift() as string);
    onFilters('institutions', filters.client as string[]);
    onFilters('tags', filters.tags as string[]);
    onFilters('status', filters.status as string[]);
    onFilters('author', filters.creator?.shift() as string);
    onFilters('coding', filters.coding?.shift() as string);
    onFilters('modeling', filters.modeling?.shift() as string);
    onFilters('testing', filters.testing?.shift() as string);
    onFilters('designing', filters.designing?.shift() as string);
    onFilters('ualab', filters.ualab?.shift() as string);
    onFilters('scripting', filters.scripting?.shift() as string);

    if (!Array.isArray(sorter)) {
      const sorterColumnKey = sorter.column?.key?.toString();
      const sorterOrder = sorter.order;

      onFilters('sorterKey', sorterColumnKey);
      onFilters('order', sorterOrder);
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      ...SearchColumn({
        index: 'experiment_id',
        title: 'ID do Experimento',
      }),
      title: 'ID Exp',
      dataIndex: 'experiment_id',
      key: 'experiment_id',
      width: 100,
      sorter: {
        compare: (a, b) => a.experiment_id - b.experiment_id,
      },
      sortOrder: sorterKey === 'experiment_id' && order ? (order as SortOrder) : null,
      showSorterTooltip: false,
      filteredValue: id ? [id] : null,
      render: (value: number) => <UrlField value={value.toString()} href={`/labs/show/${value}`} target="_blank" />,
    },
    {
      ...SearchColumn({
        index: 'experiment',
        title: 'Experimento',
        includes: true,
      }),
      filteredValue: experiment ? [experiment] : null,
      title: 'Experimento',
      dataIndex: 'experiment',
      key: 'experiment',
      sortOrder: sorterKey === 'experiment' && order ? (order as SortOrder) : null,
      showSorterTooltip: false,
      ellipsis: { showTitle: false },
      width: 150,
      sorter: {
        compare: (a, b) => a.experiment.localeCompare(b.experiment),
      },
      render: (value, record) => (
        <Tooltip title={value} placement="topLeft">
          <Link to={`/demands/show/${record.id}`}>
            <Typography.Link>{value}</Typography.Link>
          </Link>
        </Tooltip>
      ),
    },
    {
      title: 'Instituição',
      dataIndex: 'client',
      key: 'client',
      ellipsis: true,
      width: 150,
      filters: institutions,
      filteredValue: institutionsParams,
      onFilter: (value, record) => record.client.startsWith(`${value}`),
      sortOrder: sorterKey === 'client' && order ? (order as SortOrder) : null,
      showSorterTooltip: false,
      sorter: {
        compare: (a, b) => a.client.localeCompare(b.client),
      },
      filterSearch: true,
      render: (value) => <TextField value={value} />,
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      width: 170,
      filterSearch: true,
      filters: tags,
      filteredValue: tagsParams,
      onFilter: (value, record) => record.tags.includes(`${value}`),
      render: (tags: string[]) => (
        <Space size="middle" wrap style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
          {tags.map((tag) => (
            <TagField value={tag} color={getUniqueColor(tag)} key={nanoid()} />
          ))}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      filterSearch: true,
      filteredValue: statusParams,
      filters: Object.values(DemandStatus).map((value) => ({ text: value, value })),
      onFilter: (value, record) => record.status.startsWith(`${value}`),
      render: (value: DemandStatus, record) => <TagField value={value} color={handleStatusName(record.status)} />,
      sortOrder: sorterKey === 'status' && order ? (order as SortOrder) : null,
      showSorterTooltip: false,
      sorter: {
        compare: (a, b) => a.status.localeCompare(b.status),
      },
    },
    {
      title: 'Autor',
      key: 'creator',
      dataIndex: 'creator',
      width: 130,
      filteredValue: author ? [author] : null,
      filterSearch: true,
      filters: users,
      filterMultiple: false,
      onFilter: (value, record) => record.creator.includes(String(value)),
      ellipsis: { showTitle: false },
      render: (value) => <TextField value={value} />,
      sorter: {
        compare: (a, b) => a.creator.localeCompare(b.creator),
      },
      sortOrder: sorterKey === 'creator' && order ? (order as SortOrder) : null,
      showSorterTooltip: false,
    },
    {
      title: 'Prazo',
      key: 'finished_at',
      dataIndex: 'finished_at',
      width: 110,
      defaultSortOrder: sorterKey === 'finished_at' ? (order as SortOrder) : null,
      render: (value) => <DateField value={value} />,
      sorter: {
        compare: (a, b) => sortByDate(a.finished_at, b.finished_at),
      },
      sortOrder: sorterKey === 'finished_at' && order ? (order as SortOrder) : null,
      showSorterTooltip: false,
    },
    {
      title: 'Roteirização',
      dataIndex: 'scripting',
      key: 'scripting',
      width: 140,
      filteredValue: scripting ? [scripting] : null,
      filterSearch: true,
      filters: users,
      filterMultiple: false,
      onFilter: (value, record) => record.scripting.includes(String(value)),
      sorter: {
        compare: (a, b) => a.scripting.localeCompare(b.scripting),
      },
      sortOrder: sorterKey === 'scripting' && order ? (order as SortOrder) : null,
      showSorterTooltip: false,
      render: (value: string) => <TextField value={value} />,
    },
    {
      title: 'Modelagem',
      dataIndex: 'modeling',
      key: 'modeling',
      width: 140,
      filteredValue: modeling ? [modeling] : null,
      filterSearch: true,
      filters: users,
      filterMultiple: false,
      onFilter: (value, record) => record.modeling.includes(String(value)),
      ellipsis: { showTitle: false },
      sorter: {
        compare: (a, b) => a.modeling.localeCompare(b.modeling),
      },
      sortOrder: sorterKey === 'modeling' && order ? (order as SortOrder) : null,
      showSorterTooltip: false,
      render: (value: string) => <TextField value={value} />,
    },
    {
      title: 'Programação',
      dataIndex: 'coding',
      key: 'coding',
      width: 160,
      filteredValue: coding ? [coding] : null,
      filterSearch: true,
      filters: users,
      filterMultiple: false,
      onFilter: (value, record) => record.coding.includes(String(value)),
      ellipsis: { showTitle: false },
      sorter: {
        compare: (a, b) => a.coding.localeCompare(b.coding),
      },
      sortOrder: sorterKey === 'coding' && order ? (order as SortOrder) : null,
      showSorterTooltip: false,
      render: (value: string) => <TextField value={value} />,
    },
    {
      title: 'Testes',
      dataIndex: 'testing',
      key: 'testing',
      width: 140,
      filteredValue: testing ? [testing] : null,
      filterSearch: true,
      filters: users,
      filterMultiple: false,
      onFilter: (value, record) => record.testing.includes(String(value)),
      ellipsis: { showTitle: false },
      sorter: {
        compare: (a, b) => a.testing.localeCompare(b.testing),
      },
      sortOrder: sorterKey === 'testing' && order ? (order as SortOrder) : null,
      showSorterTooltip: false,
      render: (value: string) => <TextField value={value} />,
    },
    {
      title: 'UALAB',
      dataIndex: 'ualab',
      key: 'ualab',
      width: 140,
      filteredValue: ualab ? [ualab] : null,
      filterSearch: true,
      filters: users,
      filterMultiple: false,
      onFilter: (value, record) => record.ualab.includes(String(value)),
      ellipsis: { showTitle: false },
      sorter: {
        compare: (a, b) => a.ualab.localeCompare(b.ualab),
      },
      sortOrder: sorterKey === 'ualab' && order ? (order as SortOrder) : null,
      showSorterTooltip: false,
      render: (value: string) => <TextField value={value} />,
    },
    {
      title: 'Design',
      dataIndex: 'designing',
      key: 'designing',
      width: 140,
      filteredValue: designing ? [designing] : null,
      filterSearch: true,
      filters: users,
      filterMultiple: false,
      onFilter: (value, record) => record.designing.includes(String(value)),
      ellipsis: { showTitle: false },
      sorter: {
        compare: (a, b) => a.designing.localeCompare(b.designing),
      },
      sortOrder: sorterKey === 'designing' && order ? (order as SortOrder) : null,
      showSorterTooltip: false,
      render: (value: string) => <TextField value={value} />,
    },
    {
      title: 'Ações',
      key: 'actions',
      dataIndex: 'actions',
      width: 130,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title="Detalhes">
            <Link to={`/demands/show/${record.id}`}>
              <Button icon={<EyeOutlined />} />
            </Link>
          </Tooltip>
          <Tooltip title="Editar">
            <Link to={`/demands/edit/${record.id}`}>
              <Button type="primary" icon={<EditOutlined />} />
            </Link>
          </Tooltip>
          {user?.role.super_admin ? (
            <Tooltip title="Excluir">
              <Button
                danger
                type="primary"
                style={{
                  display: user?.role.super_admin ? 'inline' : 'none',
                }}
                icon={<DeleteOutlined />}
                onClick={() => {
                  showDeleteConfirm(record.id);
                }}
              />
            </Tooltip>
          ) : null}
        </Space>
      ),
    },
  ];

  const data: DataType[] = demands.map((demand) => ({
    key: demand.id,
    id: demand.id,
    experiment_id: demand.experiment_id,
    experiment: demand.experiments.name,
    client: demand.institutions.name,
    status: demand.status,
    scripting: demand.latest_scripting_developer[0]?.name || '',
    modeling: demand.latest_modeling_developer[0]?.name || '',
    coding: demand.latest_coding_developer[0]?.name || '',
    testing: demand.latest_testing_developer[0]?.name || '',
    ualab: demand.latest_ualab_developer[0]?.name || '',
    created_at: demand.created_at,
    updated_at: demand.updated_at,
    tags: demand.demandTags?.map((tag) => tag.name) || [],
    finished_at: demand.finished_at,
    designing: demand.latest_designing_developer[0]?.name || '',
    creator: demand.creator?.name || '-',
  }));

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const exportData = useMemo(() => {
    if (selectedRowKeys.length > 0) {
      return selectedRowKeys.map((key) => {
        const demand = demands.find((i) => i.id === key);

        return {
          id: demand?.id,
          experiment_id: demand?.experiment_id,
          experiment: demand?.experiments.name,
          client: demand?.institutions.name,
          status: demand?.status,
          scripting: demand?.scripting,
          modeling: demand?.modeling,
          coding: demand?.coding,
          testing: demand?.testing,
          ualab: demand?.ualab,
          created_at: dayjs(demand?.created_at).format('DD/MM/YYYY'),
          updated_at: dayjs(demand?.updated_at).format('DD/MM/YYYY'),
          tags: demand?.demandTags?.map((tag) => tag.name).join(', '),
          finished_at: dayjs(demand?.finished_at).format('DD/MM/YYYY'),
        };
      });
    }
    return demands.map((demand) => ({
      id: demand.id,
      experiment_id: demand.experiment_id,
      experiment: demand.experiments.name,
      client: demand.institutions.name,
      status: demand.status,
      tags: demand.demandTags?.map((tag) => tag.name).join(', '),
      scripting: demand.scripting,
      modeling: demand.modeling,
      coding: demand.coding,
      testing: demand.testing,
      ualab: demand.ualab,
      created_at: dayjs(demand.created_at).format('DD/MM/YYYY'),
      updated_at: dayjs(demand.updated_at).format('DD/MM/YYYY'),
      finished_at: dayjs(demand.finished_at).format('DD/MM/YYYY'),
    }));
  }, [selectedRowKeys, demands]);

  const exportHeaders = useMemo(
    () => [
      { label: 'ID', key: 'id' },
      { label: 'ID do Experimento', key: 'experiment_id' },
      { label: 'Experimento', key: 'experiment' },
      { label: 'Instituição', key: 'client' },
      { label: 'Tags', key: 'tags' },
      { label: 'Prazo', key: 'finished_at' },
      { label: 'Roteirização', key: 'scripting' },
      { label: 'Modelagem', key: 'modeling' },
      { label: 'Programação', key: 'coding' },
      { label: 'Testes', key: 'testing' },
      { label: 'UALAB', key: 'ualab' },
      { label: 'Criado em', key: 'created_at' },
      { label: 'Atualizado em', key: 'updated_at' },
    ],
    [],
  );

  useEffect(() => {
    const params = createSearchParams();
    if (experiment) {
      params.append('experiment', experiment);
    }
    if (id) {
      params.append('id', id);
    }
    if (sorterKey) {
      params.append('sorterKey', sorterKey);
    }
    if (order) {
      params.append('order', order);
    }
    if (designing) {
      params.append('designing', designing);
    }
    if (testing) {
      params.append('testing', testing);
    }
    if (ualab) {
      params.append('ualab', ualab);
    }
    if (modeling) {
      params.append('modeling', modeling);
    }
    if (scripting) {
      params.append('scripting', scripting);
    }
    if (coding) {
      params.append('coding', coding);
    }

    if (institutionsParams && institutionsParams.length > 0) {
      institutionsParams.forEach((param) => {
        params.append('institutions', param);
      });
    }
    if (statusParams && statusParams.length > 0) {
      statusParams.forEach((param) => {
        params.append('status', param);
      });
    }
    if (tagsParams && tagsParams.length > 0) {
      tagsParams.forEach((param) => {
        params.append('tags', param);
      });
    }
    if (author) {
      params.append('author', author);
    }

    setSearchParams(params);
  }, [
    experiment,
    id,
    institutionsParams,
    statusParams,
    tagsParams,
    sorterKey,
    order,
    author,
    scripting,
    testing,
    ualab,
    modeling,
    coding,
    designing,
  ]);

  useEffect(() => {
    const sorterKeyParam = searchParams.get('sorterKey');
    const orderParam = searchParams.get('order');
    const idParam = searchParams.get('id');
    const statusParam = searchParams.getAll('status');
    const experimentParam = searchParams.get('experiment');
    const authorParam = searchParams.get('author');
    const codingParam = searchParams.get('coding');
    const designingParam = searchParams.get('designing');
    const modelingParam = searchParams.get('modeling');
    const scriptingParam = searchParams.get('scripting');
    const testingParam = searchParams.get('testing');
    const ualabParam = searchParams.get('ualab');

    if (statusParam.length > 0) {
      onFilters('status', statusParam);
    }
    if (idParam) {
      onFilters('id', idParam);
    }
    if (sorterKeyParam) {
      onFilters('sorterKey', sorterKeyParam);
    }
    if (orderParam) {
      onFilters('order', orderParam);
    }
    if (experimentParam) {
      onFilters('experiment', experimentParam);
    }
    if (authorParam) {
      onFilters('author', authorParam);
    }
    if (codingParam) {
      onFilters('coding', codingParam);
    }
    if (designingParam) {
      onFilters('designing', designingParam);
    }
    if (modelingParam) {
      onFilters('modeling', modelingParam);
    }
    if (scriptingParam) {
      onFilters('scripting', scriptingParam);
    }
    if (testingParam) {
      onFilters('testing', testingParam);
    }
    if (ualabParam) {
      onFilters('ualab', ualabParam);
    }
  }, []);

  return (
    <Row gutter={[16, 16]}>
      <Col lg={user?.role?.super_admin && selectedRowKeys.length ? 15 : 18} sm={24} xs={24}>
        <Typography.Title level={4}>Entregas</Typography.Title>
      </Col>
      {user?.role?.super_admin && selectedRowKeys.length ? (
        <Col lg={3} sm={12} xs={24}>
          <Recalculate ids={selectedRowKeys} />
        </Col>
      ) : null}
      <Col lg={3} sm={12} xs={24}>
        <CSVLink headers={exportHeaders} data={exportData} filename="demands-exported">
          <Tooltip title="Exportar para CSV">
            <Button block type="default" icon={<ExportOutlined />}>
              Exportar
            </Button>
          </Tooltip>
        </CSVLink>
      </Col>
      <Col lg={3} sm={12} xs={24}>
        <Tooltip title="Adicionar">
          <Link to="/demands/create">
            <Button
              block
              type="primary"
              icon={<PlusOutlined />}
              style={{
                display: user?.role.demands_admin ? 'inline' : 'none',
              }}
            >
              Adicionar
            </Button>
          </Link>
        </Tooltip>
      </Col>
      <Col span={24}>
        <Card>
          {contextHolder}
          <Table
            onChange={(_, filters, sorter) => {
              handleTableChange(filters, sorter);
            }}
            loading={isLoading}
            size="small"
            columns={columns}
            dataSource={data}
            scroll={{ x: 1000, y: '72vh' }}
            pagination={{
              position: ['bottomCenter'],
              defaultPageSize: 100,
              pageSizeOptions: [100, 200, 500],
              showTotal(total, range) {
                return `${range[0]}-${range[1]} de ${total} entregas`;
              },
            }}
            rowSelection={rowSelection}
          />
        </Card>
      </Col>
    </Row>
  );
}
