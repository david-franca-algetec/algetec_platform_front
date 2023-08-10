import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  ExportOutlined,
  FileOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Grid, message, Modal, Popover, Row, Select, Space, Table, Tooltip, Typography } from 'antd';

import type { ColumnsType, Key, TableRowSelection } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import { forEach, groupBy, orderBy } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { BooleanField, DateField, SearchColumn, SidebarWithHeader, TagField, TextField } from '../../components';
import { UrlField } from '../../components/fields/url';
import { useAppDispatch, useAppSelector } from '../../config/hooks';
import { setVersionFilters } from '../../config/reducers/versionSlice';
import { compareVersions, handleError } from '../../helpers';
import { completeVersion } from '../../helpers/completeVersion';
import { sortByDate } from '../../helpers/sortDate';
import { useDisclosure } from '../../hooks/useDisclosure';
import {
  Release,
  ReleaseResponse,
  ReleaseType,
  useDeleteReleaseMutation,
  useGetReleasesQuery,
} from '../../services/releases.service';
import { CreateRelease } from './create';
import { CreateTag } from './CreateTag';
import { EditRelease } from './edit';

interface DataType {
  key: Key;
  id: number;
  name: string;
  type: {
    name: string;
    id: number;
    color?: string;
  }[];
  version: string;
  created_at: string;
  author: string;
  id_0: boolean;
  id_5000: boolean;
  id_6000: boolean;
  play_store: boolean;
  languages: boolean;
  experiment_id: number;
  platform_a: boolean;
  description: string;
}

const { confirm } = Modal;
const { useBreakpoint } = Grid;

export const handleTypes = (types: DataType['type'], value: string, index: string) => {
  if (index === 'id_0') {
    const tags = ['build android', 'build webgl', 'trilha português'];
    const hasType = types.map((type) => tags.includes(type.name.toLowerCase()));
    return hasType.includes(true);
  }
  if (index === 'id_5000') {
    const tags = ['build android', 'build webgl', 'trilha espanhol'];
    const hasType = types.map((type) => tags.includes(type.name.toLowerCase()));
    return hasType.includes(true);
  }
  if (index === 'id_6000') {
    const tags = ['build android', 'build webgl', 'trilha inglês'];
    const hasType = types.map((type) => tags.includes(type.name.toLowerCase()));
    return hasType.includes(true);
  }
  if (index === 'play_store') {
    const tags = ['build android'];
    const hasType = types.map((type) => tags.includes(type.name.toLowerCase()));
    return hasType.includes(true);
  }
  if (index === 'languages') {
    const tags = [
      'csv espanhol',
      'csv inglês',
      'csv português',
      'planilha de tradução',
      'revisão de conteúdo espanhol',
      'revisão de conteúdo inglês',
    ];
    const hasType = types.map((type) => tags.includes(type.name.toLowerCase()));
    return hasType.includes(true);
  }
  if (index === 'platform_a') {
    const tags = ['build android', 'build webgl', 'trilha português', 'trilha inglês', 'trilha espanhol'];
    const hasType = types.map((type) => tags.includes(type.name.toLowerCase()));
    return hasType.includes(true);
  }
  return false;
};

