import { ArrowLeftOutlined, EyeOutlined, ReloadOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Button, Col, Row, Space } from 'antd';
import { PropsWithChildren } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface EditProps extends PropsWithChildren {
  refetch: () => void;
  resource: string;
  title: string;
  name?: string;
  isShow?: boolean;
}

export function Edit({ refetch, children, resource, title, name, isShow }: EditProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <>
      <Row>
        <Col span={24}>
          <div className="flex items-center justify-between w-full pb-4">
            <div className="flex justify-center">
              <Button
                className="text-xl font-bold"
                icon={<ArrowLeftOutlined />}
                type="text"
                onClick={() => navigate(-1)}
              >
                {name ?? 'Editar'}
              </Button>
            </div>
            <Space>
              <Button icon={<UnorderedListOutlined />} onClick={() => navigate(`/${resource}`)}>
                {title}
              </Button>
              {isShow ? (
                <Button onClick={() => navigate(`/${resource}/show/${id}`)} icon={<EyeOutlined />}>
                  Detalhes
                </Button>
              ) : null}

              <Button icon={<ReloadOutlined />} onClick={refetch}>
                Atualizar
              </Button>
            </Space>
          </div>
        </Col>
      </Row>
      {children}
    </>
  );
}

Edit.defaultProps = {
  name: 'Editar',
  isShow: false,
};
