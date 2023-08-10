import { skipToken } from '@reduxjs/toolkit/query/react';
import { Button, Card, Col, Descriptions, Result, Row, Spin } from 'antd';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TagField } from '../../../components';
import { Show } from '../../../components/crud/show';
import { getUniqueColor } from '../../../helpers';
import { useDisclosure } from '../../../hooks/useDisclosure';
import { useShowSkillQuery } from '../../../services/skill.service';
import SkillEdit from '../edit/skill.edit';

export function SkillsShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editSkill = useDisclosure();
  const [editId, setEditId] = useState<number>();

  const { data: skillData, isLoading, isError, refetch: refetchSkills } = useShowSkillQuery(Number(id) ?? skipToken);

  if (isLoading) {
    return (
      <Show resource="labs" title="Laboratórios" refetch={refetchSkills}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card className="w-full">
              <Result title="Carregando..." extra={<Spin size="large" />} />
            </Card>
          </Col>
        </Row>
      </Show>
    );
  }

  if (isError) {
    return (
      <Show resource="labs" title="Laboratórios" refetch={refetchSkills}>
        <Row>
          <Col span={24}>
            <Card className="w-full">
              <Result
                status="500"
                title="500"
                subTitle="Desculpe, não foi possível carregar a página."
                extra={
                  <Button type="primary" onClick={() => navigate(-1)}>
                    Voltar
                  </Button>
                }
              />
            </Card>
          </Col>
        </Row>
      </Show>
    );
  }

  return (
    <Show
      resource="curriculums"
      refetch={refetchSkills}
      title="Habilidades"
      modal={() => {
        if (id) {
          setEditId(Number(id));
          editSkill.onOpen();
        }
      }}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Descriptions
              key={skillData?.id}
              column={2}
              className="w-full"
              layout="vertical"
              title={skillData?.competence.curriculum.name}
            >
              <Descriptions.Item label="Código">{skillData?.code}</Descriptions.Item>
              <Descriptions.Item label="Descrição">{skillData?.description}</Descriptions.Item>
              <Descriptions.Item label="Notas">{skillData?.notes}</Descriptions.Item>
              <Descriptions.Item label="Práticas">
                {skillData?.practices.map((value) => (
                  <TagField value={value.name} color={getUniqueColor(value.name)} />
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="Objetos de Competência">
                {skillData?.objects.map((value) => <TagField value={value.name} color={getUniqueColor(value.name)} />)}
              </Descriptions.Item>
              <Descriptions.Item label="Unidades de Conhecimento">
                {skillData?.unities.map((value) => <TagField value={value.name} color={getUniqueColor(value.name)} />)}
              </Descriptions.Item>
              <Descriptions.Item label="Área de Competência">
                {skillData?.competence.competence_area.name}
              </Descriptions.Item>
              <Descriptions.Item label="Descrição da Competência">
                {skillData?.competence.description}
              </Descriptions.Item>
              <Descriptions.Item label="Código da Competência">{skillData?.competence.code}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
      <SkillEdit onClose={editSkill.onClose} isOpen={editSkill.isOpen} id={editId} />
    </Show>
  );
}
