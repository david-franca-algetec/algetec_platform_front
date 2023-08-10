import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, EyeOutlined } from '@ant-design/icons';
import { nanoid } from '@reduxjs/toolkit';
import { Button, Col, Descriptions, List, message, Modal, Row, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table/interface';
import { useState } from 'react';
import { BooleanField, DateField, SearchColumn, TagField, TextField } from '../../../components';
import { useAppSelector } from '../../../config/hooks';
import { selectCurrentUser } from '../../../config/reducers/authSlice';
import { compareVersions, getUniqueColor, handleError, handlePriority } from '../../../helpers';
import { completeVersion } from '../../../helpers/completeVersion';
import { sortByDate } from '../../../helpers/sortDate';
import { useDisclosure } from '../../../hooks/useDisclosure';
import { ISSUES_STATUS } from '../../../models/enum/issuesStatus.enum';
import { PRIORITY } from '../../../models/enum/priority.enum';
import { ExperimentIssue } from '../../../services/experiments.service';
import { useDeleteIssuesMutation } from '../../../services/issues.service';
import { IssueCreate, IssueEdit } from '../../Issues';

interface ExperimentTableProps {
  dataSource: ExperimentIssue[];
  loading: boolean;
}

const { confirm } = Modal;
const { Paragraph } = Typography;
export function IssuesTable({ dataSource, loading }: ExperimentTableProps) {
  const [toast, contextHolder] = message.useMessage();
  const edit = useDisclosure();
  const create = useDisclosure();

  const [currentDataSource, setCurrentDataSource] = useState<ExperimentIssue[]>([]);

  const [id, setId] = useState<number>();

  const user = useAppSelector(selectCurrentUser);

  const [deleteIssue, { isLoading: isDeletingIssue }] = useDeleteIssuesMutation();

  const showDeleteConfirm = (id: number): void => {
    const problemName = dataSource.find((i) => i.id === id)?.problem;
    confirm({
      title: `Deletar a problema ${problemName}?`,
      icon: <ExclamationCircleFilled />,
      content: 'Essa ação não pode ser desfeita!',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deleteIssue(id)
          .unwrap()
          .then(() => toast.success(`O problema ${problemName} foi deletado com sucesso.`))
          .catch((error) => (error && 'data' in error ? toast.error(handleError(error)) : null));
      },
      okButtonProps: {
        loading: isDeletingIssue,
      },
      maskStyle: {
        backdropFilter: 'blur(8px)',
      },
    });
  };

  const columns: ColumnsType<ExperimentIssue> = [
    {
      title: 'Problema',
      dataIndex: 'problem',
      ellipsis: { showTitle: false },
      width: 150,
      fixed: 'left',
      sorter: {
        compare: (a, b) => a.problem.localeCompare(b.problem),
      },
      render: (value) => <TextField value={value} />,
      ...SearchColumn({
        index: 'problem',
        title: 'Problema',
        includes: true,
      }),
    },
    {
      title: 'Gravidade',
      dataIndex: 'priority',
      align: 'center',
      width: 120,
      render: (value) => handlePriority(value),
      filters: [
        {
          text: 'Baixa',
          value: PRIORITY.LOW,
        },
        {
          text: 'Normal',
          value: PRIORITY.NORMAL,
        },
        {
          text: 'Alta',
          value: PRIORITY.HIGH,
        },
        {
          text: 'Critica',
          value: PRIORITY.CRITICAL,
        },
      ],
      onFilter: (value, record) => record.priority === value,
    },
    {
      title: 'Versão',
      dataIndex: 'version',
      width: 100,
      sorter: {
        compare: (a, b) => compareVersions(a.version, b.version),
      },
      render: (value) => <TextField value={completeVersion(value)} />,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 130,
      onFilter: (value, record) => record.status === value,
      filters: [
        {
          text: ISSUES_STATUS.NEW,
          value: ISSUES_STATUS.NEW,
        },
        {
          text: ISSUES_STATUS.IS_NOT_ERROR,
          value: ISSUES_STATUS.IS_NOT_ERROR,
        },
        {
          text: ISSUES_STATUS.DUPLICATE,
          value: ISSUES_STATUS.DUPLICATE,
        },
        {
          text: ISSUES_STATUS.NO_REMOVE,
          value: ISSUES_STATUS.NO_REMOVE,
        },
        {
          text: ISSUES_STATUS.RESOLVED,
          value: ISSUES_STATUS.RESOLVED,
        },
      ],
      render: (value) => <TagField color={getUniqueColor(value)} value={value} />,
    },
    {
      title: 'Aprovado',
      dataIndex: 'approved',
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
      render: (value) => <BooleanField value={value} />,
    },
    {
      // ...SearchColumn({
      //   index: 'creator_name',
      //   title: 'Autor',
      //   includes: true,
      // }),
      title: 'Autor',
      dataIndex: ['creator', 'name'],
      filterSearch: true,
      // filteredValue: author,
      // filters: usersOptions.map((user) => ({ text: user.label, value: user.value })),
      onFilter: (value, record) => record.creator.name === value,
      ellipsis: { showTitle: false },
      width: 120,
      render: (value) => <TextField value={value} />,
    },
    {
      // ...SearchColumn({
      //   index: 'responsible_name',
      //   title: 'Responsável',
      //   includes: true,
      // }),
      title: 'Responsável',
      dataIndex: ['responsible', 'name'],
      filterSearch: true,
      // filteredValue: responsible,
      // filters: usersOptions.map((user) => ({ text: user.label, value: user.value })),
      onFilter: (value, record) => record.responsible.name === value,
      ellipsis: { showTitle: false },
      width: 120,
      render: (value) => <TextField value={value} />,
    },
    {
      title: 'Criação',
      dataIndex: 'created_at',
      width: 100,
      render: (value) => <DateField value={value} />,
      sorter: {
        compare: (a, b) => sortByDate(a.created_at, b.created_at),
      },
    },
    {
      title: 'Atualização',
      dataIndex: 'updated_at',
      width: 120,
      render: (value) => <DateField value={value} />,
      sorter: {
        compare: (a, b) => sortByDate(a.updated_at, b.updated_at),
      },
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
          <Button
            key="show"
            icon={<EyeOutlined />}
            onClick={() => window.open(`${window.location.origin}/issues/show/${record.id}`, '_blank')}
          />
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              edit.onOpen();
              setId(record.id);
            }}
          />
          {user?.role.super_admin ? (
            <Button
              key="delete"
              danger
              disabled={!user?.role.super_admin}
              type="primary"
              icon={<DeleteOutlined />}
              onClick={() => {
                showDeleteConfirm(record.id);
              }}
            />
          ) : null}
        </Space>
      ),
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Button block type="dashed" onClick={create.onOpen}>
          Adicionar
        </Button>
      </Col>
      <Col span={24}>
        <Table
          loading={loading}
          className="w-full"
          size="small"
          dataSource={dataSource}
          columns={columns}
          onChange={(_a, _b, _c, d) => {
            setCurrentDataSource(d.currentDataSource);
          }}
          scroll={{ x: 1000, y: '72vh' }}
          pagination={{
            position: ['bottomCenter'],
            defaultPageSize: 100,
            pageSizeOptions: [100, 200, 500],
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} problemas`,
          }}
        />
      </Col>
      <Col span={24}>
        <List
          dataSource={currentDataSource.length ? currentDataSource : dataSource}
          renderItem={(issueData) => (
            <List.Item key={nanoid()}>
              <Descriptions
                layout="vertical"
                column={{ lg: 2, md: 1, sm: 1 }}
                bordered
                className="w-full"
                title={issueData?.problem || '-'}
                extra={
                  <Space>
                    <Button
                      key="show"
                      icon={<EyeOutlined />}
                      onClick={() => window.open(`${window.location.origin}/issues/show/${issueData.id}`, '_blank')}
                    />
                    <Button
                      key="edit"
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => {
                        edit.onOpen();
                        setId(issueData.id);
                      }}
                    />
                    {user?.role.super_admin ? (
                      <Button
                        key="delete"
                        danger
                        disabled={!user?.role.super_admin}
                        type="primary"
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          showDeleteConfirm(issueData.id);
                        }}
                      />
                    ) : null}
                  </Space>
                }
              >
                <Descriptions.Item label="Descrição" span={2}>
                  <Paragraph className="whitespace-pre-wrap text-justify">{issueData?.description || '-'}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="Gravidade">{handlePriority(issueData?.priority)}</Descriptions.Item>
                <Descriptions.Item label="Versão">{completeVersion(issueData?.version)}</Descriptions.Item>
                <Descriptions.Item label="Status">{issueData?.status || '-'}</Descriptions.Item>
                <Descriptions.Item label="Autor">{issueData?.creator.name || '-'}</Descriptions.Item>
                <Descriptions.Item label="Responsável">{issueData?.responsible.name || '-'}</Descriptions.Item>
                <Descriptions.Item label="Ambiente">
                  {issueData?.issueTags.map((tag) => <TagField value={tag.name} color={getUniqueColor(tag.name)} />)}
                </Descriptions.Item>
                <Descriptions.Item label="Data de Criação">
                  <DateField value={issueData?.created_at} format="DD/MM/YYYY HH:mm" />
                </Descriptions.Item>
                <Descriptions.Item label="Data de Atualização">
                  <DateField value={issueData?.updated_at} format="DD/MM/YYYY HH:mm" />
                </Descriptions.Item>
              </Descriptions>
            </List.Item>
          )}
        />
      </Col>

      {contextHolder}
      <IssueEdit onClose={edit.onClose} isOpen={edit.isOpen} id={id} />
      <IssueCreate onClose={create.onClose} isOpen={create.isOpen} />
    </Row>
  );
}
