import { ArrowLeftOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Button, Col, Row, Space } from 'antd';
import { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarWithHeader } from '../../Sidebar';

interface CreateProps extends PropsWithChildren {
  title: string;
  resource: string;
  listName: string;
}

export function Create({ listName, resource, title, children }: CreateProps) {
  const navigate = useNavigate();
  return (
    <SidebarWithHeader>
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
                {title}
              </Button>
            </div>
            <Space>
              <Button icon={<UnorderedListOutlined />} onClick={() => navigate(`/${resource}`)}>
                {listName}
              </Button>
            </Space>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>{children}</Col>
      </Row>
    </SidebarWithHeader>
  );
}
