// noinspection JSIgnoredPromiseFromCall

import { Checkbox, Col, Form, Input, message, Modal, Row, Select } from 'antd';
import { sortBy } from 'lodash';
import { useEffect, useMemo } from 'react';
import { handleError } from '../../helpers';

import { ReleaseUpdate, useGetReleasesByIdQuery, useUpdateReleaseMutation } from '../../services/releases.service';
import { useGetReleaseTypesQuery } from '../../services/releaseTypes.service';
import { EditProps } from '../types';
import { tagRender } from './tagRender';

interface InitialValues {
  releaseTypes: string[];
  options: string[];
  description?: string;
}

export function EditVersion({ onClose, id, open }: EditProps) {
  const [toast, contextHolder] = message.useMessage();
  const { data: releaseTypes, isLoading: releaseTypesLoading } = useGetReleaseTypesQuery();
  const [updateRelease, { isError, isLoading: releaseUpdateLoading, isSuccess, error }] = useUpdateReleaseMutation();
  const { data: releaseData, isLoading: releaseByIdLoading } = useGetReleasesByIdQuery(id, {
    skip: !id,
  });

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
  const initialValues: InitialValues = {
    releaseTypes: [],
    options: [],
    description: undefined,
  };

  const [form] = Form.useForm<InitialValues>();

  const onFinish = async () => {
    const values = await form.validateFields();
    const update: ReleaseUpdate = {
      releaseTypes: values.releaseTypes.map((r) => parseInt(r.split('#')[0], 10)),
      id_0: values.options.includes('id_0'),
      id_5000: values.options.includes('id_5000'),
      id_6000: values.options.includes('id_6000'),
      play_store: values.options.includes('play_store'),
      languages: values.options.includes('languages'),
      platform_a: values.options.includes('platform_a'),
      description: values.description,
      id,
    };
    updateRelease(update);
  };

  const onCancel = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (releaseData && open) {
      form.setFieldsValue({
        releaseTypes: releaseData[0].releaseType.map((r) => `${r.id}${r.color}`),
        options: [
          releaseData[0].id_0 ? 'id_0' : '',
          releaseData[0].id_5000 ? 'id_5000' : '',
          releaseData[0].id_6000 ? 'id_6000' : '',
          releaseData[0].languages ? 'languages' : '',
          releaseData[0].play_store ? 'play_store' : '',
          releaseData[0].platform_a ? 'platform_a' : '',
        ],
        description: releaseData[0].description,
      });
    }
  }, [releaseData, open]);

  useEffect(() => {
    form.setFieldsValue({
      releaseTypes: [],
      options: [],
    });
  }, []);

  useEffect(() => {
    if (isError && error && 'data' in error) {
      const message = handleError(error);
      toast.error(message);
    }
    if (isSuccess) {
      toast.success('Lançamento atualizado com sucesso');
      form.resetFields();
      onClose();
    }
  }, [isError, isSuccess, error]);

  return (
    <Modal
      title="Editar Lançamento"
      open={open}
      okText="Salvar"
      cancelText="Cancelar"
      onCancel={onCancel}
      onOk={onFinish}
      okButtonProps={{
        loading: releaseUpdateLoading,
        disabled: releaseTypesLoading || releaseByIdLoading,
      }}
      maskStyle={{
        backdropFilter: 'blur(8px)',
      }}
    >
      {contextHolder}
      <Form form={form} layout="vertical" initialValues={initialValues}>
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
            disabled={releaseTypesLoading || releaseByIdLoading}
            optionFilterProp="label"
          />
        </Form.Item>
        <Form.Item name="options">
          <Checkbox.Group>
            <Row>
              <Col span={8}>
                <Checkbox value="id_0">ID +0</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="id_5000">ID +5000</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="id_6000">ID +6000</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="play_store">PlayStore</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="languages">Linguagens</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="platform_a">Plataforma A</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item name="description" label="Descrição">
          <Input.TextArea rows={5} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
