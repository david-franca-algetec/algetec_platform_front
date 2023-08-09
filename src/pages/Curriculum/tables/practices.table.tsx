import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  ExportOutlined,
  EyeOutlined,
  FileOutlined,
  FileTextOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { nanoid } from '@reduxjs/toolkit';
import {
  Button,
  Col,
  Descriptions,
  Divider,
  List,
  message,
  Modal,
  Popover,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import { ColumnsType, Key, TableRowSelection } from 'antd/es/table/interface';
import parse from 'html-react-parser';
import { orderBy } from 'lodash';
import React, { useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useNavigate } from 'react-router-dom';
import { NumberField, ScrollArea, SearchColumn, TagField, TextField } from '../../../components';
import { getUniqueColor, handleError } from '../../../helpers';
import { useDisclosure } from '../../../hooks/useDisclosure';
import { useDeletePracticeMutation, useGetPracticesQuery } from '../../../services/practices.service';
import PracticesCreate from '../create/practices.create';
import { PracticeEdit } from '../edit/practice.edit';

interface DataType {
  key: Key;
  id: number;
  code: string;
  name: string;
  description: string;
  experiment_id: number;
  experiment_name: string;
  experiment_description: string;
  areas: string[];
  skills: string[];
}

const { confirm } = Modal;

export function PracticesTable() {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const [toast, contextHolder] = message.useMessage();
  const [id, setId] = useState<number>();
  const createPractice = useDisclosure();
  const editPractice = useDisclosure();

  const { data: practicesData, isLoading: isLoadingPractices } = useGetPracticesQuery();
  const [deletePractice, { isLoading: isDeletingPractice }] = useDeletePracticeMutation();
  const showDeleteConfirm = (id: number): void => {
    const problemName = practicesData?.find((i) => i.id === id)?.name;
    confirm({
      title: `Deletar a prática ${problemName}?`,
      icon: <ExclamationCircleFilled />,
      content: 'Essa ação não pode ser desfeita!',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deletePractice(id)
          .unwrap()
          .then(() => toast.success(`A prática ${problemName} foi deletado com sucesso.`))
          .catch((error) => (error && 'data' in error ? toast.error(handleError(error)) : null));
      },
      okButtonProps: {
        loading: isDeletingPractice,
      },
      maskStyle: {
        backdropFilter: 'blur(8px)',
      },
    });
  };

  const dataSource = useMemo<DataType[]>(
    () =>
      practicesData
        ? orderBy(practicesData, 'code', 'asc').map((practice) => ({
            key: practice.id,
            id: practice.id,
            code: practice.code,
            name: practice.name,
            description: practice.description,
            experiment_id: practice.experiment_id,
            experiment_name: practice.experiment.name,
            experiment_description: practice.experiment.description,
            areas: practice.experiment.areas.map((el) => el.name),
            skills: practice.skills.map(
              (el) => `${el.competence.curriculum.name} - ${el.competence.code} - ${el.code}`,
            ),
          }))
        : [],
    [practicesData],
  );

  const [currentSource, setCurrentSource] = useState<DataType[]>(dataSource);

  const columns: ColumnsType<DataType> = [
    {
      ...SearchColumn({
        index: 'code',
        title: 'Código',
        includes: true,
      }),
      title: 'Código',
      dataIndex: 'code',
      key: 'code',
      showSorterTooltip: false,
      width: 150,
      align: 'center',
      sorter: {
        compare: (a, b) => a.code.localeCompare(b.code),
      },
      render: (value) => <TextField value={value} />,
    },
    {
      ...SearchColumn({
        index: 'name',
        title: 'Nome',
        includes: true,
      }),
      title: 'Prática',
      dataIndex: 'name',
      key: 'name',
      showSorterTooltip: false,
      width: 150,
      align: 'center',
      sorter: {
        compare: (a, b) => a.name.localeCompare(b.name),
      },
      render: (value) => <TextField value={value} ellipsis />,
    },
    {
      ...SearchColumn({
        index: 'description',
        title: 'Descrição',
        includes: true,
      }),
      title: 'Descrição',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
      width: 100,
      render: (value) =>
        value ? (
          <Popover content={value}>
            <FileTextOutlined />
          </Popover>
        ) : (
          <FileOutlined />
        ),
    },
    {
      ...SearchColumn({
        index: 'experiment_id',
        title: 'ID do Laboratório',
        includes: true,
      }),
      title: 'ID Lab',
      dataIndex: 'experiment_id',
      key: 'experiment_id',
      align: 'center',
      width: 100,
      sorter: {
        compare: (a, b) => a.experiment_id - b.experiment_id,
      },
      render: (value) => <NumberField value={value} />,
    },
    {
      ...SearchColumn({
        index: 'experiment_name',
        title: 'Nome do Laboratório',
        includes: true,
      }),
      title: 'Nome Lab',
      dataIndex: 'experiment_name',
      key: 'experiment_name',
      showSorterTooltip: false,
      align: 'center',
      width: 150,
      sorter: {
        compare: (a, b) => a.experiment_name.localeCompare(b.experiment_name),
      },
      render: (value) => <TextField value={value} ellipsis />,
    },
    {
      title: 'Desc Lab',
      dataIndex: 'experiment_description',
      key: 'experiment_description',
      align: 'center',
      width: 100,
      render: (value) =>
        value ? (
          <Popover content={<ScrollArea width={500}>{parse(value)}</ScrollArea>}>
            <FileTextOutlined />
          </Popover>
        ) : (
          <FileOutlined />
        ),
    },
    {
      title: 'Área',
      dataIndex: 'areas',
      key: 'areas',
      showSorterTooltip: false,
      align: 'center',
      width: 150,
      render: (values: string[]) =>
        values.length ? (
          <Popover content={<List dataSource={values} renderItem={(item) => <List.Item>{item}</List.Item>} />}>
            <FileTextOutlined />
          </Popover>
        ) : (
          <FileOutlined />
        ),
    },
    {
      title: 'Habilidades',
      dataIndex: 'skills',
      key: 'skills',
      showSorterTooltip: false,
      align: 'center',
      width: 100,
      render: (values: string[]) =>
        values.length ? (
          <Popover content={<List dataSource={values} renderItem={(item) => <List.Item>{item}</List.Item>} />}>
            <FileTextOutlined />
          </Popover>
        ) : (
          <FileOutlined />
        ),
    },
    {
      title: 'Ações',
      key: 'actions',
      dataIndex: 'actions',
      width: 150,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => navigate(`practices/show/${record.id}`)} />
          <Tooltip title="Editar">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setId(record.id);
                editPractice.onOpen();
              }}
            />
          </Tooltip>
          <Tooltip title="Excluir">
            <Button
              danger
              type="primary"
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

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Row gutter={[16, 16]}>
      {contextHolder}
      <Col offset={18} lg={3} sm={12} xs={24}>
        <CSVLink headers={[]} data={[]} filename="practices-exported">
          <Tooltip title="Exportar para CSV">
            <Button block type="default" icon={<ExportOutlined />}>
              Exportar
            </Button>
          </Tooltip>
        </CSVLink>
      </Col>
      <Col lg={3} sm={12} xs={24}>
        <Button block type="primary" icon={<PlusOutlined />} onClick={createPractice.onOpen}>
          Adicionar
        </Button>
      </Col>
      <Col span={24}>
        <Table
          className="w-full"
          loading={isLoadingPractices}
          size="small"
          scroll={{ x: 1000, y: '72vh' }}
          columns={columns}
          onChange={(_a, _b, _c, currentTable) => {
            if (selectedRowKeys.length) {
              setSelectedRowKeys([]);
            }
            setCurrentSource(currentTable.currentDataSource);
          }}
          dataSource={dataSource}
          pagination={{
            position: ['bottomCenter'],
            defaultPageSize: 100,
            pageSizeOptions: [100, 200, 500],
            showTotal(total, range) {
              return `${range[0]}-${range[1]} de ${total} práticas`;
            },
          }}
          rowSelection={rowSelection}
        />
      </Col>
      <Divider />
      <Col span={24}>
        <List
          dataSource={currentSource.length ? currentSource : dataSource}
          renderItem={(item) => (
            <List.Item key={nanoid()}>
              <Descriptions
                title={item.name}
                extra={
                  <Space>
                    <Tooltip title="Editar">
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setId(item.id);
                          editPractice.onOpen();
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <Button
                        danger
                        type="primary"
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          showDeleteConfirm(item.id);
                        }}
                      />
                    </Tooltip>
                  </Space>
                }
                layout="vertical"
                column={{ sm: 1, md: 2, lg: 2, xs: 1, xl: 2, xxl: 2 }}
                bordered
                className="w-full"
              >
                <Descriptions.Item label="Código" contentStyle={{ width: '50%' }}>
                  <Typography.Text type="secondary">{item.code}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="Descrição" contentStyle={{ width: '50%' }}>
                  <Typography.Text type="secondary">{item.description}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="Laboratório">
                  <Typography.Text type="secondary">{item.experiment_name}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="Áreas" span={2}>
                  <Space size="small" wrap>
                    {item.areas.map((area) => (
                      <TagField value={area} color={getUniqueColor(area)} />
                    ))}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Habilidades">
                  <Space size="small" wrap>
                    {item.skills.map((skill) => (
                      <TagField value={skill} color={getUniqueColor(skill)} />
                    ))}
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </List.Item>
          )}
        />
      </Col>
      <PracticesCreate isOpen={createPractice.isOpen} onClose={createPractice.onClose} />
      <PracticeEdit onClose={editPractice.onClose} isOpen={editPractice.isOpen} id={id} />
    </Row>
  );
}
