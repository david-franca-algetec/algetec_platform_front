import { nanoid } from '@reduxjs/toolkit';
import { skipToken } from '@reduxjs/toolkit/query/react';
import type { TabsProps } from 'antd';
import { AutoComplete, Button, Drawer, Form, Input, message, Select, Tabs } from 'antd';
import { KeyboardEvent, MouseEvent, useEffect, useMemo, useState } from 'react';
import { handleError } from '../../../helpers';
import { useGetPracticesQuery } from '../../../services/practices.service';
import {
  useAllObjectsQuery,
  useAllUnitiesQuery,
  useCompetenceAreaNameQuery,
  useCompetencesNameQuery,
  useCreateSkillMutation,
  useCurriculumNameQuery,
  useShowSkillQuery,
} from '../../../services/skill.service';

interface CurriculumCreateProps {
  isOpen: boolean;
  onClose: () => void;
  id?: number;
}

interface SkillsFormProps {
  [x: string]: {
    code: string;
    description: string;
    notes: string;
    practices: number[];
    objects: string[];
    unities: string[];
  };
}

interface FormValues {
  curriculum_name: string;
  competence_area_name: string;
  competence_code: string;
  competence_description: string;
  skills: SkillsFormProps;
}

type TargetKey = MouseEvent | KeyboardEvent | string;

