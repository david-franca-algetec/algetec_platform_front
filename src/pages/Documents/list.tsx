import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, message, Modal, Row, Space, Table, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Key, TableRowSelection } from 'antd/es/table/interface';
import { orderBy } from 'lodash';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchColumn, SidebarWithHeader, TextField } from '../../components';
import { handleError } from '../../helpers';
import { useAllTemplatesQuery, useDeleteTemplateMutation } from '../../services/templates.service';

interface DataType {
  key: Key;
  id: number;
  name: string;
  content: string;
}

const { confirm } = Modal;

export function DocumentsList() {
  const [toast, contextHolder] = message.useMessage();
  const { data: templates, isLoading } = useAllTemplatesQuery();
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [deleteTemplate, { isLoading: isDeletingTemplate }] = useDeleteTemplateMutation();

  const showDeleteConfirm = useCallback((value: DataType) => {
    confirm({
      title: `Deletar o template ${value.name}?`,
      icon: <ExclamationCircleFilled />,
      content: 'Essa ação não pode ser desfeita!',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deleteTemplate(value.id)
          .unwrap()
          .then(() => toast.success(`O template ${value.name} foi deletado com sucesso.`))
          .catch((error) => (error && 'data' in error ? toast.error(handleError(error)) : null));
      },
      okButtonProps: {
        loading: isDeletingTemplate,
      },
      maskStyle: {
        backdropFilter: 'blur(8px)',
      },
    });
  }, []);

  const columns: ColumnsType<DataType> = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      sorter: {
        compare: (a, b) => a.name.localeCompare(b.name),
      },
      ...SearchColumn({ index: 'name', title: 'Nome', includes: true }),
      render: (value) => <TextField value={value} />,
    },
    {
      title: 'Ações',
      key: 'actions',
      dataIndex: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => navigate(`/editor/show/${record.id}`)} />
          <Tooltip title="Editar">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                navigate(`/editor/edit/${record.id}`);
              }}
            />
          </Tooltip>
          <Tooltip title="Excluir">
            <Button
              danger
              type="primary"
              icon={<DeleteOutlined />}
              onClick={() => {
                showDeleteConfirm(record);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const data: DataType[] = orderBy(templates, 'name').map((template) => ({
    key: template.id,
    id: template.id,
    name: template.name,
    content: template.content,
    created_at: template.created_at,
    updated_at: template.updated_at,
  }));

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <SidebarWithHeader>
      <Row gutter={[16, 16]}>
        {contextHolder}
        <Col lg={21} sm={24} xs={24}>
          <Typography.Title level={4}>Documentos</Typography.Title>
        </Col>
        <Col lg={3} sm={12} xs={24}>
          <Tooltip title="Adicionar">
            <Button
              block
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                navigate('/editor/create');
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
                  return `${range[0]}-${range[1]} de ${total} templates`;
                },
              }}
              rowSelection={rowSelection}
            />
          </Card>
        </Col>
      </Row>
    </SidebarWithHeader>
  );
}
