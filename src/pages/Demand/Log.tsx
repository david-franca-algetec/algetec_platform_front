// noinspection JSIgnoredPromiseFromCall

import { DatePicker, Form, Input, message, Modal, Select, Slider, Switch } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

import { orderBy } from 'lodash';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../config/hooks';
import { selectCurrentUser } from '../../config/reducers/authSlice';
import { handleError, handleTypeName, numberOfBusinessDays } from '../../helpers';
import { useCreateLogMutation } from '../../services/demands.service';
import { useGetUsersQuery } from '../../services/user.service';

interface AddLogProps {
  onClose: () => void;
  open: boolean;
  demandId: number;
  lastStartedAt: string;
  type: string;
}

type InitialValues = {
  deadline: number;
  developers: number[];
  finishedAt: Dayjs;
  createdAt: Dayjs;
  type: string;
  active: boolean;
  progress: number;
};

export function AddLog({ onClose, open, demandId, lastStartedAt, type }: AddLogProps) {
  const [toast, contextHolder] = message.useMessage();
  const currentUser = useAppSelector(selectCurrentUser);
  const [createLog, { isLoading, isError, isSuccess, error }] = useCreateLogMutation();
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();
  const [form] = Form.useForm<InitialValues>();
  const [checked, setChecked] = useState(true);
  const initialValues: Partial<InitialValues> = {
    progress: 0,
  };

  const users = useMemo(() => {
    if (usersData) {
      return orderBy(usersData, 'name').map((user) => ({
        value: user.id,
        label: user.name,
      }));
    }
    return [];
  }, [usersData]);

  const onFinish = async () => {
    const values = await form.validateFields();

    if (currentUser) {
      const create = {
        active: checked,
        type,
        demand_id: demandId,
        logger_id: currentUser.id,
        deadline: numberOfBusinessDays(moment(lastStartedAt).toDate(), values.finishedAt.toDate())?.hours || 0,
        developers: values.developers,
        progress: values.progress,
        finishedAt: values.finishedAt.toISOString(),
        createdAt: values.createdAt.toISOString(),
      };

      createLog(create);
    }
  };

  const onCancel = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (isError && error && 'data' in error) {
      const message = handleError(error);
      toast.error(message);
    }
    if (isSuccess) {
      toast.success('Histórico adicionado com sucesso');
      form.resetFields();
      onClose();
    }
  }, [isError, isSuccess]);

  return (
    <Modal
      title={`Adicionar Histórico - ${handleTypeName(type)}`}
      open={open}
      okText="Salvar"
      cancelText="Cancelar"
      onCancel={onCancel}
      onOk={onFinish}
      okButtonProps={{
        loading: isLoading,
      }}
      maskStyle={{
        backdropFilter: 'blur(8px)',
      }}
    >
      {contextHolder}
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item name="active" label="Status">
          <Switch
            checked={checked}
            onChange={(e) => setChecked(e)}
            checkedChildren="Ativo"
            unCheckedChildren="Inativo"
          />
        </Form.Item>
        <Form.Item
          name="createdAt"
          label="Data de Criação do Histórico"
          rules={[
            {
              required: true,
              message: 'Data de Criação do Histórico é obrigatória',
            },
            {
              type: 'date',
              message: 'Data de Criação do Histórico deve ser uma data válida',
            },
          ]}
        >
          <DatePicker format="DD/MM/YYYY HH:mm" showTime={{ format: 'HH:mm' }} showToday />
        </Form.Item>
        <Form.Item
          name="finishedAt"
          label="Data de Finalização"
          rules={[
            {
              required: true,
              message: 'Data de Criação do Histórico é obrigatória',
            },
            {
              type: 'date',
              message: 'Data de Criação do Histórico deve ser uma data válida',
            },
          ]}
        >
          <DatePicker
            format="DD/MM/YYYY HH:mm"
            showTime={{ format: 'HH:mm' }}
            showToday
            disabledDate={(e) => {
              const last = dayjs(lastStartedAt);
              return last.valueOf() > e.valueOf();
            }}
            onChange={(value) => {
              if (value) {
                form.setFieldValue(
                  'message',
                  numberOfBusinessDays(moment(lastStartedAt).toDate(), value.toDate())?.message,
                );
              }
            }}
          />
        </Form.Item>
        <Form.Item name="message" label="Prazo">
          <Input readOnly />
        </Form.Item>
        <Form.Item
          name="developers"
          label="Responsáveis"
          rules={[
            {
              type: 'array',
              required: true,
              message: 'Responsáveis é obrigatório',
            },
          ]}
        >
          <Select
            placeholder="Selecione um responsável"
            mode="multiple"
            allowClear
            showSearch
            disabled={usersLoading}
            options={users}
            optionFilterProp="label"
          />
        </Form.Item>
        <Form.Item
          name="progress"
          label="Progresso (%)"
          rules={[
            {
              required: true,
              message: 'Progresso é obrigatório',
            },
            {
              type: 'number',
              min: 0,
              max: 100,
              message: 'Progresso deve ser entre 0 e 100',
            },
          ]}
        >
          <Slider
            min={0}
            max={100}
            marks={{
              0: '0%',
              20: '20%',
              40: '40%',
              60: '60%',
              80: '80%',
              100: '100%',
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