function SkillForm() {
  const id = useMemo(() => nanoid(), []);

  const { data: practicesData, isLoading: isLoadingPractices } = useGetPracticesQuery();
  const { data: objectsData, isLoading: isLoadingObjects } = useAllObjectsQuery();
  const { data: unitiesData, isLoading: isLoadingUnities } = useAllUnitiesQuery();

  const practicesOptions = useMemo(
    () => (practicesData ? practicesData.map((el) => ({ value: el.id, label: `${el.id} - ${el.name}` })) : []),
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

  return (
    <>
      <Form.Item
        name={['skills', id, 'code']}
        label="Código"
        rules={[{ required: true, message: 'Por favor, insira um valor.' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={['skills', id, 'description']}
        label="Descrição"
        rules={[{ required: true, message: 'Por favor, insira um valor.' }]}
      >
        <Input.TextArea rows={5} />
      </Form.Item>
      <Form.Item name={['skills', id, 'notes']} label="Notas">
        <Input.TextArea rows={5} />
      </Form.Item>
      <Form.Item name={['skills', id, 'practices']} label="Práticas">
        <Select options={practicesOptions} mode="multiple" loading={isLoadingPractices} disabled={isLoadingPractices} />
      </Form.Item>
      <Form.Item name={['skills', id, 'objects']} label="Objetos de Conhecimento">
        <Select options={objectsOptions} mode="tags" loading={isLoadingObjects} disabled={isLoadingObjects} />
      </Form.Item>
      <Form.Item name={['skills', id, 'unities']} label="Unidades Temáticas">
        <Select options={unitiesOptions} mode="tags" loading={isLoadingUnities} disabled={isLoadingUnities} />
      </Form.Item>
    </>
  );
}

export function SkillsCreate({ onClose, isOpen, id }: CurriculumCreateProps) {
  const [toast, contextHolder] = message.useMessage();
  const [curriculumName, setCurriculumName] = useState('');
  const [competenceCode, setCompetenceCode] = useState('');
  const [competenceAreaName, setCompetenceAreaName] = useState('');

  const [
    createSkill,
    {
      isLoading: isLoadingCreateSkill,
      isError: isErrorCreateSkill,
      isSuccess: isSuccessCreateSkill,
      error: errorCreateSkill,
    },
  ] = useCreateSkillMutation();
  const { data: curriculumData } = useCurriculumNameQuery();
  const { data: competencesData } = useCompetencesNameQuery({
    curriculum: curriculumName,
    competenceArea: competenceAreaName,
  });
  const { data: competenceArea } = useCompetenceAreaNameQuery();
  const { data: skillsShowData } = useShowSkillQuery(id || skipToken);

  const curriculumOptions = useMemo(
    () => (curriculumData ? curriculumData.map((el) => ({ value: el.name, label: el.name })) : []),
    [curriculumData],
  );

  const competenceOptions = useMemo(
    () => (competencesData ? competencesData.map((el) => ({ value: el.code, label: el.code })) : []),
    [competencesData],
  );

  const competenceAreaOptions = useMemo(
    () => (competenceArea ? competenceArea.map((el) => ({ value: el.name })) : []),
    [competenceArea],
  );

  const [form] = Form.useForm<FormValues>();

  const initialItems: TabsProps['items'] = [
    {
      key: nanoid(),
      label: `Habilidade 1`,
      children: <SkillForm />,
    },
  ];

  const [activeKey, setActiveKey] = useState(initialItems[0].key);
  const [items, setItems] = useState(initialItems);

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = () => {
    const newActiveKey = nanoid();
    const newPanes = [...items];
    newPanes.push({ label: `Habilidade ${newPanes.length + 1}`, children: <SkillForm />, key: newActiveKey });
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const onEdit = (targetKey: MouseEvent | KeyboardEvent | string, action: 'add' | 'remove') => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  const onFinish = (values: FormValues) => {
    const parseSkills = Object.values(values.skills);
    createSkill({
      curriculum_name: values.curriculum_name,
      competence_area_name: values.competence_area_name,
      competence_code: values.competence_code,
      competence_description: values.competence_description,
      skills: parseSkills,
    });
  };

  useEffect(() => {
    if (isSuccessCreateSkill) {
      toast.success('Habilidade criada com sucesso!').then();
      form.resetFields();
      onClose();
    }
    if (isErrorCreateSkill && errorCreateSkill && 'data' in errorCreateSkill) {
      const message = handleError(errorCreateSkill);
      toast.error(message).then();
    }
  }, [isSuccessCreateSkill, isErrorCreateSkill, errorCreateSkill]);

  useEffect(() => {
    if (skillsShowData) {
      setCurriculumName(skillsShowData.competence.curriculum.name);
      setCompetenceAreaName(skillsShowData.competence.competence_area.name);
      setCompetenceCode(skillsShowData.competence.code);

      form.setFieldsValue({
        competence_code: skillsShowData.competence.code,
        competence_area_name: skillsShowData.competence.competence_area.name,
        curriculum_name: skillsShowData.competence.curriculum.name,
        competence_description: skillsShowData.competence.description,
      });
    }
  }, [skillsShowData]);

  return (
    <Drawer onClose={onClose} open={isOpen} width="50%" title="Adicionar Habilidade">
      {contextHolder}
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          name="curriculum_name"
          label="Nome do Currículo"
          rules={[{ required: true, message: 'Por favor, insira um valor.' }]}
        >
          <AutoComplete
            options={curriculumOptions}
            onSelect={(data) => {
              form.setFieldValue('curriculum_name', data);
              setCurriculumName(data);
            }}
            onChange={(data) => {
              form.setFieldValue('curriculum_name', data);
              setCurriculumName(data);
            }}
            filterOption={(inputValue, option) => option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
          />
        </Form.Item>
        <Form.Item
          name="competence_area_name"
          label="Áreas de Competência"
          rules={[{ required: true, message: 'Por favor, insira um valor.' }]}
        >
          <AutoComplete
            disabled={!curriculumName}
            options={competenceAreaOptions}
            onSelect={(data) => {
              form.setFieldValue('competence_area_name', data);
              setCompetenceAreaName(data);
            }}
            onChange={(data) => {
              form.setFieldValue('competence_area_name', data);
              setCompetenceAreaName(data);
            }}
            filterOption={(inputValue, option) => option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
          />
        </Form.Item>
        <Form.Item
          name="competence_code"
          label="Código da Competência"
          rules={[{ required: true, message: 'Por favor, insira um valor.' }]}
        >
          <AutoComplete
            disabled={!competenceAreaName}
            options={competenceOptions}
            onSelect={(data) => {
              form.setFieldValue('competence_code', data);
              const desc = competencesData?.find((el) => el.code === data);
              if (desc) {
                form.setFieldValue('competence_description', desc.description);
              }
              setCompetenceCode(data);
            }}
            onChange={(data) => {
              form.setFieldValue('competence_code', data);
              setCompetenceCode(data);
            }}
            filterOption={(inputValue, option) => option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
          />
        </Form.Item>

        <Form.Item
          name="competence_description"
          label="Descrição da Competência"
          rules={[{ required: true, message: 'Por favor, insira um valor.' }]}
        >
          <Input.TextArea disabled={!competenceCode} rows={5} />
        </Form.Item>

        <Tabs type="editable-card" onChange={onChange} activeKey={activeKey} onEdit={onEdit} items={items} />
        <Form.Item className="text-center">
          <Button type="primary" htmlType="submit" loading={isLoadingCreateSkill}>
            Salvar
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
}

SkillsCreate.defaultProps = {
  id: undefined,
};
