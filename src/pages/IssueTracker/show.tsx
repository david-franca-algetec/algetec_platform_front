import {
  FileExcelOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileTextOutlined,
  FileUnknownOutlined,
  FileWordOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Form,
  Image,
  Input,
  Row,
  Space,
  Tag,
  Timeline,
  Tooltip,
  Typography,
} from 'antd';
import { orderBy } from 'lodash';
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { DateField, TagField } from '../../components';

import { Show } from '../../components/crud/show';
import { getUniqueColor, handleLinkName } from '../../helpers';
import { completeVersion } from '../../helpers/completeVersion';
import { useDisclosure } from '../../hooks/useDisclosure';
import { PRIORITY } from '../../models/enum/priority.enum';
import { useCreateIssuesCommentsMutation } from '../../services/issueComment.service';
import { useShowIssuesQuery } from '../../services/issues.service';
import { useGetUsersQuery } from '../../services/user.service';
import { IssueEdit } from './edit';

const { Title, Paragraph } = Typography;

interface FormProps {
  comment: string;
}

export function IssueTrackerShow() {
  const params = useParams();
  const id = useMemo(() => (params.id ? Number(params.id) : 0), [params.id]);
  const edit = useDisclosure();
  const { data: issueData, refetch, isLoading: isIssuesLoading } = useShowIssuesQuery(id);
  const { data: usersData, isLoading: isUsersLoading } = useGetUsersQuery();
  const [createComment, { isLoading: isCreatingCommentLoading, isSuccess: isCommentCreated }] =
    useCreateIssuesCommentsMutation();

  const [form] = Form.useForm<FormProps>();

  const onFinish = ({ comment }: FormProps) => {
    createComment({ comment, issue_id: id });
  };

  const handlePriority = (priority?: number) => {
    switch (priority) {
      case PRIORITY.LOW:
        return <Tag color="#62C450">Baixa</Tag>;
      case PRIORITY.NORMAL:
        return <Tag color="#FFD827">Normal</Tag>;
      case PRIORITY.HIGH:
        return <Tag color="#F78D37">Alta</Tag>;
      case PRIORITY.CRITICAL:
        return <Tag color="#D42A34">Crítica</Tag>;

      default:
        return '-';
    }
  };

  const handleUser = (userId: number | null) => usersData?.find((user) => user.id === userId)?.name;

  const handleExtension = (name: string, link?: string) => {
    const ext = name.split('.').pop();
    let icon = <FileUnknownOutlined className="text-3xl text-gray-600" />;
    if (ext === 'txt') {
      icon = <FileTextOutlined className="text-3xl" />;
    }
    if (ext === 'pdf') {
      icon = <FilePdfOutlined className="text-3xl text-red-600" />;
    }
    if (ext && ['doc', 'docx', 'odt'].includes(ext)) {
      icon = <FileWordOutlined className="text-3xl text-blue-600" />;
    }
    if (ext && ['xls', 'xlsx', 'csv', 'ods'].includes(ext)) {
      icon = <FileExcelOutlined className="text-3xl text-emerald-600" />;
    }
    if (ext && ['ppt', 'pptx', 'odp'].includes(ext)) {
      icon = <FilePptOutlined className="text-3xl text-orange-600" />;
    }
    if (ext && ['bmp', 'gif', 'jpeg', 'jpg', 'png', 'tif', 'tiff'].includes(ext)) {
      return <Image src={link} height={64} />;
    }
    return <Button block className="h-full" icon={icon} onClick={() => window.open(link, '_blank')} />;
  };

  useEffect(() => {
    if (isCommentCreated) {
      form.resetFields();
    }
  }, [isCommentCreated]);

  return (
    <Show resource="issues" title="Problemas" refetch={refetch} modal={edit.onOpen}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card loading={isUsersLoading || isIssuesLoading}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Descriptions layout="vertical" column={{ lg: 4, md: 2, sm: 1 }} bordered>
                  <Descriptions.Item label="Experimento" span={4}>
                    {`${issueData?.experiment_id} - ${issueData?.experiment.name}` || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Problema" span={4}>
                    {issueData?.problem || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Gravidade">{handlePriority(issueData?.priority)}</Descriptions.Item>
                  <Descriptions.Item label="Versão">{completeVersion(issueData?.version)}</Descriptions.Item>
                  <Descriptions.Item label="Status">{issueData?.status || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Autor">{issueData?.creator.name || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Responsável">{issueData?.responsible.name || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Ambiente">
                    {issueData?.issueTags.map((tag) => (
                      <TagField value={tag.name} color={getUniqueColor(tag.name)} />
                    ))}
                  </Descriptions.Item>
                  <Descriptions.Item label="Data de Criação">
                    <DateField value={issueData?.created_at} format="DD/MM/YYYY HH:mm" />
                  </Descriptions.Item>
                  <Descriptions.Item label="Data de Atualização">
                    <DateField value={issueData?.updated_at} format="DD/MM/YYYY HH:mm" />
                  </Descriptions.Item>
                  <Descriptions.Item label="Descrição">
                    <Paragraph className="whitespace-pre-wrap text-justify">{issueData?.description || '-'}</Paragraph>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={24}>
                <Card>
                  <Title level={5}>Documentos</Title>
                  <Row gutter={[16, 16]}>
                    {issueData?.issueFiles?.map((file) => (
                      <Col span={3}>
                        <Tooltip title={handleLinkName(file.name)}>{handleExtension(file.name, file.link)}</Tooltip>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Comentários" loading={isUsersLoading || isIssuesLoading}>
            <Form form={form} onFinish={onFinish}>
              <Form.Item name="comment">
                <Input.TextArea rows={5} />
              </Form.Item>
              <Form.Item>
                <Space direction="vertical" className="w-full" align="end">
                  <Button type="primary" htmlType="submit" loading={isCreatingCommentLoading}>
                    Salvar
                  </Button>
                </Space>
              </Form.Item>
            </Form>
            <Divider className="mb-8" />
            <Timeline
              mode="left"
              items={orderBy(issueData?.issueComments, 'created_at', 'desc').map((comments) => ({
                children: (
                  <Space direction="vertical" className="w-full">
                    <Title level={5}>
                      {moment(comments.created_at).calendar()} -{' '}
                      {comments.type === 'Comment' ? handleUser(comments.user_id) : 'Sistema'} comentou:
                    </Title>
                    <Card type="inner">{comments.comment}</Card>
                  </Space>
                ),
                color: comments.type === 'Comment' ? 'blue' : 'gray',
              }))}
            />
          </Card>
        </Col>
      </Row>
      <IssueEdit onClose={edit.onClose} isOpen={edit.isOpen} id={id} />
    </Show>
  );
}
