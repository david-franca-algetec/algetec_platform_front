/* eslint-disable react/no-unstable-nested-components */
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import { nanoid } from '@reduxjs/toolkit';
import { Avatar, Button, Card, Col, message, Modal, Row, Space, Table, Tooltip, Typography } from 'antd';

import type { ColumnsType, Key, TableRowSelection } from 'antd/es/table/interface';
import { orderBy } from 'lodash';
import { useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { SearchColumn, SidebarWithHeader } from '../../components';
import { useAppSelector } from '../../config/hooks';
import { getUniqueColor, handleError, handleTypeName } from '../../helpers';
import { useDisclosure } from '../../hooks/useDisclosure';
import { useDestroyChecklistMutation, useGetChecklistsQuery } from '../../services/checklist.service';
import { CreateChecklist } from './Create';
import { EditChecklist } from './Edit';

const { confirm } = Modal;

interface DataType {
  key: Key;
  id: number;
  name: string;
  departments: string[];
}

export function ChecklistPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: checklistsData, isLoading } = useGetChecklistsQuery();
  const [deleteChecklist, { isLoading: isDeletingChecklist }] = useDestroyChecklistMutation();
  const create = useDisclosure();
  const edit = useDisclosure();
  const [selectedId, setSelectedId] = useState(0);

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [toast, contextHolder] = message.useMessage();

  const checklists = useMemo(() => checklistsData || [], [checklistsData]);

  const showDeleteConfirm = (id: number) => {
    const checklistName = checklists.find((i) => i.id === id)?.name;
    confirm({
      title: `Deletar a lista de tarefas ${checklistName}?`,
      icon: <ExclamationCircleFilled />,
      content: 'Essa ação não pode ser desfeita!',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deleteChecklist(id)
          .unwrap()
          .then(() => toast.success(`A lista de tarefas ${checklistName} foi deletada com sucesso.`))
          .catch((error) => (error && 'data' in error ? toast.error(handleError(error)) : null));
      },
      okButtonProps: {
        loading: isDeletingChecklist,
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
      sorter: {
        compare: (a, b) => a.name.localeCompare(b.name),
      },
      ...SearchColumn({ index: 'name', title: 'Nome' }),
    },
    {
      title: 'Time Padrão',
      dataIndex: 'departments',
      key: 'departments',
      render: (values: string[]) => (
        <Avatar.Group>
          {values.map((value) => (
            <Tooltip key={nanoid()} title={value} placement="topLeft">
              <Avatar style={{ backgroundColor: getUniqueColor(value) }}>{value.charAt(0)}</Avatar>
            </Tooltip>
          ))}
        </Avatar.Group>
      ),
    },
    {
      title: 'Ações',
      align: 'center',
      dataIndex: 'actions',
      key: 'actions',
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

  const data: DataType[] = orderBy(checklists, [(check) => check.name.toLowerCase()]).map((i) => ({
    key: i.id,
    id: i.id,
    name: i.name,
    departments: i.departments.map((department) => handleTypeName(department.name)),
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
        const checklist = checklists.find((i) => i.id === key);

        return {
          id: checklist?.id,
          name: checklist?.name,
        };
      });
    }

    return checklists.map((checklist) => ({
      id: checklist.id,
      name: checklist.name,
    }));
  }, [selectedRowKeys, checklists]);

  const exportHeaders = useMemo(
    () => [
      { label: 'ID', key: 'id' },
      { label: 'Nome', key: 'name' },
      { label: 'Criado em', key: 'created_at' },
      { label: 'Atualizado em', key: 'updated_at' },
    ],
    [],
  );

  return (
    <SidebarWithHeader>
      <Row gutter={[16, 16]}>
        <Col lg={18} sm={24} xs={24}>
          <Typography.Title level={4}>Lista de tarefas</Typography.Title>
        </Col>
        <Col lg={3} sm={12} xs={24}>
          <CSVLink headers={exportHeaders} data={exportData} filename="checklists-exported">
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
                display: user?.role.admin ? 'inline' : 'none',
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
            {contextHolder}
            <Table
              loading={isLoading}
              size="small"
              columns={columns}
              dataSource={data}
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
                  return `${range[0]}-${range[1]} de ${total} instituições`;
                },
              }}
              rowSelection={rowSelection}
            />
            <EditChecklist onClose={edit.onClose} id={selectedId} open={edit.isOpen} />
            <CreateChecklist onClose={create.onClose} open={create.isOpen} />
          </Card>
        </Col>
      </Row>
    </SidebarWithHeader>
  );
}
