import { ArrowLeftOutlined, EditOutlined, ReloadOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import { PropsWithChildren, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SidebarWithHeader } from '../../Sidebar';

interface ShowProps extends PropsWithChildren {
  resource: string;
  title: string;
  refetch: () => void;
  editUrl?: string;
  modal?: () => void;
}

export function Show({ resource, children, title, refetch, editUrl, modal }: ShowProps) {
  const navigate = useNavigate();
  const params = useParams();
  const id = useMemo(() => (params.id ? Number(params.id) : 0), [params.id]);
  return (
    <SidebarWithHeader>
      <Row gutter={[16, 16]} className="pb-4">
        <Col lg={12} md={24} sm={24} xs={12}>
          <Button className="text-xl font-bold" icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate(-1)}>
            Detalhes
          </Button>
        </Col>
        <Col lg={4} md={8} sm={8} xs={12}>
          <Button block icon={<UnorderedListOutlined />} onClick={() => navigate(`/${resource}`)}>
            {title}
          </Button>
        </Col>
        <Col lg={4} md={8} sm={8} xs={12}>
          <Button
            block
            icon={<EditOutlined />}
            type="primary"
            onClick={
              editUrl ? () => window.open(editUrl, '_blank') : modal || (() => navigate(`/${resource}/edit/${id}`))
            }
          >
            Editar
          </Button>
        </Col>
        <Col lg={4} md={8} sm={8} xs={12}>
          <Button block icon={<ReloadOutlined />} onClick={refetch}>
            Atualizar
          </Button>
        </Col>
      </Row>
      {children}
    </SidebarWithHeader>
  );
}

Show.defaultProps = {
  editUrl: undefined,
  modal: undefined,
};
