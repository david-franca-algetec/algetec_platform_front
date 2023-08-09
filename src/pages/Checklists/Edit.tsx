/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/jsx-props-no-spreading */
// noinspection JSIgnoredPromiseFromCall

import { DeleteOutlined, MenuOutlined } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Button, Form, Input, InputRef, message, Modal, Popconfirm, Select, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { Key } from 'antd/es/table/interface';

import { isNil, omitBy, orderBy } from 'lodash';
import {
  Children,
  cloneElement,
  createContext,
  CSSProperties,
  HTMLAttributes,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { handleError, handleTypeName } from '../../helpers';
import { IChecklistUpdate } from '../../models/checklist.model';
import { SelectOption } from '../../models/demands.model';
import { useGetChecklistsQuery, useUpdateChecklistMutation } from '../../services/checklist.service';
import { useGetDepartmentsQuery } from '../../services/department.service';
import { EditProps } from '../types';
import { EditableCellProps } from './types';

interface DataType {
  key: number;
  name: string;
  percentage: number;
}

interface Item {
  key: number;
  name: string;
  percentage: number;
}

interface RowProps extends HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const EditableContext = createContext<FormInstance | null>(null);

function TableRow({ children, ...props }: RowProps) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
  });

  const style: CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 })?.replace(
      /translate3d\(([^,]+),/,
      'translate3d(0,',
    ),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  const [form] = Form.useForm();

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} ref={setNodeRef} style={style} {...attributes}>
          {Children.map(children, (child) => {
            if ((child as ReactElement).key === 'sort') {
              return cloneElement(child as ReactElement, {
                children: (
                  <MenuOutlined
                    ref={setActivatorNodeRef}
                    style={{ touchAction: 'none', cursor: 'move' }}
                    {...listeners}
                  />
                ),
              });
            }
            return child;
          })}
        </tr>
      </EditableContext.Provider>
    </Form>
  );
}

function EditableCell({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}: EditableCellProps<Item>) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      /* empty */
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit} aria-hidden="true">
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
}

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

export function EditChecklist({ onClose, id, open }: EditProps) {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const { data: checklistsData, isLoading } = useGetChecklistsQuery();
  const checklists = useMemo(() => orderBy(checklistsData, 'name') || [], [checklistsData]);
  const [updateChecklist, { isLoading: checklistUpdateLoading, isSuccess, isError, error }] =
    useUpdateChecklistMutation();

  const [toast, contextHolder] = message.useMessage();
  const [form] = Form.useForm<IChecklistUpdate>();

  const { data: departmentsData } = useGetDepartmentsQuery();

  const teamsItems: SelectOption[] = useMemo(
    () =>
      departmentsData
        ? orderBy(departmentsData, 'name').map((data) => ({ label: handleTypeName(data.name), value: data.id }))
        : [],
    [departmentsData],
  );

  const onFinish = async () => {
    const { name, department_ids } = await form.validateFields();

    const checklist = checklists.find((check) => check.id === id);
    if (checklist) {
      const omit: IChecklistUpdate = {
        id,
        name: checklist.name.toLowerCase() === name?.toLowerCase() ? undefined : name,
        parameters: dataSource?.map((data, index) => ({
          checked: false,
          name: data.name,
          percentage: data.percentage,
          order: index,
        })),
        department_ids,
      };
      const checkUpdate = omitBy<IChecklistUpdate>(omit, isNil) as IChecklistUpdate;

      updateChecklist(checkUpdate);
    }
    updateChecklist({ id, name, department_ids });
  };

  const onCancel = () => {
    form.resetFields();
    onClose();
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((previous) => {
        const activeIndex = previous.findIndex((i) => i.key === active.id);
        const overIndex = previous.findIndex((i) => i.key === over?.id);
        return arrayMove(previous, activeIndex, overIndex);
      });
    }
  };

  const handleDelete = (key: Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      key: 'sort',
      dataIndex: 'sort',
      align: 'center',
    },
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      editable: true,
    },
    {
      title: 'Peso',
      dataIndex: 'percentage',
      key: 'percentage',
      editable: true,
    },
    {
      dataIndex: 'operation',
      align: 'center',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_, record: any) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Tem certeza?" onConfirm={() => handleDelete(record.key)}>
            <Button danger type="primary" icon={<DeleteOutlined />} />
          </Popconfirm>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: dataSource.length + 1,
      name: `Item ${dataSource.length + 1}`,
      percentage: 1,
    };
    setDataSource([...dataSource, newData]);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: TableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  useEffect(() => {
    if (checklistsData && open) {
      const checklistFound = checklistsData.find((check) => check.id === id);
      if (checklistFound) {
        setDataSource(
          checklistFound.checklist_parameters.map((param) => ({
            key: param.id,
            name: param.name,
            percentage: param.percentage,
          })),
        );
        form.setFieldsValue({
          id: checklistFound.id,
          name: checklistFound.name,
          department_ids: checklistFound.departments.map((department) => department.id),
        });
      }
    }
  }, [checklistsData, open, id]);

  useEffect(() => {
    if (isError && error && 'data' in error) {
      toast.error(handleError(error));
    }
    if (isSuccess) {
      form.resetFields();
      toast.success('Lista de tarefas atualizada com sucesso');
      onClose();
    }
  }, [isError, isSuccess]);

  return (
    <Modal
      title="Editar lista de tarefas"
      open={open}
      okText="Salvar"
      cancelText="Cancelar"
      onCancel={onCancel}
      onOk={onFinish}
      okButtonProps={{
        loading: checklistUpdateLoading,
      }}
      maskStyle={{
        backdropFilter: 'blur(8px)',
      }}
    >
      {contextHolder}
      <Form
        onFinish={onFinish}
        layout="vertical"
        form={form}
        initialValues={{
          name: '',
          parameters: [],
        }}
      >
        <Form.Item label="Título" id="name" name="name">
          <Input />
        </Form.Item>

        <Form.Item label="Time Padrão" name="department_ids" id="department_ids">
          <Select options={teamsItems} mode="multiple" />
        </Form.Item>

        <Button block onClick={handleAdd} type="dashed" className="my-4">
          Adicionar item
        </Button>

        <DndContext onDragEnd={onDragEnd}>
          <SortableContext items={dataSource.map((i) => i.key)} strategy={verticalListSortingStrategy}>
            <Table
              loading={isLoading}
              rowKey="key"
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              dataSource={dataSource}
              columns={columns as ColumnTypes}
            />
          </SortableContext>
        </DndContext>
      </Form>
    </Modal>
  );
}
