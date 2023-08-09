// noinspection JSIgnoredPromiseFromCall

import { Form, Input, message, Modal, Select } from 'antd';
import { sortBy } from 'lodash';
import { useEffect, useMemo } from 'react';

import { useAppSelector } from '../../config/hooks';
import { selectCurrentUser } from '../../config/reducers/authSlice';
import { handleError, isValidVersion } from '../../helpers';
import { useGetExperimentsQuery } from '../../services/demands.service';
import { useCreateReleaseMutation } from '../../services/releases.service';
import { useGetReleaseTypesQuery } from '../../services/releaseTypes.service';
import { CreateProps } from '../types';
import { tagRender } from './tagRender';

interface InitialValues {
  experiment_id: number;
  releaseTypes: string[];
  version: string;
  description: string;
}

export function CreateVersion({ onClose, open }: CreateProps) {
  const { data: experiments, isLoading: experimentsLoading } = useGetExperimentsQuery();
  const [createRelease, { isError, error, isLoading, isSuccess }] = useCreateReleaseMutation();
  const { data: releaseTypes, isLoading: releaseTypesLoading } = useGetReleaseTypesQuery();
  const [toast, contextHolder] = message.useMessage();

  const releaseTypesOptions = useMemo(
    () =>
      releaseTypes
        ? sortBy(releaseTypes, ['name']).map((releaseType) => ({
            label: releaseType.name,
            value: `${releaseType.id}${releaseType.color}`,
          }))
        : [],
    [releaseTypes],
  );

  const experimentOptions = useMemo(
    () =>
      experiments
        ? sortBy(experiments, ['name']).map((experiment) => ({
            value: experiment.id,
            label: `${experiment.id} - ${experiment.name}`,
          }))
        : [],
    [experiments],
  );

  const currentUser = useAppSelector(selectCurrentUser);

  const [form] = Form.useForm<InitialValues>();

  const onFinish = async () => {
    if (currentUser) {
      const values = await form.validateFields();
      const create = {
        ...values,
        user_id: currentUser.id,
        releaseTypes: values.releaseTypes.map((releaseType) => parseInt(releaseType.split('#')[0], 10)),
      };
      createRelease(create);
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
      form.resetFields();
      toast.success('Lançamento adicionado com sucesso');
      onClose();
    }
  }, [isError, isSuccess, error]);

  return (
    <Modal
      title="Adicionar Lançamento"
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
      <Form form={form} layout="vertical">
        <Form.Item
          name="experiment_id"
          label="Prática"
          rules={[
            {
              required: true,
              message: 'Selecione uma opção',
            },
          ]}
        >
          <Select
            placeholder="Selecione uma Prática"
            allowClear
            showSearch
            disabled={experimentsLoading}
            options={experimentOptions}
            optionFilterProp="label"
          />
        </Form.Item>
        <Form.Item
          name="releaseTypes"
          label="Tipo"
          rules={[
            {
              required: true,
              message: 'Selecione pelo menos um tipo!',
            },
          ]}
        >
          <Select
            placeholder="Selecione um tipo"
            allowClear
            showSearch
            mode="tags"
            tagRender={tagRender}
            options={releaseTypesOptions}
            loading={releaseTypesLoading}
            optionFilterProp="label"
          />
        </Form.Item>
        <Form.Item
          name="version"
          label="Versão"
          rules={[
            {
              required: true,
              message: 'A versão é obrigatória!',
            },
            {
              validator(_, value) {
                if (isValidVersion(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Insira um valor válido'));
              },
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Descrição"
          rules={[
            {
              required: true,
              message: 'A descrição é obrigatória.',
            },
            {
              max: 10000,
              message: 'A descrição precisa ter no máximo 10000 caracteres.',
            },
          ]}
        >
          <Input.TextArea maxLength={10000} showCount rows={5} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
