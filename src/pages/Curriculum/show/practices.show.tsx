import { nanoid } from '@reduxjs/toolkit';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { Button, Card, Col, Descriptions, Result, Row, Space, Spin, Typography } from 'antd';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TagField } from '../../../components';
import { Show } from '../../../components/crud/show';
import { getUniqueColor } from '../../../helpers';
import { useDisclosure } from '../../../hooks/useDisclosure';
import { useShowPracticeQuery } from '../../../services/practices.service';
import { PracticeEdit } from '../edit/practice.edit';

export function CurriculumPracticesShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editPractice = useDisclosure();
  const [editId, setEditId] = useState<number>();

  const {
    data: practiceData,
    refetch: refetchPractices,
    isError,
    isLoading,
  } = useShowPracticeQuery(Number(id) || skipToken);

  if (isLoading) {
    return (
      <Show resource="labs" title="Laboratórios" refetch={refetchPractices}>
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
      <Show resource="labs" title="Laboratórios" refetch={refetchPractices}>
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
      refetch={refetchPractices}
      title="Práticas"
      modal={() => {
        if (id) {
          setEditId(Number(id));
          editPractice.onOpen();
        }
      }}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Descriptions
              key={practiceData?.id}
              column={{ sm: 1, md: 2, lg: 2, xs: 1, xl: 2, xxl: 2 }}
              bordered
              className="w-full"
            >
              <Descriptions.Item label="Código" contentStyle={{ width: '50%' }}>
                <Typography.Text type="secondary">{practiceData?.code}</Typography.Text>
              </Descriptions.Item>
              <Descriptions.Item label="Nome" contentStyle={{ width: '50%' }}>
                <Typography.Text type="secondary">{practiceData?.name}</Typography.Text>
              </Descriptions.Item>
              <Descriptions.Item label="Descrição">
                <Typography.Text type="secondary">{practiceData?.description}</Typography.Text>
              </Descriptions.Item>
              <Descriptions.Item label="Laboratório">
                <Typography.Text type="secondary">{practiceData?.experiment.name}</Typography.Text>
              </Descriptions.Item>
              <Descriptions.Item label="Habilidades" span={2}>
                <Space size="small" wrap>
                  {practiceData?.skills.map((skill) => (
                    <TagField key={nanoid()} value={skill.code} color={getUniqueColor(skill.code)} />
                  ))}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Áreas">
                <Space size="small" wrap>
                  {practiceData?.experiment.areas.map((area) => (
                    <TagField key={nanoid()} value={area.name} color={getUniqueColor(area.name)} />
                  ))}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
      <PracticeEdit onClose={editPractice.onClose} isOpen={editPractice.isOpen} id={editId} />
    </Show>
  );
}
