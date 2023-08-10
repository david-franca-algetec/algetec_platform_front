import { ReloadOutlined } from '@ant-design/icons';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { Button, Col, Drawer, Form, Input, message, Row, Select, Tooltip } from 'antd';
import { useEffect, useMemo } from 'react';
import { handleError } from '../../../helpers';
import { useGetPracticesQuery } from '../../../services/practices.service';
import {
  UpdateSkillProps,
  useAllObjectsQuery,
  useAllUnitiesQuery,
  useShowSkillQuery,
  useUpdateSkillMutation,
} from '../../../services/skill.service';

interface SkillEditProps {
  id?: number;
  isOpen: boolean;
  onClose: () => void;
}

function SkillEdit({ onClose, isOpen, id }: SkillEditProps) {
  const [toast, contextHolder] = message.useMessage();
  const [form] = Form.useForm<UpdateSkillProps>();

  const [
    updateSkill,
    {
      isLoading: isUpdateSkillLoading,
      isSuccess: isUpdateSkillSuccess,
      isError: isUpdateSkillError,
      error: updateSkillError,
    },
  ] = useUpdateSkillMutation();
  const {
    data: skillData,
    isLoading: isLoadingSkill,
    refetch: skillsRefetch,
    isFetching: isFetchingSkill,
  } = useShowSkillQuery(id || skipToken);
  const { data: practicesData, isLoading: isLoadingPractices, refetch: practicesRefetch } = useGetPracticesQuery();
  const { data: objectsData, isLoading: isLoadingObjects, refetch: objectsRefetch } = useAllObjectsQuery();
  const { data: unitiesData, isLoading: isLoadingUnities, refetch: unitiesRefetch } = useAllUnitiesQuery();

  const practicesOptions = useMemo(
    () =>
      practicesData
        ? practicesData.map((el) => ({ value: el.id, label: `${el.code} | ID: ${el.experiment_id} | ${el.name}` }))
        : [],
    [practicesData],
  );

  const objectsOptions = useMemo(
    () => (objectsData ? objectsData.map((el) => ({ value: el.name, label: el.name })) : []),
    [objectsData],
  );

  const unitiesOptions = useMemo(
    () => (unitiesData ? unitiesData.map((el) => ({ value: el.name, label: el.name })) : []),
    [unitiesData],
  );

  const refetch = (): void => {
    skillsRefetch();
    practicesRefetch();
    objectsRefetch();
    unitiesRefetch();
  };

  const onFinish = (values: UpdateSkillProps): void => {
    if (id) {
      updateSkill({
        ...values,
        id,
      });
    }
  };

  useEffect(() => {
    if (skillData && isOpen) {
      form.setFieldsValue({
        competence_area_name: skillData.competence.competence_area.name,
        competence_description: skillData.competence.description,
        curriculum_name: skillData.competence.curriculum.name,
        competence_code: skillData.competence.code,
        skill: {
          code: skillData.code,
          description: skillData.description,
          notes: skillData.notes,
          objects: skillData.objects.map((el) => el.name),
          practices: skillData.practices.map((el) => el.id),
          unities: skillData.unities.map((el) => el.name),
        },
      });
    }
    if (!isOpen) {
      form.resetFields();
    }
  }, [skillData, isOpen]);

  useEffect(() => {
    if (isUpdateSkillSuccess) {
      toast.success('Habilidade atualizada com sucesso!').then();
      form.resetFields();
      onClose();
    }
    if (isUpdateSkillError && updateSkillError && 'data' in updateSkillError) {
      const message = handleError(updateSkillError);
      toast.error(message).then();
    }
  }, [isUpdateSkillSuccess, isUpdateSkillError, updateSkillError]);

  return (
    <Drawer
      title="Editar Habilidade"
      onClose={onClose}
      open={isOpen}
      extra={
        <Tooltip title="Atualizar" placement="bottomLeft">
          <Button icon={<ReloadOutlined />} onClick={refetch} />
        </Tooltip>
      }
      width="50%"
    >
      {contextHolder}
      <Row>
        <Col span={24}>
          <Form layout="vertical" form={form} onFinish={onFinish} disabled={isLoadingSkill || isFetchingSkill}>
            <Form.Item name="curriculum_name" label="Nome do Currículo">
              <Input />
            </Form.Item>
            <Form.Item name="competence_area_name" label="Nome da Área de Competência">
              <Input />
            </Form.Item>
            <Form.Item name="competence_description" label="Descrição da Competência">
              <Input.TextArea rows={5} />
            </Form.Item>
            <Form.Item name="competence_code" label="Código da Competência">
              <Input />
            </Form.Item>
            <Form.Item name={['skill', 'code']} label="Código da Habilidade">
              <Input />
            </Form.Item>
            <Form.Item name={['skill', 'description']} label="Descrição da Habilidade">
              <Input.TextArea rows={5} />
            </Form.Item>
            <Form.Item name={['skill', 'notes']} label="Notas">
              <Input.TextArea rows={5} />
            </Form.Item>
            <Form.Item name={['skill', 'practices']} label="Práticas">
              <Select
                options={practicesOptions}
                mode="multiple"
                loading={isLoadingPractices || isLoadingSkill || isFetchingSkill}
                disabled={isLoadingPractices || isLoadingSkill || isFetchingSkill}
              />
            </Form.Item>
            <Form.Item name={['skill', 'objects']} label="Objetos de Conhecimento">
              <Select
                options={objectsOptions}
                mode="tags"
                loading={isLoadingObjects}
                disabled={isLoadingObjects || isLoadingSkill || isFetchingSkill}
              />
            </Form.Item>
            <Form.Item name={['skill', 'unities']} label="Unidades Temáticas">
              <Select
                options={unitiesOptions}
                mode="tags"
                loading={isLoadingUnities}
                disabled={isLoadingUnities || isLoadingSkill || isFetchingSkill}
              />
            </Form.Item>

            <Form.Item className="text-center">
              <Button type="primary" htmlType="submit" loading={isUpdateSkillLoading}>
                Salvar
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Drawer>
  );
}

SkillEdit.defaultProps = {
  id: undefined,
};
export default SkillEdit;
