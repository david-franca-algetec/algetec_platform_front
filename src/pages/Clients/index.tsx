/* eslint-disable react/no-unstable-nested-components */
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, message, Modal, Row, Space, Table, Tooltip, Typography } from 'antd';

import type { ColumnsType, Key, TableRowSelection } from 'antd/es/table/interface';
import { orderBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { DateField, SearchColumn, SidebarWithHeader, TextField } from '../../components';
import { useAppSelector } from '../../config/hooks';
import { handleError } from '../../helpers';
import { sortByDate } from '../../helpers/sortDate';
import { useDisclosure } from '../../hooks/useDisclosure';
import { Institution } from '../../models/institution.model';
import { useDeleteInstitutionMutation, useGetInstitutionsQuery } from '../../services/institution.service';
import { CreateClient } from './Create';
import { EditClient } from './Edit';

const { confirm } = Modal;

interface DataType {
  key: Key;
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export function ClientsPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: institutionsData, isLoading } = useGetInstitutionsQuery();
  const [deleteInstitution, { isLoading: isDeletingInstitution }] = useDeleteInstitutionMutation();
  const create = useDisclosure();
  const edit = useDisclosure();
  const [selectedId, setSelectedId] = useState(0);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [toast, contextHolder] = message.useMessage();

  const showDeleteConfirm = (id: number) => {
    const institutionName = institutions.find((i) => i.id === id)?.name;
    confirm({
      title: `Deletar a Instituição ${institutionName}?`,
      icon: <ExclamationCircleFilled />,
      content: 'Essa ação não pode ser desfeita!',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deleteInstitution(id)
          .unwrap()
          .then(() => toast.success(`A Instituição ${institutionName} foi deletada com sucesso.`))
          .catch((error) => (error && 'data' in error ? toast.error(handleError(error)) : null));
      },
      okButtonProps: {
        loading: isDeletingInstitution,
      },
      maskStyle: {
        backdropFilter: 'blur(8px)',
      },
    });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      showSorterTooltip: false,
      width: 100,
      sorter: {
        compare: (a, b) => a.name.localeCompare(b.name),
      },
      render: (value) => <TextField value={value} />,
      ...SearchColumn({ index: 'name', title: 'Nome' }),
    },
    {
      title: 'Criação',
      dataIndex: 'createdAt',
      key: 'createdAt',
      showSorterTooltip: false,
      width: 50,
      sorter: {
        compare: (a, b) => sortByDate(a.createdAt, b.createdAt),
      },
      render: (value) => <DateField value={value} />,
    },
    {
      title: 'Atualização',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      showSorterTooltip: false,
      width: 50,
      sorter: {
        compare: (a, b) => sortByDate(a.updatedAt, b.updatedAt),
      },
      render: (value) => <DateField value={value} />,
    },
    {
      title: 'Ações',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      width: 50,
      render: (_, record) => (
        <Space>
          <Tooltip title="Editar">
            <Button
              type="primary"
              icon={<EditOutlined />}
              style={{
                display: user?.role.admin ? 'inline' : 'none',
              }}
              onClick={() => {
                setSelectedId(record.id);
                edit.onOpen();
              }}
            />
          </Tooltip>
          <Tooltip title="Excluir">
            <Button
              danger
              type="primary"
              style={{
                display: user?.role.admin ? 'inline' : 'none',
              }}
              icon={<DeleteOutlined />}
              onClick={() => {
                showDeleteConfirm(record.id);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const data: DataType[] = orderBy(institutions, 'name').map((i) => ({
    key: i.id,
    id: i.id,
    name: i.name,
    createdAt: i.created_at,
    updatedAt: i.updated_at,
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
        const institution = institutions.find((i) => i.id === key);

        return {
          id: institution?.id,
          name: institution?.name,
          created_at: institution?.created_at,
          updated_at: institution?.updated_at,
        };
      });
    }

    return institutions.map((institution) => ({
      id: institution.id,
      name: institution.name,
      created_at: institution.created_at,
      updated_at: institution.updated_at,
    }));
  }, [selectedRowKeys, institutions]);

  const exportHeaders = useMemo(
    () => [
      { label: 'ID', key: 'id' },
      { label: 'Nome', key: 'name' },
      { label: 'Criado em', key: 'created_at' },
      { label: 'Atualizado em', key: 'updated_at' },
    ],
    [],
  );

  useEffect(() => {
    if (institutionsData) {
      setInstitutions(institutionsData);
    }
  }, [institutionsData]);

  return (
    <SidebarWithHeader>
      <Row gutter={[16, 16]}>
        <Col lg={18} sm={24} xs={24}>
          <Typography.Title level={4}>Instituições</Typography.Title>
        </Col>
        <Col lg={3} sm={12} xs={24}>
          <CSVLink headers={exportHeaders} data={exportData} filename="institutions-exported">
            <Tooltip title="Exportar para CSV">
              <Button block type="default" icon={<ExportOutlined />}>
                Exportar
              </Button>
            </Tooltip>
          </CSVLink>
        </Col>
        <Col lg={3} sm={12} xs={24}>
          <Button
            block
            type="primary"
            icon={<PlusOutlined />}
            style={{
              display: user?.role.admin ? 'inline' : 'none',
            }}
            onClick={() => {
              create.onOpen();
            }}
          >
            Adicionar
          </Button>
        </Col>
        <Col span={24}>
          <Card>
            {contextHolder}
            <Table
              className="w-full"
              loading={isLoading}
              size="small"
              scroll={{ x: 1000, y: '72vh' }}
              columns={columns}
              onChange={() => {
                if (selectedRowKeys.length) {
                  setSelectedRowKeys([]);
                }
              }}
              dataSource={data}
              pagination={{
                position: ['bottomCenter'],
                defaultPageSize: 100,
                pageSizeOptions: [100, 200, 500],
                showTotal(total, range) {
                  return `${range[0]}-${range[1]} de ${total} instituições`;
                },
              }}
              rowSelection={rowSelection}
            />
            <EditClient onClose={edit.onClose} id={selectedId} open={edit.isOpen} />
            <CreateClient onClose={create.onClose} open={create.isOpen} />
          </Card>
        </Col>
      </Row>
    </SidebarWithHeader>
  );
}
