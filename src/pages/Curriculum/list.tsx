import { Card, Col, Row, Tabs, TabsProps } from 'antd';
import { PracticesTable } from './tables/practices.table';
import { SkillsTable } from './tables/skills.table';

export function CurriculumList() {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Currículos',
      children: <SkillsTable />,
    },
    {
      key: '2',
      label: 'Práticas',
      children: <PracticesTable />,
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card>
          <Tabs defaultActiveKey="1" items={items} />
        </Card>
      </Col>
    </Row>
  );
}
