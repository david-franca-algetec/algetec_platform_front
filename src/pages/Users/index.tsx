/* eslint-disable react/jsx-props-no-spreading */
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, message, Modal, Row, Space, Table, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import type { Key, TableRowSelection } from 'antd/es/table/interface';
import { orderBy } from 'lodash';
import { useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { DateField, EmailField, SearchColumn, SidebarWithHeader, TagField, TextField } from '../../components';
import { useAppSelector } from '../../config/hooks';
import { getUniqueColor, handleStringDate } from '../../helpers';
import { useDisclosure } from '../../hooks/useDisclosure';
import { useDestroyUserMutation, useGetUsersQuery } from '../../services/user.service';
import { CreateUser } from './Create';
import { EditUser } from './Edit';

const { confirm } = Modal;

interface DataType {
  key: Key;
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  role: string;
  department: string;
}

export function UsersPage() {
  const { user: userAuth } = useAppSelector((state) => state.auth);
  const { data: usersData, isLoading } = useGetUsersQuery();

  const users = useMemo(() => usersData || [], [usersData]);

  const [destroyUser, { isLoading: isDestroyingUser }] = useDestroyUserMutation();

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [toast, contextHolder] = message.useMessage();

  const create = useDisclosure();
  const edit = useDisclosure();

  const [selectedId, setSelectedId] = useState(0);

  const showDeleteConfirm = (id: number) => {
    const userName = users.find((u) => u.id === id)?.name;
    confirm({
      title: `Deletar o usuário ${userName}?`,
      icon: <ExclamationCircleFilled />,
      content: 'Essa ação não pode ser desfeita!',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        destroyUser(id)
          .unwrap()
          .then(() => toast.success(`Usuário ${userName} deletado com sucesso!`))
          .catch(() => toast.error(`Não foi possível deletar o usuário ${userName}!`));
      },
      okButtonProps: {
        loading: isDestroyingUser,
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
      fixed: 'left',
      width: 120,
      ellipsis: true,
      sorter: {
        compare: (a, b) => a.name.localeCompare(b.name),
      },
      ...SearchColumn({ index: 'name', title: 'Nome', includes: true }),
      render: (value) => <TextField value={value} />,
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
      fixed: 'left',
      width: 140,
      ellipsis: true,
      sorter: {
        compare: (a, b) => a.email.localeCompare(b.email),
      },
      render: (value) => <EmailField value={value} />,
    },
    {
      title: 'Data de Criação',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      align: 'center',
      render: (value) => <DateField value={value} />,
    },
    {
      title: 'Data de Atualização',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 170,
      align: 'center',
      render: (value) => <DateField value={value} />,
    },
    {
      title: 'Nível de Acesso',
      dataIndex: 'role',
      key: 'role',
      width: 150,
      sorter: {
        compare: (a, b) => a.role.localeCompare(b.role),
      },
      render: (value) => <TagField color={getUniqueColor(value)} value={value} />,
    },
    {
      title: 'Equipe',
      dataIndex: 'department',
      key: 'department',
      width: 150,
      sorter: {
        compare: (a, b) => a.department.localeCompare(b.department),
      },
      render: (value) => <TagField color={getUniqueColor(value)} value={value} />,
    },
    {
      title: 'Ações',
      key: 'actions',
      fixed: 'right',
      width: 120,
      dataIndex: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          {userAuth?.role.admin ? (
            <Tooltip title="Editar">
              <Button
                type="primary"
                icon={<EditOutlined />}
                style={{
                  display: userAuth?.role.admin ? 'inline' : 'none',
                }}
                onClick={() => {
                  setSelectedId(record.id);
                  edit.onOpen();
                }}
              />
            </Tooltip>
          ) : null}
          {userAuth?.role.super_admin ? (
            <Tooltip title="Excluir">
              <Button
                danger
                type="primary"
                style={{
                  display: userAuth?.role.admin ? 'inline' : 'none',
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

  const data: DataType[] = orderBy(users, 'name').map((user) => ({
    key: user.id,
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.updated_at,
    role: user.role.name,
    department: user.department.name,
  }));

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
      { label: 'Email', key: 'email' },
      { label: 'Criado em', key: 'created_at' },
      { label: 'Atualizado em', key: 'updated_at' },
      { label: 'Nível de Acesso', key: 'role.name' },
      { label: 'Equipe', key: 'department.name' },
    ],
    [],
  );

  const exportData = useMemo(() => {
    if (selectedRowKeys.length > 0) {
      return selectedRowKeys.map((key) => {
        const data = users.find((i) => i.id === key);

        return {
          id: data?.id,
          name: data?.name,
          email: data?.email,
          created_at: handleStringDate(data?.created_at),
          updated_at: handleStringDate(data?.updated_at),
          'role.name': data?.role.name,
          'department.name': data?.department.name,
        };
      });
    }

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: handleStringDate(user.created_at),
      updated_at: handleStringDate(user.updated_at),
      'role.name': user.role.name,
      'department.name': user.department.name,
    }));
  }, [users, selectedRowKeys]);

  return (
    <SidebarWithHeader>
      <Row gutter={[16, 16]}>
        {contextHolder}
        <Col lg={18} sm={24} xs={24}>
          <Typography.Title level={4}>Usuários</Typography.Title>
        </Col>
        <Col lg={3} sm={12} xs={24}>
          <CSVLink headers={exportHeaders} data={exportData} filename="users-exported">
            <Tooltip title="Exportar para CSV">
              <Button block type="default" icon={<ExportOutlined />}>
                Exportar
              </Button>
            </Tooltip>
          </CSVLink>
        </Col>
        <Col lg={3} sm={12} xs={24}>
          <Tooltip title="Adicionar">
            <Button
              block
              type="primary"
              icon={<PlusOutlined />}
              style={{
                display: userAuth?.role.admin ? 'inline' : 'none',
              }}
              onClick={() => {
                create.onOpen();
              }}
            >
              Adicionar
            </Button>
          </Tooltip>
        </Col>
        <Col span={24}>
          <Card>
            <Table
              loading={isLoading}
              size="small"
              columns={columns}
              dataSource={data}
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
                showTotal(total, range) {
                  return `${range[0]}-${range[1]} de ${total} usuários`;
                },
              }}
              rowSelection={rowSelection}
            />
          </Card>
        </Col>
        <EditUser onClose={edit.onClose} id={selectedId} open={edit.isOpen} />
        <CreateUser onClose={create.onClose} open={create.isOpen} />
      </Row>
    </SidebarWithHeader>
  );
}
