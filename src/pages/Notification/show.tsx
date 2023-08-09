import { skipToken } from '@reduxjs/toolkit/query/react';
import { Card, Descriptions, Modal } from 'antd';
import { DateField } from '../../components';
import { UrlField } from '../../components/fields/url';
import { useNotificationsByIdQuery } from '../../services/notifications.service';

interface ShowNotificationProps {
  id?: number;
  open: boolean;
  handleOk: () => void;
  handleCancel: () => void;
}
export function ShowNotification({ handleCancel, handleOk, open, id }: ShowNotificationProps) {
  const { data, isLoading } = useNotificationsByIdQuery(id || skipToken);

  return (
    <Modal open={open} onOk={handleOk} onCancel={handleCancel} className="p-4">
      <Card loading={isLoading} className="mt-6">
        <Descriptions column={1}>
          <Descriptions.Item label="Descrição">{data?.description}</Descriptions.Item>
          <Descriptions.Item label="Link">
            <UrlField value={`/${data?.link}`}>Origem</UrlField>
          </Descriptions.Item>
          <Descriptions.Item label="Data">
            <DateField format="DD/MM/YYYY HH:mm:ss" value={data?.created_at} />
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Modal>
  );
}

ShowNotification.defaultProps = {
  id: undefined,
};
