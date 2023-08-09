import { DeleteOutlined, EditOutlined, ExportOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Table, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import { orderBy } from 'lodash';
import { Key, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useNavigate } from 'react-router-dom';

import { BooleanField, DateField, NumberField, SearchColumn, TagField, TextField } from '../../components';
import { useAppSelector } from '../../config/hooks';
import { selectCurrentUser } from '../../config/reducers/authSlice';
import { getUniqueColor } from '../../helpers';
import { sortByDate } from '../../helpers/sortDate';
import { ExperimentStatus } from '../../models/enum/experimentStatus.enum';
import { useAllExperimentsQuery } from '../../services/experiments.service';

interface DataType {
  key: Key;
  id: number;
  name: string;
  pt: boolean;
  en: boolean;
  es: boolean;
  web: boolean;
  ios: boolean;
  android: boolean;
  status: ExperimentStatus;
  image?: string;
  link: string;
  created_at: string;
  updated_at: string;
  approved: boolean;
}
export function LabList() {
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();
  const { data: experimentsData, isLoading: isExperimentsLoading } = useAllExperimentsQuery();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const handleStatus = (status: ExperimentStatus): string => {
    switch (status) {
      case ExperimentStatus.available:
        return 'Disponível';
      case ExperimentStatus.unavailable:
        return 'Indisponível';
      case ExperimentStatus.new:
        return 'Lançamento';
      case ExperimentStatus.beta:
        return 'Lançamento em Beta';
      default:
        return '';
    }
  };

  const experiments = useMemo<DataType[]>(
    () =>
      experimentsData
        ? experimentsData.map((experiment) => ({
            key: experiment.id,
            id: experiment.id,
            name: experiment.name,
            pt: experiment.pt,
            en: experiment.en,
            es: experiment.es,
            web: experiment.web,
            ios: experiment.ios,
            android: experiment.android,
            status: experiment.status,
            created_at: experiment.created_at,
            updated_at: experiment.updated_at,
            image: experiment.image,
            link: experiment.test,
            approved: experiment.approved || false,
          }))
        : [],
    [experimentsData],
  );

  const columns: ColumnsType<DataType> = [
    {
      ...SearchColumn({ index: 'id', title: 'ID' }),
      title: 'ID',
      dataIndex: 'id',
      render: (value) => <NumberField value={value} />,
      fixed: 'left',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      ...SearchColumn({ index: 'name', title: 'Nome', includes: true }),
      title: 'Nome',
      dataIndex: 'name',
      render: (value) => <TextField value={value} />,
      ellipsis: { showTitle: false },
      width: 180,
      sorter: (a, b) => a.name.localeCompare(b.name),
      fixed: 'left',
    },
    {
      title: 'Aprovado',
      dataIndex: 'approved',
      render: (value) => <BooleanField value={value} />,
      align: 'center',
      width: 100,
      filterMultiple: false,
      filters: [
        {
          text: 'Sim',
          value: true,
        },
        {
          text: 'Não',
          value: false,
        },
      ],
      onFilter: (value, record) => record.approved === value,
    },
    {
      title: 'Português',
      dataIndex: 'pt',
      render: (value) => <BooleanField value={value} />,
      align: 'center',
      width: 120,
      filterMultiple: false,
      filters: [
        {
          text: 'Sim',
          value: true,
        },
        {
          text: 'Não',
          value: false,
        },
      ],
      onFilter: (value, record) => record.pt === value,
    },
    {
      title: 'Inglês',
      dataIndex: 'en',
      render: (value) => <BooleanField value={value} />,
      align: 'center',
      width: 100,
      filterMultiple: false,
      filters: [
        {
          text: 'Sim',
          value: true,
        },
        {
          text: 'Não',
          value: false,
        },
      ],
      onFilter: (value, record) => record.en === value,
    },
    {
      title: 'Espanhol',
      dataIndex: 'es',
      render: (value) => <BooleanField value={value} />,
      align: 'center',
      width: 100,
      filterMultiple: false,
      filters: [
        {
          text: 'Sim',
          value: true,
        },
        {
          text: 'Não',
          value: false,
        },
      ],
      onFilter: (value, record) => record.es === value,
    },
    {
      title: 'Web',
      dataIndex: 'web',
      render: (value) => <BooleanField value={value} />,
      align: 'center',
      width: 100,
      filterMultiple: false,
      filters: [
        {
          text: 'Sim',
          value: true,
        },
        {
          text: 'Não',
          value: false,
        },
      ],
      onFilter: (value, record) => record.web === value,
    },
    {
      title: 'Android',
      dataIndex: 'android',
      render: (value) => <BooleanField value={value} />,
      align: 'center',
      width: 100,
      filterMultiple: false,
      filters: [
        {
          text: 'Sim',
          value: true,
        },
        {
          text: 'Não',
          value: false,
        },
      ],
      onFilter: (value, record) => record.android === value,
    },
    {
      title: 'Ios',
      dataIndex: 'ios',
      render: (value) => <BooleanField value={value} />,
      align: 'center',
      width: 100,
      filterMultiple: false,
      filters: [
        {
          text: 'Sim',
          value: true,
        },
        {
          text: 'Não',
          value: false,
        },
      ],
      onFilter: (value, record) => record.ios === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 150,
      render: (value) => <TagField value={handleStatus(value)} color={getUniqueColor(handleStatus(value))} />,
      sorter: (a, b) => handleStatus(a.status).localeCompare(handleStatus(b.status)),
      showSorterTooltip: false,
      filters: [
        {
          text: 'Disponível',
          value: ExperimentStatus.available,
        },
        {
          text: 'Indisponível',
          value: ExperimentStatus.unavailable,
        },
        {
          text: 'Lançamento',
          value: ExperimentStatus.new,
        },
        {
          text: 'Lançamento em Beta',
          value: ExperimentStatus.beta,
        },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Criação',
      dataIndex: 'created_at',
      render: (value) => <DateField value={value} />,
      width: 120,
      sorter: (a, b) => sortByDate(a.created_at, b.created_at),
    },
    {
      title: 'Atualização',
      dataIndex: 'updated_at',
      render: (value) => <DateField value={value} />,
      width: 120,
      sorter: (a, b) => sortByDate(a.updated_at, b.updated_at),
    },
    {
      title: 'Ações',
      dataIndex: 'actions',
      key: 'actions',
      width: 150,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => navigate(`/labs/show/${record.id}`)} />
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() =>
              window.open(
                `https://catalogoalgetec.grupoa.education/dashboard/experiments/edit?id=[${record.id}]`,
                '_blank',
              )
            }
          />
          {user?.role.super_admin ? (
            <Button danger disabled={!user?.role.super_admin} type="primary" icon={<DeleteOutlined />} />
          ) : null}
        </Space>
      ),
    },
  ];

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const exportHeaders = useMemo(
    () => [
      { label: 'ID', key: 'id' },
      { label: 'Nome', key: 'name' },
      { label: 'Aprovado', key: 'approved' },
      { label: 'Português', key: 'pt' },
      { label: 'Inglês', key: 'en' },
      { label: 'Espanhol', key: 'es' },
      { label: 'Web', key: 'web' },
      { label: 'Android', key: 'android' },
      { label: 'Ios', key: 'ios' },
      { label: 'Status', key: 'status' },
      { label: 'Imagem', key: 'image' },
      { label: 'Link de Teste', key: 'link' },
      { label: 'Criado em', key: 'created_at' },
      { label: 'Atualizado em', key: 'updated_at' },
    ],
    [],
  );

  const exportData = useMemo(
    () =>
      selectedRowKeys.length
        ? selectedRowKeys.map((key) => {
            const experiment = experiments?.find((el) => el.id === key);

            return {
              id: experiment?.id,
              name: experiment?.name,
              approved: experiment?.approved ? 'Sim' : 'Não',
              pt: experiment?.pt,
              en: experiment?.en,
              es: experiment?.es,
              web: experiment?.web,
              ios: experiment?.ios,
              android: experiment?.android,
              status: experiment?.status,
              created_at: experiment?.created_at,
              updated_at: experiment?.updated_at,
              image: experiment?.image,
              link: experiment?.link,
            };
          })
        : experiments?.map((experiment) => ({
            id: experiment?.id,
            name: experiment?.name,
            approved: experiment?.approved ? 'Sim' : 'Não',
            pt: experiment?.pt,
            en: experiment?.en,
            es: experiment?.es,
            web: experiment?.web,
            ios: experiment?.ios,
            android: experiment?.android,
            status: experiment?.status,
            created_at: experiment?.created_at,
            updated_at: experiment?.updated_at,
            image: experiment?.image,
            link: experiment?.link,
          })),
    [experimentsData, selectedRowKeys],
  );

  return (
    <Row gutter={[16, 16]}>
      <Col xl={20} lg={20} md={20} sm={24} xs={24}>
        <Typography.Title level={4}>Laboratórios</Typography.Title>
      </Col>
      <Col xl={4} lg={4} md={4} sm={24} xs={24}>
        <CSVLink headers={exportHeaders} data={exportData} filename="labs-exported">
          <Tooltip title="Exportar para CSV">
            <Button block type="default" icon={<ExportOutlined />}>
              Exportar
            </Button>
          </Tooltip>
        </CSVLink>
      </Col>
      <Col span={24}>
        <Card>
          <Table
            loading={isExperimentsLoading}
            dataSource={orderBy(experiments, 'name')}
            columns={columns}
            rowSelection={rowSelection}
            className="w-full"
            size="small"
            scroll={{ x: 1000, y: '72vh' }}
            onChange={() => {
              if (selectedRowKeys.length) {
                setSelectedRowKeys([]);
              }
            }}
            pagination={{
              position: ['bottomCenter'],
              defaultPageSize: 100,
              pageSizeOptions: [100, 200, 500],
              showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} laboratórios`,
            }}
          />
        </Card>
      </Col>
    </Row>
  );
}
