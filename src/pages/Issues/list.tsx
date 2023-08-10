import {
  ClearOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  ExportOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Skeleton,
  Space,
  Table,
  TablePaginationConfig,
  Tooltip,
  Typography,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FilterValue, SorterResult, TableRowSelection } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import { orderBy } from 'lodash';
import { Key, useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { createSearchParams, useSearchParams } from 'react-router-dom';

import { BooleanField, DateField, SearchColumn, SidebarWithHeader, TagField, TextField } from '../../components';
import { UrlField } from '../../components/fields/url';
import { useAppDispatch, useAppSelector } from '../../config/hooks';
import { selectCurrentUser } from '../../config/reducers/authSlice';
import { setIssueFilters } from '../../config/reducers/issuesSlice';
import { getUniqueColor, handleError, handlePriority } from '../../helpers';
import { completeVersion } from '../../helpers/completeVersion';
import { sortByDate } from '../../helpers/sortDate';
import { useDisclosure } from '../../hooks/useDisclosure';
import { ISSUES_STATUS } from '../../models/enum/issuesStatus.enum';
import { PRIORITY } from '../../models/enum/priority.enum';
import { useGetExperimentsQuery } from '../../services/demands.service';
import { QueryString, useAllIssuesQuery, useDeleteIssuesMutation } from '../../services/issues.service';
import { useGetUsersQuery } from '../../services/user.service';
import { IssueCreate } from './create';
import { IssueEdit } from './edit';

interface DataType {
  key: Key;
  id: number;
  problem: string;
  priority: number;
  version: string;
  status: string;
  description: string;
  experiment_id: number;
  approved: boolean;
  created_by_id: number;
  creator_name: string;
  responsible_id: number;
  responsible_name: string;
  issueTags: string[];
  created_at: string;
  updated_at: string;
}

interface FormFilters {
  problem?: string;
  priority?: number[];
  status?: string[];
  approved?: boolean;
  creator?: number[];
  responsible?: number[];
  experimentId?: string;
}

const { confirm } = Modal;

export function IssuesList() {
  const edit = useDisclosure();
  const create = useDisclosure();
  const [id, setId] = useState<number>();
  const [toast, contextHolder] = message.useMessage();
  const [searchParams, setSearchParams] = useSearchParams();

  const user = useAppSelector(selectCurrentUser);
  const { problem, status, priority, approved, creator, responsible, experimentId, version } = useAppSelector(
    (state) => state.issues,
  );
  const dispatch = useAppDispatch();

  const [queryParams, setQueryParams] = useState<QueryString>({ page: 1, limit: 100 });
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [isCollapsible, setIsCollapsible] = useState(false);

  const { data: issuesData, isLoading: isAllIssuesLoading, isFetching } = useAllIssuesQuery(queryParams);

  const { data: usersData, isLoading: isUsersLoading } = useGetUsersQuery();
  const [deleteIssue, { isLoading: isDeletingIssue }] = useDeleteIssuesMutation();
  const { data: experimentsData, isLoading: isExperimentsLoading } = useGetExperimentsQuery();

  const usersOptions = useMemo(
    () => (usersData ? orderBy(usersData, 'name').map((user) => ({ label: user.name, value: user.id })) : []),
    [usersData],
  );

  const experimentsOptions = useMemo(
    () =>
      experimentsData
        ? orderBy(experimentsData, 'name').map((experiment) => ({
            label: `${experiment.id} - ${experiment.name}`,
            value: experiment.id.toString(),
          }))
        : [],
    [experimentsData],
  );

  const meta = useMemo(() => issuesData?.meta, [issuesData]);
  const issueData = useMemo(() => (issuesData ? issuesData.data : []), [issuesData]);

  const showDeleteConfirm = (id: number): void => {
    const problemName = issueData.find((i) => i.id === id)?.problem;
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

  const columns: ColumnsType<DataType> = [
    {
      ...SearchColumn({ title: 'ID', index: 'experiment_id' }),
      title: 'ID',
      onFilter: undefined,
      dataIndex: 'experiment_id',
      width: 80,
      sorter: {
        compare: (a, b) => a.experiment_id - b.experiment_id,
      },
      render: (value: number) => <UrlField value={value.toString()} href={`/labs/show/${value}`} target="_blank" />,
      filterSearch: true,
      filterMultiple: false,
      filteredValue: experimentId ? [experimentId] : null,
    },
    {
      ...SearchColumn({
        index: 'problem',
        title: 'Problema',
        includes: true,
      }),
      title: 'Problema',
      onFilter: undefined,
      dataIndex: 'problem',
      ellipsis: { showTitle: false },
      width: 150,
      sorter: {
        compare: (a, b) => a.problem.localeCompare(b.problem),
      },
      render: (value) => <TextField value={value} />,
      filteredValue: problem ? [problem] : null,
    },
    {
      title: 'Gravidade',
      dataIndex: 'priority',
      align: 'center',
      width: 120,
      filteredValue: priority,
      sorter: {
        compare: (a, b) => a.priority - b.priority,
      },
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
    },
    {
      ...SearchColumn({ title: 'Versão', index: 'version', includes: true }),
      title: 'Versão',
      dataIndex: 'version',
      width: 100,
      filteredValue: version ? [version] : null,
      sorter: {
        compare: (a, b) => completeVersion(a.version).localeCompare(completeVersion(b.version)),
      },
      render: (value) => <TextField value={completeVersion(value)} />,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 130,
      filteredValue: status,
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
      filteredValue: typeof approved !== 'undefined' ? [approved] : null,
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
      render: (value) => <BooleanField value={value} />,
    },
    {
      title: 'Autor',
      dataIndex: ['creator_name'],
      filterSearch: true,
      filteredValue: creator,
      filters: usersOptions.map((user) => ({ text: user.label, value: user.value })),
      ellipsis: { showTitle: false },
      width: 120,
      render: (value) => <TextField value={value} />,
    },
    {
      title: 'Ambiente',
      dataIndex: 'issueTags',
      filteredValue: undefined,
      width: 100,
      render: (values: string[]) => values.map((tag) => <TagField value={tag} color={getUniqueColor(tag)} />),
    },
    {
      title: 'Responsável',
      dataIndex: ['responsible_name'],
      filterSearch: true,
      filteredValue: responsible,
      filters: usersOptions.map((user) => ({ text: user.label, value: user.value })),
      ellipsis: { showTitle: false },
      width: 120,
      render: (value) => <TextField value={value} />,
    },
    {
      title: 'Criação',
      dataIndex: 'created_at',
      filteredValue: undefined,
      width: 100,
      render: (value) => <DateField value={value} />,
      sorter: {
        compare: (a, b) => sortByDate(a.created_at, b.created_at),
      },
    },
    {
      title: 'Ações',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      width: 150,
      filteredValue: undefined,
      fixed: 'right',
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

  const dataSource = useMemo<DataType[]>(() => {
    if (issueData.length > 0) {
      return issueData.map((issue) => ({
        approved: issue.approved,
        created_at: issue.created_at,
        created_by_id: issue.created_by_id,
        creator_name: issue.creator.name,
        description: issue.description,
        experiment_id: issue.experiment_id,
        id: issue.id,
        issueTags: issue.issueTags.map((tag) => tag.name),
        priority: issue.priority,
        key: issue.id,
        problem: issue.problem,
        responsible_id: issue.responsible_id,
        responsible_name: issue.responsible.name,
        status: issue.status,
        updated_at: issue.updated_at,
        version: issue.version,
      }));
    }
    return [];
  }, [issueData]);

  const [form] = Form.useForm<FormFilters>();

  const onFinish = (values: FormFilters): void => {
    setQueryParams({ ...values, page: 1, limit: 100 });
    dispatch(setIssueFilters(values));
  };

  const handleClear = (): void => {
    form.resetFields();
    dispatch(setIssueFilters({}));
    setQueryParams({ page: 1, limit: 100 });
  };

  const handleUrgentCorrection = (): void => {
    form.resetFields();
    dispatch(setIssueFilters({ approved: false, priority: [PRIORITY.CRITICAL] }));
    form.setFieldsValue({
      approved: false,
      priority: [PRIORITY.CRITICAL],
    });
  };

  const handleCorrectionPending = (): void => {
    form.resetFields();
    dispatch(setIssueFilters({ approved: false, status: [ISSUES_STATUS.NEW] }));
    form.setFieldsValue({
      approved: false,
      status: [ISSUES_STATUS.NEW],
    });
  };

  const handlePendingApproval = (): void => {
    form.resetFields();
    dispatch(setIssueFilters({ approved: false }));
    form.setFieldsValue({
      approved: false,
      status: [ISSUES_STATUS.DUPLICATE, ISSUES_STATUS.NO_REMOVE, ISSUES_STATUS.RESOLVED, ISSUES_STATUS.IS_NOT_ERROR],
    });
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<DataType> | SorterResult<DataType>[],
  ) => {
    if (selectedRowKeys.length) {
      setSelectedRowKeys([]);
    }

    const sorterParams = !Array.isArray(sorter) ? sorter : undefined;

    const filtersParams = {
      problem: filters.problem !== null ? (filters.problem as unknown as string) : undefined,
      approved: filters.approved !== null ? (filters.approved[0] as unknown as boolean) : undefined,
      status: filters.status !== null ? (filters.status as unknown as string[]) : undefined,
      version: filters.version !== null ? (filters.version[0] as unknown as string) : undefined,
      priority: filters.priority !== null ? (filters.priority as unknown as number[]) : undefined,
      creator: filters.creator_name !== null ? (filters.creator_name as unknown as number[]) : undefined,
      responsible: filters.responsible_name !== null ? (filters.responsible_name as unknown as number[]) : undefined,
      experimentId: filters.experiment_id !== null ? (filters.experiment_id[0] as unknown as string) : undefined,
    };

    const queryStringParams: QueryString = {
      page: pagination.current || 1,
      limit: pagination.pageSize || 100,
      approved: filtersParams.approved,
      priority: filtersParams.priority,
      status: filtersParams.status,
      problem: filtersParams.problem,
      creator: filtersParams.creator,
      responsible: filtersParams.responsible,
      order: sorterParams?.order === 'ascend' ? 'ascendant' : 'descendent',
      field: sorterParams?.field as string,
      experiment: filtersParams.experimentId,
      version: filtersParams.version,
    };

    setQueryParams(queryStringParams);
    dispatch(setIssueFilters(filtersParams));
    form.setFieldsValue(filtersParams);
  };

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const exportData = useMemo(
    () =>
      selectedRowKeys.length
        ? selectedRowKeys.map((key) => {
            const issues = issueData.find((i) => i.id === key);

            return {
              id: issues?.id,
              problem: issues?.problem,
              priority: issues?.priority ? handlePriority(issues.priority, true) : undefined,
              version: completeVersion(issues?.version),
              status: issues?.status,
              approved: issues?.approved ? 'Sim' : 'Não',
              creator: issues?.creator?.name,
              responsible: issues?.responsible?.name,
              description: issues?.description,
              issueTags: issues?.issueTags.map((tag) => tag.name).join(', '),
              created_at: issues?.created_at ? dayjs(issues?.created_at).format('DD/MM/YYYY') : undefined,
              updated_at: issues?.updated_at ? dayjs(issues?.updated_at).format('DD/MM/YYYY') : undefined,
            };
          })
        : issueData.map((issues) => ({
            id: issues?.id,
            problem: issues?.problem,
            priority: handlePriority(issues?.priority, true),
            version: completeVersion(issues?.version),
            status: issues?.status,
            approved: issues?.approved ? 'Sim' : 'Não',
            creator: issues?.creator?.name,
            responsible: issues?.responsible?.name,
            description: issues?.description,
            issueTags: issues?.issueTags.map((tag) => tag.name).join(', '),
            created_at: issues?.created_at ? dayjs(issues?.created_at).format('DD/MM/YYYY') : undefined,
            updated_at: issues?.updated_at ? dayjs(issues?.updated_at).format('DD/MM/YYYY') : undefined,
          })),
    [selectedRowKeys, issueData],
  );

  const exportHeaders = useMemo(
    () => [
      { label: 'ID', key: 'id' },
      { label: 'Problema', key: 'problem' },
      { label: 'Gravidade', key: 'priority' },
      { label: 'Versão', key: 'version' },
      { label: 'Status', key: 'status' },
      { label: 'Aprovado', key: 'approved' },
      { label: 'Autor', key: 'creator' },
      { label: 'Responsável', key: 'responsible' },
      { label: 'Descrição', key: 'description' },
      { label: 'Tags', key: 'issueTags' },
      { label: 'Criado em', key: 'created_at' },
      { label: 'Atualizado em', key: 'updated_at' },
    ],
    [],
  );

  useEffect(() => {
    const problemParam = searchParams.get('problem');
    const approvedParam = searchParams.get('approved');
    const statusParam = searchParams.getAll('status');
    const priorityParam = searchParams.getAll('priority');
    const creatorParam = searchParams.getAll('creator');
    const responsibleParam = searchParams.getAll('responsible');
    const experimentIdParam = searchParams.get('experiment_id');
    const versionParam = searchParams.get('version');

    const fieldsValues = {
      approved:
        // eslint-disable-next-line no-nested-ternary
        approvedParam && approvedParam === 'true'
          ? true
          : approvedParam && approvedParam === 'false'
          ? false
          : undefined,
      problem: problemParam || undefined,
      status: statusParam,
      priority: priorityParam.map((param) => parseInt(param, 10)),
      creator: creatorParam.map((el) => parseInt(el, 10)) || undefined,
      responsible: responsibleParam.map((el) => parseInt(el, 10)) || undefined,
      experimentId: experimentIdParam || undefined,
      version: versionParam || undefined,
    };
    setQueryParams((prev) => ({
      ...prev,
      approved: fieldsValues.approved,
      problem: fieldsValues.problem,
      status: fieldsValues.status,
      priority: fieldsValues.priority,
      creator: fieldsValues.creator,
      responsible: fieldsValues.responsible,
      experiment: fieldsValues.experimentId,
      version: fieldsValues.version,
    }));
    form.setFieldsValue(fieldsValues);
    dispatch(setIssueFilters(fieldsValues));
  }, []);

  useEffect(() => {
    const params = createSearchParams();

    if (problem) {
      params.append('problem', problem);
    }
    if (status && status.length > 0) {
      status.forEach((el) => params.append('status', el));
    }
    if (priority && priority.length > 0) {
      priority.forEach((el) => params.append('priority', el.toString(10)));
    }
    if (typeof approved !== 'undefined') {
      if (approved) {
        params.append('approved', 'true');
      } else {
        params.append('approved', 'false');
      }
    }
    if (creator?.length) {
      creator.forEach((el) => params.append('creator', el.toString(10)));
    }
    if (responsible?.length) {
      responsible.forEach((el) => params.append('responsible', el.toString(10)));
    }
    if (experimentId) {
      params.append('experiment_id', experimentId);
    }
    if (version) {
      params.append('version', version);
    }
    setSearchParams(params);
  }, [problem, status, priority, approved, creator, responsible, experimentId, version]);

  return (
    <SidebarWithHeader>
      <Row gutter={[16, 16]} className="h-full">
        {contextHolder}
        <Col lg={isCollapsible ? 0 : 6} sm={isCollapsible ? 0 : 24} xs={isCollapsible ? 0 : 24}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Typography.Title level={4}>Filtros</Typography.Title>
            </Col>
            <Col span={24}>
              <Card className="h-full">
                <Space direction="vertical" className="w-full mb-4">
                  <Button block onClick={handleUrgentCorrection}>
                    Correção Urgente
                  </Button>
                  <Button block onClick={handleCorrectionPending}>
                    Correção Pendente
                  </Button>
                  <Button block onClick={handlePendingApproval}>
                    Aprovação Pendente
                  </Button>
                </Space>
                <Form layout="vertical" form={form} onFinish={onFinish}>
                  <Form.Item label="Problema" name="problem">
                    <Input />
                  </Form.Item>
                  <Form.Item name="experimentId" label="Prática">
                    <Select
                      placeholder="Selecione uma Prática"
                      allowClear
                      showSearch
                      disabled={isExperimentsLoading}
                      options={experimentsOptions}
                      optionFilterProp="label"
                    />
                  </Form.Item>
                  <Form.Item label="Gravidade" name="priority">
                    <Select
                      mode="multiple"
                      allowClear
                      options={[
                        {
                          label: 'Baixa',
                          value: PRIORITY.LOW,
                        },
                        {
                          label: 'Normal',
                          value: PRIORITY.NORMAL,
                        },
                        {
                          label: 'Alta',
                          value: PRIORITY.HIGH,
                        },
                        {
                          label: 'Critica',
                          value: PRIORITY.CRITICAL,
                        },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item label="Status" name="status">
                    <Select
                      mode="multiple"
                      allowClear
                      optionFilterProp="label"
                      options={[
                        {
                          label: ISSUES_STATUS.NEW,
                          value: ISSUES_STATUS.NEW,
                        },
                        {
                          label: ISSUES_STATUS.IS_NOT_ERROR,
                          value: ISSUES_STATUS.IS_NOT_ERROR,
                        },
                        {
                          label: ISSUES_STATUS.DUPLICATE,
                          value: ISSUES_STATUS.DUPLICATE,
                        },
                        {
                          label: ISSUES_STATUS.NO_REMOVE,
                          value: ISSUES_STATUS.NO_REMOVE,
                        },
                        {
                          label: ISSUES_STATUS.RESOLVED,
                          value: ISSUES_STATUS.RESOLVED,
                        },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item label="Aprovado" name="approved">
                    <Radio.Group optionType="button" buttonStyle="solid">
                      <Radio value>Sim</Radio>
                      <Radio value={false}>Não</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item label="Autor" name="creator">
                    <Select
                      mode="multiple"
                      optionFilterProp="label"
                      maxTagCount="responsive"
                      loading={isUsersLoading}
                      allowClear
                      showSearch
                      options={usersOptions}
                    />
                  </Form.Item>
                  <Form.Item label="Responsável" name="responsible">
                    <Select
                      mode="multiple"
                      optionFilterProp="label"
                      maxTagCount="responsive"
                      loading={isUsersLoading}
                      allowClear
                      showSearch
                      options={usersOptions}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" block htmlType="submit">
                      Filtrar
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col lg={isCollapsible ? 24 : 18}>
          <Row gutter={[16, 16]}>
            <Col lg={8} sm={24} xs={24}>
              <Typography.Title level={4}>Problemas</Typography.Title>
            </Col>
            <Col lg={4} sm={12} xs={24}>
              <Button block icon={<ClearOutlined />} onClick={handleClear}>
                Limpar
              </Button>
            </Col>
            <Col lg={4} sm={12} xs={24}>
              <Button block icon={<FilterOutlined />} onClick={() => setIsCollapsible(!isCollapsible)}>
                Filtros
              </Button>
            </Col>
            <Col lg={4} sm={12} xs={24}>
              {isAllIssuesLoading ? (
                <Skeleton.Button active={isAllIssuesLoading} block />
              ) : (
                <CSVLink headers={exportHeaders} data={exportData} filename="issues-exported">
                  <Tooltip title="Exportar para CSV">
                    <Button block type="default" icon={<ExportOutlined />}>
                      {selectedRowKeys.length ? `Exportar ${selectedRowKeys.length}` : 'Exportar'}
                    </Button>
                  </Tooltip>
                </CSVLink>
              )}
            </Col>
            <Col lg={4} sm={12} xs={24}>
              <Tooltip title="Adicionar">
                <Button block type="primary" icon={<PlusOutlined />} onClick={create.onOpen}>
                  Adicionar
                </Button>
              </Tooltip>
            </Col>
            <Col span={24}>
              <Card>
                <Table
                  onChange={(pagination, filters, sorter) => {
                    handleTableChange(pagination, filters, sorter);
                  }}
                  loading={isAllIssuesLoading || isFetching}
                  className="w-full"
                  size="small"
                  dataSource={dataSource}
                  columns={columns}
                  rowSelection={rowSelection}
                  scroll={{ x: 1000, y: '72vh' }}
                  pagination={{
                    position: ['bottomCenter'],
                    defaultPageSize: 100,
                    pageSizeOptions: [100, 200, 500],
                    total: meta?.total,
                    current: meta?.current_page,
                    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} problemas`,
                  }}
                />
              </Card>
            </Col>
          </Row>
        </Col>
        <IssueEdit onClose={edit.onClose} isOpen={edit.isOpen} id={id} />
        <IssueCreate isOpen={create.isOpen} onClose={create.onClose} />
      </Row>
    </SidebarWithHeader>
  );
}