export function ListReleases() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAppSelector((state) => state.auth);
  const { author, id, name, pendency } = useAppSelector((state) => state.version);
  const dispatch = useAppDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedId, setSelectedId] = useState(0);
  const create = useDisclosure();
  const edit = useDisclosure();
  const tag = useDisclosure();
  const { data: releasesData, isLoading: isReleasesLoading } = useGetReleasesQuery();
  const [deleteRelease, { isLoading: isDeletingRelease }] = useDeleteReleaseMutation();
  const [toast, contextHolder] = message.useMessage();
  const releases = useMemo(() => releasesData || [], [releasesData]);
  const screenSize = useBreakpoint();

  const showDeleteConfirm = useCallback((release: DataType) => {
    confirm({
      title: `Deletar a versão ${release.version} de ${release.name}?`,
      icon: <ExclamationCircleFilled />,
      content: 'Essa ação não pode ser desfeita!',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deleteRelease(release.id)
          .unwrap()
          .then(() => toast.success(`A versão ${release.version} foi deletada com sucesso.`))
          .catch((error) => (error && 'data' in error ? toast.error(handleError(error)) : null));
      },
      okButtonProps: {
        loading: isDeletingRelease,
      },
      maskStyle: {
        backdropFilter: 'blur(8px)',
      },
    });
  }, []);

  const onFilters = (name: string, value: string) => {
    dispatch(setVersionFilters({ name, value }));
  };

  const columns: ColumnsType<DataType> = [
    {
      ...SearchColumn({
        index: 'experiment_id',
        title: 'ID',
        onSearch(value) {
          onFilters('id', value);
        },
        dataValue: id,
      }),
      defaultFilteredValue: id ? [id] : [],
      title: 'ID',
      dataIndex: 'experiment_id',
      key: 'experiment_id',
      width: 100,
      fixed: 'left',
      sorter: {
        compare: (a, b) => a.experiment_id - b.experiment_id,
      },
      render: (value: number) => <UrlField value={value.toString()} href={`/labs/show/${value}`} target="_blank" />,
    },
    {
      defaultFilteredValue: name ? [name] : [],
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      fixed: 'left',
      ellipsis: true,
      sorter: {
        compare: (a, b) => a.name.localeCompare(b.name),
      },
      render: (value) => <TextField value={value} />,
      ...SearchColumn({
        index: 'name',
        title: 'Nome',
        includes: true,
        onSearch(value) {
          onFilters('name', value);
        },
        dataValue: name,
      }),
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      width: 190,
      render: (types: DataType['type']) => (
        // <Avatar.Group maxCount={types.length <= 3 ? 3 : 2}>
        //   {types.map((type) => (
        //     <Tooltip title={type.name}>
        //       <Avatar style={{ backgroundColor: type.color }} key={nanoid()}>
        //         {abbreviateSentence(type.name)}
        //       </Avatar>
        //     </Tooltip>
        //   ))}
        // </Avatar.Group>
        <Space direction="vertical">
          {types.map((type) => (
            <TagField value={type.name} color={type.color} />
          ))}
        </Space>
      ),
    },
    {
      title: 'Versão',
      dataIndex: 'version',
      key: 'version',
      width: 100,
      sorter: {
        compare: (a, b) => compareVersions(a.version, b.version),
      },
      render: (value) => <TextField value={value} />,
    },
    {
      title: 'Data',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 100,
      render: (value) => <DateField value={value} />,
      sorter: {
        compare: (a, b) => sortByDate(a.created_at, b.created_at),
      },
    },
    {
      defaultFilteredValue: author ? [author] : [],
      title: 'Autor',
      dataIndex: 'author',
      key: 'author',
      width: 100,
      ellipsis: true,
      sorter: {
        compare: (a, b) => a.author.localeCompare(b.author),
      },
      render: (value) => <TextField value={value} />,
      ...SearchColumn({
        index: 'author',
        title: 'Autor',
        includes: true,
        onSearch(value) {
          onFilters('author', value);
        },
        dataValue: author,
      }),
    },
    {
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
      title: (
        <Space>
          ID +0
          <Popover
            content={
              <Card title="Acesso dos laboratórios em português" style={{ width: 400 }}>
                Exibe somente itens do tipo trilha português, build Android e build WebGL cuja versão mais recente
                destes tipos não está VERDADEIRO no campo ID +0. Isso significa que ao usar esse filtro, será mostrado
                em quais IDs as builds webGL estão desatualizadas ou está faltando atualizar a página para abrir a
                versão Android no celular ou a trilha está desatualizada (houve mudança do roteiro, sumário, testes,
                etc) nos IDs com UALABS em português.
              </Card>
            }
          >
            <InfoCircleOutlined style={{ cursor: 'pointer' }} />
          </Popover>
        </Space>
      ),
      dataIndex: 'id_0',
      key: 'id_0',
      align: 'center',
      width: 100,
      render: (value, record) => (handleTypes(record.type, value, 'id_0') ? <BooleanField value={value} /> : '—'),
    },
    {
      title: (
        <Space>
          ID +5000
          <Popover
            content={
              <Card title="Acesso dos laboratórios em espanhol" style={{ width: 400 }}>
                <Typography.Text>
                  Exibe somente itens do tipo trilha espanhol, build Android e build WebGL cuja versão mais recente
                  destes tipos <Typography.Text strong>não está VERDADEIRO</Typography.Text> no campo ID +5000. Isso
                  significa que ao usar esse filtro, será mostrado em quais IDs as builds webGL estão desatualizadas ou
                  está faltando atualizar a página para abrir a versão Android no celular ou a trilha está desatualizada
                  (houve mudança do roteiro, sumário, testes, etc) nos IDs com UALABS em espanhol.
                </Typography.Text>
              </Card>
            }
          >
            <InfoCircleOutlined style={{ cursor: 'pointer' }} />
          </Popover>
        </Space>
      ),
      dataIndex: 'id_5000',
      key: 'id_5000',
      align: 'center',
      width: 120,
      render: (value, record) => (handleTypes(record.type, value, 'id_5000') ? <BooleanField value={value} /> : '—'),
    },
    {
      title: (
        <Space>
          ID +10000
          <Popover
            content={
              <Card title="Acesso dos laboratórios em inglês" style={{ width: 400 }}>
                Exibe somente itens do tipo trilha inglês, build Android e build WebGL cuja versão mais recente destes
                tipos não está VERDADEIRO no campo ID +10000. Isso significa que ao usar esse filtro, será mostrado em
                quais IDs as builds webGL estão desatualizadas ou está faltando atualizar a página para abrir a versão
                Android no celular ou a trilha está desatualizada (houve mudança do roteiro, sumário, testes, etc) nos
                IDs com UALABS em inglês.
              </Card>
            }
          >
            <InfoCircleOutlined style={{ cursor: 'pointer' }} />
          </Popover>
        </Space>
      ),
      dataIndex: 'id_6000',
      key: 'id_6000',
      align: 'center',
      width: 120,
      render: (value, record) => (handleTypes(record.type, value, 'id_6000') ? <BooleanField value={value} /> : '—'),
    },
    {
      title: (
        <Space>
          Play Store
          <Popover
            content={
              <Card title="Versão para Android" style={{ width: 400 }}>
                Exibe somente itens do tipo build Android cuja versão mais recente deste tipo não está VERDADEIRO no
                campo Play Store. Isso significa que ao usar esse filtro, será mostrado em quais IDs as builds Android
                estão desatualizadas na Play Store.
              </Card>
            }
          >
            <InfoCircleOutlined style={{ cursor: 'pointer' }} />
          </Popover>
        </Space>
      ),
      dataIndex: 'play_store',
      key: 'play_store',
      align: 'center',
      width: 120,
      render: (value, record) => (handleTypes(record.type, value, 'play_store') ? <BooleanField value={value} /> : '—'),
    },
    {
      title: (
        <Space>
          Linguagens
          <Popover
            content={
              <Card title="Arquivos de tradução" style={{ width: 400 }}>
                Exibe somente itens do tipo revisão de conteúdo inglês, revisão de conteúdo espanhol, planilha de
                tradução, CSV português. CSV inglês, CSV espanhol. Isso significa que ao usar esse filtro, será mostrado
                quais IDs estão com alguma pendência para nesses itens (revisão pendente, planilha não traduzida, CSVs
                não colocados online).
              </Card>
            }
          >
            <InfoCircleOutlined style={{ cursor: 'pointer' }} />
          </Popover>
        </Space>
      ),
      dataIndex: 'languages',
      key: 'languages',
      align: 'center',
      width: 120,
      render: (value, record) => (handleTypes(record.type, value, 'languages') ? <BooleanField value={value} /> : '—'),
    },
    {
      title: (
        <Space>
          Plataforma A
          <Popover
            content={
              <Card title="Acesso via Sagah 2.0" style={{ width: 400 }}>
                Exibe somente itens do tipo build Android e build WebGL cuja versão mais recente destes tipos não está
                VERDADEIRO na versão 2.0 na Plataforma A. Isso significa que ao usar esse filtro, será mostrado em quais
                IDs as builds WebGL estão desatualizadas ou está faltando atualizar a página para abrir a versão Android
                no celular.
              </Card>
            }
          >
            <InfoCircleOutlined style={{ cursor: 'pointer' }} />
          </Popover>
        </Space>
      ),
      dataIndex: 'platform_a',
      key: 'platform_a',
      align: 'center',
      width: 140,
      render: (value, record) => (handleTypes(record.type, value, 'platform_a') ? <BooleanField value={value} /> : '—'),
    },
    user?.role.admin
      ? {
          title: 'Ações',
          key: 'actions',
          width: 100,
          fixed: 'right',
          align: 'center',
          dataIndex: 'actions',
          render: (_, record) => (
            <Space>
              <Tooltip title="Editar">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  style={{
                    display: user?.role.admin || user?.role.demands_leader ? 'inline' : 'none',
                  }}
                  onClick={() => {
                    setSelectedId(record.id);
                    edit.onOpen();
                  }}
                />
              </Tooltip>
              {user.role.super_admin ? (
                <Tooltip title="Excluir">
                  <Button
                    danger
                    type="primary"
                    icon={<DeleteOutlined />}
                    style={{
                      display: user?.role.super_admin ? 'inline' : 'none',
                    }}
                    onClick={() => {
                      showDeleteConfirm(record);
                    }}
                  />
                </Tooltip>
              ) : null}
            </Space>
          ),
        }
      : {},
  ];

  const data: DataType[] = useMemo(() => {
    const filteredData: ReleaseResponse[] = [];
    const filteredById: ReleaseResponse[] = [];

    if (pendency) {
      [...releases]
        .sort((a, b) => compareVersions(a.version, b.version))
        .reverse()
        .forEach((filter) => {
          const find = filteredData.find(
            (r) =>
              r.experiment_id === filter.experiment_id &&
              r.releaseType.name === filter.releaseType.name &&
              compareVersions(r.version, filter.version) === 1,
          );
          if (!find) {
            filteredData.push(filter);
          }
        });

      switch (pendency) {
        case 'id_0':
          filteredById.push(
            ...filteredData
              .filter((r) => {
                const types = r.releaseType.name.toLowerCase();
                return types === 'trilha português' || types === 'build android' || types === 'build webgl';
              })
              .filter((data) => !data.id_0),
          );

          break;
        case 'id_5000':
          filteredById.push(
            ...filteredData
              .filter((r) => {
                const types = r.releaseType.name.toLowerCase();
                return (
                  types === 'trilha português' ||
                  types === 'trilha espanhol' ||
                  types === 'build android' ||
                  types === 'build webgl'
                );
              })
              .filter((data) => !data.id_5000),
          );

          break;
        case 'id_6000':
          filteredById.push(
            ...filteredData
              .filter((r) => {
                const types = r.releaseType.name.toLowerCase();
                return types === 'trilha inglês' || types === 'build android' || types === 'build webgl';
              })
              .filter((data) => !data.id_6000),
          );
          break;
        case 'play_store':
          filteredById.push(
            ...filteredData
              .filter((r) => {
                const types = r.releaseType.name.toLowerCase();
                return types === 'build android';
              })
              .filter((data) => !data.play_store),
          );
          break;
        case 'languages':
          filteredById.push(
            ...filteredData
              .filter((r) => {
                const types = r.releaseType.name.toLowerCase();
                return (
                  types === 'revisão de conteúdo inglês' ||
                  types === 'revisão de conteúdo espanhol' ||
                  types === 'planilha de tradução' ||
                  types === 'csv inglês' ||
                  types === 'csv espanhol' ||
                  types === 'csv português'
                );
              })
              .filter((data) => !data.languages),
          );
          break;
        case 'platform_a':
          filteredById.push(
            ...filteredData
              .filter((r) => {
                const types = r.releaseType.name.toLowerCase();
                return (
                  types === 'build android' ||
                  types === 'build webgl' ||
                  types === 'trilha português' ||
                  types === 'trilha espanhol'
                );
              })
              .filter((data) => !data.platform_a),
          );
          break;

        default:
          filteredById.push(...releases);
          break;
      }
    } else {
      filteredById.push(...releases);
    }
    const newReleases: Release[] = [];

    forEach(groupBy(filteredById, 'id'), (data) => {
      const releaseType: ReleaseType[] = [];
      data.forEach((el) => releaseType.push(el.releaseType));
      newReleases.push({ ...data[0], releaseType });
    });

    return orderBy(
      newReleases.map((i) => ({
        key: i.id,
        id: i.id,
        experiment_id: i.experiment_id,
        name: i.experiment.name,
        type: i.releaseType,
        version: completeVersion(i.version),
        created_at: i.created_at,
        author: i.author.name,
        id_0: i.id_0,
        id_5000: i.id_5000,
        id_6000: i.id_6000,
        play_store: i.play_store,
        languages: i.languages,
        platform_a: i.platform_a,
        description: i.description,
      })),
      'created_at',
      'desc',
    );
  }, [releases, pendency]);

  const onSelectChange = useCallback((newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  }, []);

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const exportData = useMemo(() => {
    const newReleases: Release[] = [];
    forEach(groupBy(releases, 'id'), (data) => {
      const releaseType: ReleaseType[] = [];
      data.forEach((el) => releaseType.push(el.releaseType));
      newReleases.push({ ...data[0], releaseType });
    });
    if (selectedRowKeys.length > 0) {
      return selectedRowKeys.map((key) => {
        const release = newReleases.find((i) => i.id === key);

        return {
          id: release?.experiment_id,
          name: release?.experiment.name,
          type: release?.releaseType.map((type) => type.name).join(', '),
          version: completeVersion(release?.version || ''),
          author: release?.author.name,
          created_at: dayjs(release?.created_at).format('L'),
          description: release?.description,
          id_0: release?.id_0,
          id_5000: release?.id_5000,
          id_6000: release?.id_6000,
          play_store: release?.play_store,
          languages: release?.languages,
          platform_a: release?.platform_a,
        };
      });
    }
    return newReleases.map((release) => ({
      id: release.id,
      name: release.experiment.name,
      type: release.releaseType.map((type) => type.name).join(', '),
      version: completeVersion(release.version),
      author: release.author.name,
      created_at: dayjs(release.created_at).format('L'),
      description: release.description,
      id_0: release.id_0,
      id_5000: release.id_5000,
      id_6000: release.id_6000,
      play_store: release.play_store,
      languages: release.languages,
      platform_a: release.platform_a,
    }));
  }, [releases, selectedRowKeys]);

  const exportHeaders = useMemo(
    () => [
      { label: 'ID', key: 'id' },
      { label: 'Nome', key: 'name' },
      { label: 'Tipo', key: 'type' },
      { label: 'Versão', key: 'version' },
      { label: 'Autor', key: 'author' },
      { label: 'Data', key: 'created_at' },
      { label: 'Descrição', key: 'description' },
      { label: 'ID +0', key: 'id_0' },
      { label: 'ID +5000', key: 'id_5000' },
      { label: 'ID +10000', key: 'id_6000' },
      { label: 'Play Store', key: 'play_store' },
      { label: 'Linguagens', key: 'languages' },
      { label: 'Plataforma A', key: 'platform_a' },
    ],
    [],
  );

  const menuItems = [
    {
      value: 'id_0',
      label: 'ID +0',
    },
    {
      value: 'id_5000',
      label: 'ID +5000',
    },
    {
      value: 'id_6000',
      label: 'ID +10000',
    },
    {
      value: 'play_store',
      label: 'Play Store',
    },
    {
      value: 'languages',
      label: 'Linguagens',
    },
    {
      value: 'platform_a',
      label: 'Plataforma A',
    },
  ];

  const handleSelectPendency = (e: string) => {
    onFilters('pendency', e);
  };

  useEffect(() => {
    if (!edit.isOpen) {
      setSelectedId(0);
    }
  }, [edit.isOpen]);

  useEffect(() => {
    const params = createSearchParams();
    if (author) {
      params.append('author', author);
    }
    if (id) {
      params.append('id', id);
    }
    if (name) {
      params.append('name', name);
    }
    if (pendency) {
      params.append('pendency', pendency);
    }

    setSearchParams(params);
  }, [author, id, name, pendency]);

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam) {
      onFilters('id', idParam);
    }
    const nameParam = searchParams.get('name');
    if (nameParam) {
      onFilters('name', nameParam);
    }
    const authorParam = searchParams.get('author');
    if (authorParam) {
      onFilters('author', authorParam);
    }
    const pendencyParam = searchParams.get('pendency');
    if (pendencyParam) {
      onFilters('pendency', pendencyParam);
    }
  }, []);

  return (
    <SidebarWithHeader>
      <Row gutter={[16, 16]}>
        <Col offset={screenSize.lg ? 10 : undefined} lg={4} md={12} sm={12} xs={24}>
          <Select
            className="w-full"
            options={menuItems}
            placeholder="Pendências"
            allowClear
            value={pendency}
            onChange={handleSelectPendency}
          />
        </Col>
        <Col lg={3} md={12} sm={12} xs={24}>
          <CSVLink headers={exportHeaders} data={exportData} filename="versions-exported">
            <Tooltip title="Exportar para CSV">
              <Button block type="default" icon={<ExportOutlined />}>
                Exportar
              </Button>
            </Tooltip>
          </CSVLink>
        </Col>
        <Col lg={4} md={12} sm={12} xs={24}>
          <Tooltip title="Adicionar Lançamento">
            <Button
              block
              type="primary"
              icon={<PlusOutlined />}
              style={{
                display: user?.role.releases ? 'inline' : 'none',
              }}
              onClick={() => {
                create.onOpen();
              }}
            >
              Lançamento
            </Button>
          </Tooltip>
        </Col>
        <Col lg={3} md={12} sm={12} xs={24}>
          <Tooltip title="Adicionar Tipo">
            <Button
              block
              type="primary"
              icon={<PlusOutlined />}
              style={{
                display: user?.role.admin ? 'inline' : 'none',
              }}
              onClick={() => {
                tag.onOpen();
              }}
            >
              Tipo
            </Button>
          </Tooltip>
        </Col>
        <Col span={24}>
          <Card>
            {contextHolder}
            <Table
              loading={isReleasesLoading}
              size="small"
              style={{ width: '100%' }}
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
                showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} versões`,
              }}
              rowSelection={rowSelection}
            />
            <CreateRelease onClose={create.onClose} open={create.isOpen} />
            <EditRelease id={selectedId} onClose={edit.onClose} open={edit.isOpen} />
            <CreateTag onClose={tag.onClose} open={tag.isOpen} />
          </Card>
        </Col>
      </Row>
    </SidebarWithHeader>
  );
}
