/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/jsx-props-no-spreading */

import { DeleteOutlined, MenuOutlined } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Form, Input, InputRef, Popconfirm, Select, Space, Table, Tooltip, Typography } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { Key } from 'antd/es/table/interface';
import { orderBy } from 'lodash';
import {
  Children,
  cloneElement,
  createContext,
  CSSProperties,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useGetChecklistsQuery } from '../../services/checklist.service';

export interface IChecklistParams {
  checked: boolean;
  key: number;
  name: string;
  percentage: number;
}

export interface IChecklistSelectProps {
  name?: string;
  params?: IChecklistParams[];
  id?: number;
  checked?: boolean;
  key?: number;
  index?: number;
}

interface IChecklistProps {
  onSelect: (value: IChecklistSelectProps) => void;
  onOpen: (value: boolean) => void;
  select?: IChecklistSelectProps;
}

interface DataType {
  key: number;
  name: string;
  percentage: number;
  checked?: boolean;
}

interface Item {
  key: number;
  name: string;
  percentage: number;
}

interface RowProps extends HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

interface EditableCellProps {
  title: ReactNode;
  editable: boolean;
  children: ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

function EditableCell({ title, editable, children, dataIndex, record, handleSave, ...restProps }: EditableCellProps) {
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
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
}

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

export function Checklist({ onSelect, onOpen, select }: IChecklistProps) {
  const { data: checklistsData } = useGetChecklistsQuery();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [checklistId, setChecklistId] = useState<number>();
  const checklists = useMemo(() => orderBy(checklistsData, 'name') || [], [checklistsData]);

  const handleSelect = () => {
    const checklist = checklists.find((check) => check.id === checklistId);
    const id = select?.id;

    onSelect({
      id: checklistId || id,
      name: checklist?.name || select?.name,
      params: dataSource.map((parameter) => ({
        checked: Boolean(parameter.checked),
        key: Number(parameter.key),
        name: parameter.name,
        percentage: Number(parameter.percentage),
      })),
    });

    setChecklistId(undefined);
    onOpen(false);
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
      width: '10%',
    },
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      ellipsis: { showTitle: false },
      width: '50%',
      render: (value) => (
        <Tooltip title={value} placement="topLeft">
          <Typography.Text>{value}</Typography.Text>
        </Tooltip>
      ),
    },
    {
      title: 'Peso',
      dataIndex: 'percentage',
      key: 'percentage',
      editable: true,
      width: '20%',
    },
    {
      dataIndex: 'operation',
      align: 'center',
      width: '20%',
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
      checked: false,
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
    if (checklistId) {
      const checklist = checklists.find((check) => check.id === checklistId);

      if (checklist) {
        const parameters = checklist.checklist_parameters.map((parameter, index) => ({
          name: parameter.name,
          percentage: parameter.percentage,
          key: index + 1,
          checklistId: parameter.checked,
        }));
        setDataSource(parameters);
      }
    }
  }, [checklistId]);

  useEffect(() => {
    if (select?.params && select.id) {
      setDataSource(
        select.params.map((parameter, index) => ({
          name: parameter.name,
          percentage: parameter.percentage,
          key: index + 1,
          checked: parameter.checked,
        })),
      );
    }
  }, [select]);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <Typography.Text>Selecione um modelo</Typography.Text>
      <Select
        allowClear
        style={{ width: '100%' }}
        value={checklistId}
        options={checklists.map((checklist) => ({ value: checklist.id, label: checklist.name }))}
        onChange={setChecklistId}
      />
      <Button block onClick={handleAdd} type="dashed" className="my-4" disabled={!(!!checklistId || !!select?.id)}>
        Adicionar item
      </Button>

      <DndContext onDragEnd={onDragEnd}>
        <SortableContext items={dataSource.map((i) => i.key)} strategy={verticalListSortingStrategy}>
          <Table
            rowKey="key"
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={dataSource}
            columns={columns as ColumnTypes}
          />
        </SortableContext>
      </DndContext>
      <div className="text-center">
        <Button className="mt-4" type="primary" onClick={handleSelect} disabled={!(!!checklistId || !!select?.id)}>
          Salvar
        </Button>
      </div>
    </Space>
  );
}

Checklist.defaultProps = {
  select: undefined,
};
