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
import { orderBy } from 'lodash';
import React, { useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useNavigate } from 'react-router-dom';
import { ScrollArea, SearchColumn, TagField, TextField } from '../../../components';
import { getUniqueColor, handleError, handleStringDate } from '../../../helpers';
import { useDisclosure } from '../../../hooks/useDisclosure';
import { useAllSkillsQuery, useDeleteSkillMutation } from '../../../services/skill.service';
import { SkillsCreate } from '../create/skills.create';
import SkillEdit from '../edit/skill.edit';

interface Practice {
  name: string;
  experimentId: number;
  code: string;
}

interface DataType {
  key: Key;
  id: number;
  code: string;
  description: string;
  notes: string;
  competenceCode: string;
  competenceDescription: string;
  competenceAreaName: string;
  competenceCurriculumName: string;
  objects: string[];
  practices: Practice[];
  createdAt: string;
  updatedAt: string;
  unites: string[];
}

const { confirm } = Modal;

export function SkillsTable() {
  const navigate = useNavigate();
  const [toast, contextHolder] = message.useMessage();
  const [id, setId] = useState<number>();
  const createCurriculum = useDisclosure();
  const editCurriculum = useDisclosure();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const { data: skills, isLoading: isLoadingSkills } = useAllSkillsQuery();
  const [deleteSkill, { isLoading: isDeletingSkill }] = useDeleteSkillMutation();

  const showDeleteConfirm = (id: number): void => {
    const problemName = skills?.find((i) => i.id === id)?.code;
    confirm({
      title: `Deletar a habilidade ${problemName}?`,
      icon: <ExclamationCircleFilled />,
      content: 'Essa ação não pode ser desfeita!',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deleteSkill(id)
          .unwrap()
          .then(() => toast.success(`A habilidade ${problemName} foi deletado com sucesso.`))
          .catch((error) => (error && 'data' in error ? toast.error(handleError(error)) : null));
      },
      okButtonProps: {
        loading: isDeletingSkill,
      },
      maskStyle: {
        backdropFilter: 'blur(8px)',
      },
    });
  };
  const dataSource = useMemo<DataType[]>(
    () =>
      skills
        ? orderBy(skills, 'code', 'asc').map((skill) => ({
            key: skill.id,
            id: skill.id,
            code: skill.code,
            description: skill.description,
            notes: skill.notes,
            competenceCode: skill.competence.code,
            competenceDescription: skill.competence.description,
            competenceAreaName: skill.competence.competence_area.name,
            competenceCurriculumName: skill.competence.curriculum.name,
            objects: skill.objects.map((object) => object.name),
            practices: skill.practices.map((practice) => ({
              name: practice.name,
              experimentId: practice.experiment_id,
              code: practice.code,
            })),
            unites: skill.unities.map((unit) => unit.name),
            createdAt: skill.created_at,
            updatedAt: skill.updated_at,
          }))
        : [],
    [skills],
  );

  const [currentSource, setCurrentSource] = useState<DataType[]>(dataSource);

  const columns: ColumnsType<DataType> = [
    {
      ...SearchColumn({
        index: 'competenceCurriculumName',
        title: 'Currículo',
        includes: true,
      }),
      title: 'Currículo',
      dataIndex: 'competenceCurriculumName',
      key: 'competenceCurriculumName',
      showSorterTooltip: false,
      align: 'center',
      width: 150,
      sorter: {
        compare: (a, b) => a.competenceCurriculumName.localeCompare(b.competenceCurriculumName),
      },
      render: (value) => <TextField value={value} ellipsis />,
    },
    {
      ...SearchColumn({
        index: 'competenceAreaName',
        title: 'Área de Competência',
        includes: true,
      }),
      title: 'Área da Competência',
      dataIndex: 'competenceAreaName',
      key: 'competenceAreaName',
      showSorterTooltip: false,
      align: 'center',
      width: 150,
      render: (value) =>
        value ? (
          <Popover
            content={
              <ScrollArea width={300} height="100%" maxHeight={300}>
                {value}
              </ScrollArea>
            }
          >
            <FileTextOutlined />
          </Popover>
        ) : (
          <FileOutlined />
        ),
    },
    {
      ...SearchColumn({
        index: 'competenceCode',
        title: 'Código Competência',
        includes: true,
      }),
      title: 'Cód Competência',
      dataIndex: 'competenceCode',
      key: 'competenceCode',
      showSorterTooltip: false,
      align: 'center',
      width: 180,
      sorter: {
        compare: (a, b) => a.competenceCode.localeCompare(b.competenceCode),
      },
      render: (value) => <TextField value={value} />,
    },
    {
      ...SearchColumn({
        index: 'competenceDescription',
        title: 'Desc Competência',
        includes: true,
      }),
      title: 'Desc Competência',
      dataIndex: 'competenceDescription',
      key: 'competenceDescription',
      align: 'center',
      width: 150,
      render: (value) =>
        value ? (
          <Popover
            content={
              <ScrollArea width={300} height="100%" maxHeight={300}>
                {value}
              </ScrollArea>
            }
          >
            <FileTextOutlined />
          </Popover>
        ) : (
          <FileOutlined />
        ),
    },
    {
      ...SearchColumn({
        index: 'code',
        title: 'Código Hab',
        includes: true,
      }),
      title: 'Cód Hab',
      dataIndex: 'code',
      key: 'code',
      showSorterTooltip: false,
      width: 120,
      align: 'center',
      sorter: {
        compare: (a, b) => a.code.localeCompare(b.code),
      },
      render: (value) => <TextField value={value} />,
    },
    {
      ...SearchColumn({
        index: 'description',
        title: 'Desc Hab',
        includes: true,
      }),
      title: 'Desc Hab',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
      width: 110,
      render: (value) =>
        value ? (
          <Popover
            content={
              <ScrollArea width={300} height="100%" maxHeight={300}>
                {value}
              </ScrollArea>
            }
          >
            <FileTextOutlined />
          </Popover>
        ) : (
          <FileOutlined />
        ),
    },
    {
      title: 'Obj Conhecimento',
      dataIndex: 'objects',
      key: 'objects',
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
      title: 'Unidade Temática',
      dataIndex: 'unites',
      key: 'unites',
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
      ...SearchColumn({
        index: 'notes',
        title: 'Notas',
        includes: true,
      }),
      title: 'Notas',
      dataIndex: 'notes',
      key: 'notes',
      align: 'center',
      width: 80,
      render: (value) =>
        value ? (
          <Popover
            content={
              <ScrollArea width={300} height="100%" maxHeight={300}>
                {value}
              </ScrollArea>
            }
          >
            <FileTextOutlined />
          </Popover>
        ) : (
          <FileOutlined />
        ),
    },
    {
      title: 'Práticas',
      dataIndex: 'practices',
      key: 'practices',
      showSorterTooltip: false,
      align: 'center',
      width: 100,
      render: (values: Practice[]) =>
        values.length ? (
          <Popover
            content={
              <List
                dataSource={values}
                renderItem={(item) => <List.Item>{`${item.code} | ID: ${item.experimentId} | ${item.name}`}</List.Item>}
              />
            }
          >
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
          <Button icon={<EyeOutlined />} onClick={() => navigate(`/curriculums/skills/show/${record.id}`)} />
          <Tooltip title="Editar">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setId(record.id);
                editCurriculum.onOpen();
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

  const exportHeaders = useMemo(
    () => [
      { label: 'Código da Habilidade', key: 'code' },
      { label: 'Descrição da Habilidade', key: 'description' },
      { label: 'Notas', key: 'notes' },
      { label: 'Código da Competência', key: 'competenceCode' },
      { label: 'Descrição da Competência', key: 'competenceDescription' },
      { label: 'Nome da Área de Competência', key: 'competenceAreaName' },
      { label: 'Nome do Currículo', key: 'competenceCurriculumName' },
      { label: 'Objetos de Competência', key: 'objects' },
      { label: 'Práticas', key: 'practices' },
      { label: 'Unidade Temática', key: 'unites' },
      { label: 'Criado em', key: 'createdAt' },
      { label: 'Atualizado em', key: 'updatedAt' },
    ],
    [],
  );

  const exportData = useMemo(
    () =>
      selectedRowKeys.length
        ? selectedRowKeys.map((key) => {
            const skill = skills?.find((el) => el.id === key);

            return {
              code: skill?.code.trim(),
              description: skill?.description.trim(),
              notes: skill?.notes.trim(),
              competenceCode: skill?.competence.code.trim(),
              competenceDescription: skill?.competence.description.trim(),
              competenceAreaName: skill?.competence.competence_area.name.trim(),
              competenceCurriculumName: skill?.competence.curriculum.name.trim(),
              objects: skill?.objects.map((el) => el.name.trim()).join(', '),
              practices: skill?.practices
                .map((el) => `${el.code} | ${el.experiment_id} | ${el.name}`)
                .map((el) => el.trim())
                .join(', '),
              unites: skill?.unities.map((el) => el.name).join(', '),
              createdAt: handleStringDate(skill?.created_at),
              updatedAt: handleStringDate(skill?.updated_at),
            };
          })
        : dataSource?.map((skill) => ({
            code: skill.code,
            description: skill.description,
            notes: skill.notes,
            competenceCode: skill.competenceCode,
            competenceDescription: skill.competenceDescription,
            competenceAreaName: skill.competenceAreaName,
            competenceCurriculumName: skill.competenceCurriculumName,
            objects: skill.objects.join(', '),
            practices: skill.practices.map((el) => `${el.code} | ${el.experimentId} | ${el.name}`).join(', '),
            unites: skill.unites.join(', '),
            createdAt: handleStringDate(skill.createdAt),
            updatedAt: handleStringDate(skill.updatedAt),
          })),
    [dataSource, selectedRowKeys, skills],
  );

  return (
    <Row gutter={[16, 16]}>
      {contextHolder}
      <Col offset={18} lg={3} sm={12} xs={24}>
        <CSVLink headers={exportHeaders} data={exportData} filename="skills-exported">
          <Tooltip title="Exportar para CSV">
            <Button block type="default" icon={<ExportOutlined />}>
              Exportar
            </Button>
          </Tooltip>
        </CSVLink>
      </Col>
      <Col lg={3} sm={12} xs={24}>
        <Button block type="primary" icon={<PlusOutlined />} onClick={createCurriculum.onOpen}>
          Adicionar
        </Button>
      </Col>
      <Col span={24}>
        <Table
          className="w-full"
          loading={isLoadingSkills}
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
            defaultPageSize: 50,
            pageSizeOptions: [50, 100, 200, 500],
            showTotal(total, range) {
              return `${range[0]}-${range[1]} de ${total} habilidades`;
            },
          }}
          rowSelection={rowSelection}
        />
      </Col>
      <Divider />
      <Col span={24}>
        <List
          dataSource={currentSource.length ? currentSource : dataSource}
          pagination={{
            defaultPageSize: 50,
            pageSizeOptions: [50, 100, 200, 500],
            showTotal(total, range) {
              return `${range[0]}-${range[1]} de ${total} habilidades`;
            },
          }}
          renderItem={(item) => (
            <List.Item key={nanoid()}>
              <Descriptions
                title={item.code}
                extra={
                  <Space>
                    <Tooltip title="Editar">
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setId(item.id);
                          editCurriculum.onOpen();
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
                column={3}
                bordered
                className="w-full"
              >
                <Descriptions.Item label="Currículo">
                  <Typography.Text type="secondary">{item.competenceCurriculumName}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="Área de Competência">
                  <Typography.Text type="secondary">{item.competenceAreaName}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="Código da Competência">
                  <Typography.Text type="secondary">{item.competenceCode}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="Descrição da Competência" span={3}>
                  <Typography.Text type="secondary">{item.competenceDescription}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="Descrição da Habilidade" span={3}>
                  <Typography.Text type="secondary">{item.description}</Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="Objetos de Conhecimento" span={3}>
                  <Space size="small" wrap>
                    {item.objects.map((objects) => (
                      <TagField value={objects} color={getUniqueColor(objects)} />
                    ))}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Unidades Temáticas" span={3}>
                  <Space size="small" wrap>
                    {item.unites.map((unite) => (
                      <TagField value={unite} color={getUniqueColor(unite)} />
                    ))}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Práticas" span={3}>
                  <Space size="small" wrap>
                    {item.practices.map((practice) => (
                      <TagField value={practice.name} color={getUniqueColor(practice.name)} />
                    ))}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Notas" span={3}>
                  <Typography.Text type="secondary">{item.notes}</Typography.Text>
                </Descriptions.Item>
              </Descriptions>
            </List.Item>
          )}
        />
      </Col>
      <SkillsCreate onClose={createCurriculum.onClose} isOpen={createCurriculum.isOpen} />
      <SkillEdit onClose={editCurriculum.onClose} isOpen={editCurriculum.isOpen} id={id} />
    </Row>
  );
}
