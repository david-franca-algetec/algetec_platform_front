import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { blue, green, lime, orange, sky } from '@radix-ui/colors';
import { nanoid } from '@reduxjs/toolkit';
import { Button, Progress, Space, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';

import { DateField, TagField, TextField } from '../../../components';
import { useAppSelector } from '../../../config/hooks';
import { selectCurrentUser } from '../../../config/reducers/authSlice';
import { getUniqueColor } from '../../../helpers';
import { sortByDate } from '../../../helpers/sortDate';
import { DemandStatus } from '../../../models/enum/demandStatus.enum';
import { ExperimentDemand } from '../../../services/experiments.service';

interface DemandsTableProps {
  dataSource: ExperimentDemand[];
  loading: boolean;
}

export function DemandsTable({ dataSource, loading }: DemandsTableProps) {
  const user = useAppSelector(selectCurrentUser);

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

  const columns: ColumnsType<ExperimentDemand> = [
    {
      title: 'Instituição',
      dataIndex: ['institutions', 'name'],
      key: 'institution_id',
      ellipsis: true,
      width: 150,
      render: (value) => <TextField value={value} />,
    },
    {
      title: 'Tags',
      dataIndex: 'demandTags',
      key: 'tags',
      width: 170,
      filterSearch: true,
      render: (tags: ExperimentDemand['demandTags']) => (
        <Space size="middle" wrap style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
          {tags?.map((tag) => <TagField value={tag.name} color={getUniqueColor(tag.name)} key={nanoid()} />)}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      filterSearch: true,
      filters: Object.values(DemandStatus).map((value) => ({ text: value, value })),
      onFilter: (value, record) => record.status.startsWith(`${value}`),
      render: (value: DemandStatus, record) => <TagField value={value} color={handleStatusName(record.status)} />,
      sorter: {
        compare: (a, b) => a.status.localeCompare(b.status),
      },
    },
    {
      title: 'Prazo',
      key: 'finished_at',
      dataIndex: 'finished_at',
      width: 110,
      render: (value) => <DateField value={value} />,
      sorter: {
        compare: (a, b) => sortByDate(a.finished_at, b.finished_at),
      },
    },
    {
      title: 'Roteirização',
      dataIndex: 'scripting',
      key: 'scripting',
      width: 120,
      sorter: {
        compare: (a, b) => a.scripting - b.scripting,
      },
      render: (value: number) => <Progress percent={value} size="small" />,
    },
    {
      title: 'Modelagem',
      dataIndex: 'modeling',
      key: 'modeling',
      width: 120,
      sorter: {
        compare: (a, b) => a.modeling - b.modeling,
      },
      render: (value: number) => <Progress percent={value} size="small" showInfo />,
    },
    {
      title: 'Programação',
      dataIndex: 'coding',
      key: 'coding',
      width: 120,
      sorter: {
        compare: (a, b) => a.coding - b.coding,
      },
      render: (value: number) => <Progress percent={value} size="small" showInfo />,
    },
    {
      title: 'Testes',
      dataIndex: 'testing',
      key: 'testing',
      width: 120,
      sorter: {
        compare: (a, b) => a.testing - b.testing,
      },
      render: (value: number) => <Progress percent={value} size="small" showInfo />,
    },
    {
      title: 'UALAB',
      dataIndex: 'ualab',
      key: 'ualab',
      width: 120,
      sorter: {
        compare: (a, b) => a.ualab - b.ualab,
      },
      render: (value: number) => <Progress percent={value} size="small" showInfo />,
    },
    {
      title: 'Ações',
      key: 'actions',
      dataIndex: 'actions',
      width: 100,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space>
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
              />
            </Tooltip>
          ) : null}
        </Space>
      ),
    },
  ];

  return (
    <Table
      loading={loading}
      className="w-full"
      size="small"
      dataSource={dataSource}
      columns={columns}
      scroll={{ x: 1000, y: '72vh' }}
      pagination={{
        position: ['bottomCenter'],
        defaultPageSize: 100,
        pageSizeOptions: [100, 200, 500],
        showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} problemas`,
      }}
    />
  );
}
