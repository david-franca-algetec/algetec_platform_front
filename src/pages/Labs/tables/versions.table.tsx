import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  FileOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { nanoid } from '@reduxjs/toolkit';
import { Avatar, Button, Card, message, Modal, Popover, Space, Table, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Key } from 'antd/es/table/interface';
import { forEach, groupBy, orderBy } from 'lodash';

import { useCallback, useMemo, useState } from 'react';
import { BooleanField, DateField, TextField } from '../../../components';
import { useAppSelector } from '../../../config/hooks';
import { selectCurrentUser } from '../../../config/reducers/authSlice';
import { abbreviateSentence, compareVersions, handleError } from '../../../helpers';
import { completeVersion } from '../../../helpers/completeVersion';
import { sortByDate } from '../../../helpers/sortDate';
import { useDisclosure } from '../../../hooks/useDisclosure';
import { ExperimentRelease, ExperimentReleaseResponse } from '../../../services/experiments.service';
import { ReleaseType, useDeleteReleaseMutation } from '../../../services/releases.service';
import { EditRelease, handleTypes } from '../../Releases';

interface ReleaseTableProps {
  dataSource: ExperimentReleaseResponse[];
  loading: boolean;
}

interface DataType {
  key: Key;
  id: number;
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

export function ReleaseTable({ dataSource, loading }: ReleaseTableProps) {
  const user = useAppSelector(selectCurrentUser);
  const [toast, contextHolder] = message.useMessage();
  const [deleteRelease, { isLoading: isDeletingRelease }] = useDeleteReleaseMutation();
  const [selectedId, setSelectedId] = useState(0);
  const edit = useDisclosure();

  const { pendency } = useAppSelector((state) => state.version);

  const showDeleteConfirm = useCallback((release: DataType) => {
    confirm({
      title: `Deletar a versão ${release.version}?`,
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

  const data: DataType[] = useMemo(() => {
    // const filteredData: ExperimentReleaseResponse[] = [];
    const filteredById: ExperimentReleaseResponse[] = [];

    // if (pendency) {
    //   [...dataSource]
    //     .sort((a, b) => compareVersions(a.version, b.version))
    //     .reverse()
    //     .forEach((filter) => {
    //       const find = filteredData.find(
    //         (r) =>
    //           r.experiment_id === filter.experiment_id &&
    //           r.releaseType.name === filter.releaseType.name &&
    //           compareVersions(r.version, filter.version) === 1,
    //       );
    //       if (!find) {
    //         filteredData.push(filter);
    //       }
    //     });

    //   switch (pendency) {
    //     case 'id_0':
    //       filteredById.push(
    //         ...filteredData
    //           .filter((r) => {
    //             const types = r.releaseType.name.toLowerCase();
    //             return types === 'trilha português' || types === 'build android' || types === 'build webgl';
    //           })
    //           .filter((data) => !data.id_0),
    //       );

    //       break;
    //     case 'id_5000':
    //       filteredById.push(
    //         ...filteredData
    //           .filter((r) => {
    //             const types = r.releaseType.name.toLowerCase();
    //             return (
    //               types === 'trilha português' ||
    //               types === 'trilha espanhol' ||
    //               types === 'build android' ||
    //               types === 'build webgl'
    //             );
    //           })
    //           .filter((data) => !data.id_5000),
    //       );

    //       break;
    //     case 'id_6000':
    //       filteredById.push(
    //         ...filteredData
    //           .filter((r) => {
    //             const types = r.releaseType.name.toLowerCase();
    //             return types === 'trilha inglês' || types === 'build android' || types === 'build webgl';
    //           })
    //           .filter((data) => !data.id_6000),
    //       );
    //       break;
    //     case 'play_store':
    //       filteredById.push(
    //         ...filteredData
    //           .filter((r) => {
    //             const types = r.releaseType.name.toLowerCase();
    //             return types === 'build android';
    //           })
    //           .filter((data) => !data.play_store),
    //       );
    //       break;
    //     case 'languages':
    //       filteredById.push(
    //         ...filteredData
    //           .filter((r) => {
    //             const types = r.releaseType.name.toLowerCase();
    //             return (
    //               types === 'revisão de conteúdo inglês' ||
    //               types === 'revisão de conteúdo espanhol' ||
    //               types === 'planilha de tradução' ||
    //               types === 'csv inglês' ||
    //               types === 'csv espanhol' ||
    //               types === 'csv português'
    //             );
    //           })
    //           .filter((data) => !data.languages),
    //       );
    //       break;
    //     case 'platform_a':
    //       filteredById.push(
    //         ...filteredData
    //           .filter((r) => {
    //             const types = r.releaseType.name.toLowerCase();
    //             return (
    //               types === 'build android' ||
    //               types === 'build webgl' ||
    //               types === 'trilha português' ||
    //               types === 'trilha espanhol'
    //             );
    //           })
    //           .filter((data) => !data.platform_a),
    //       );
    //       break;

    //     default:
    //       filteredById.push(...dataSource);
    //       break;
    //   }
    // } else {
    //   filteredById.push(...dataSource);
    // }
    filteredById.push(...dataSource);
    const newReleases: ExperimentRelease[] = [];

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
  }, [dataSource, pendency]);

  const columns: ColumnsType<DataType> = [
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (values: DataType['type']) => (
        <Avatar.Group maxCount={values.length <= 3 ? 3 : 2}>
          {values.map((type) => (
            <Tooltip title={type.name}>
              <Avatar style={{ backgroundColor: type.color }} key={nanoid()}>
                {abbreviateSentence(type.name)}
              </Avatar>
            </Tooltip>
          ))}
        </Avatar.Group>
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
      title: 'Autor',
      dataIndex: ['author'],
      width: 100,
      ellipsis: true,
      sorter: {
        compare: (a, b) => a.author.localeCompare(b.author),
      },
      render: (value) => <TextField value={value} />,
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

  return (
    <>
      {contextHolder}
      <Table
        loading={loading}
        className="w-full"
        size="small"
        dataSource={data}
        columns={columns}
        scroll={{ x: 1000, y: '72vh' }}
        pagination={{
          position: ['bottomCenter'],
          defaultPageSize: 100,
          pageSizeOptions: [100, 200, 500],
          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} versões`,
        }}
      />
      <EditRelease id={selectedId} onClose={edit.onClose} open={edit.isOpen} />
    </>
  );
}
