import { skipToken } from '@reduxjs/toolkit/query';
import { Button, Card, Col, Empty, Result, Row, Spin } from 'antd';
import parse from 'html-react-parser';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Show } from '../../components/crud/show';
import { useShowTemplateQuery } from '../../services/templates.service';

export function DocumentsShow() {
  const navigate = useNavigate();
  const params = useParams();
  const id = useMemo(() => (params.id ? Number(params.id) : 0), [params.id]);
  const { data: templateData, isLoading, isError, refetch } = useShowTemplateQuery(id || skipToken);

  if (isLoading) {
    return (
      <Show resource="labs" title="Laboratórios" refetch={refetch}>
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
      <Show resource="labs" title="Laboratórios" refetch={refetch}>
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
    <Show resource="editor" title="Práticas" refetch={refetch}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>{templateData ? parse(templateData.content) : <Empty />}</Card>
        </Col>
      </Row>
    </Show>
  );
}
