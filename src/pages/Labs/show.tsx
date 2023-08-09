import {
  BuildOutlined,
  DislikeOutlined,
  IssuesCloseOutlined,
  LikeOutlined,
  LinkOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { cyan, green, purple, tomato } from '@radix-ui/colors';
import { nanoid } from '@reduxjs/toolkit';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import {
  Button,
  Card,
  CardProps,
  Col,
  Divider,
  Empty,
  Grid,
  List,
  Result,
  Row,
  Space,
  Spin,
  Statistic,
  Timeline,
  Tooltip,
  Typography,
} from 'antd';
import parse from 'html-react-parser';
import { forEach, groupBy, orderBy } from 'lodash';
import moment from 'moment';
import { ReactNode, useEffect, useMemo } from 'react';
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import placeholderImage from '../../assets/placeholder-image.jpg';
import { BooleanField, TagField, TextField } from '../../components';
import { Show } from '../../components/crud/show';
import { ImageField } from '../../components/fields/image';
import { UrlField } from '../../components/fields/url';
import { useAppDispatch, useAppSelector } from '../../config/hooks';
import { setTab } from '../../config/reducers/labSlice';
import { handleExtension, handleLinkName } from '../../helpers';
import { completeVersion } from '../../helpers/completeVersion';
import { IFiles } from '../../models/demands.model';
import { DemandStatus } from '../../models/enum/demandStatus.enum';
import {
  ExperimentRelease,
  ExperimentReleaseResponse,
  ExperimentShowResponse,
  useShowExperimentsQuery,
} from '../../services/experiments.service';
import { ReleaseType } from '../../services/releases.service';
import { IssueChart } from './charts';
import { DemandsTable, IssuesTable } from './tables';
import { ReleaseTable } from './tables/versions.table';

const { useBreakpoint } = Grid;

const { Paragraph, Title } = Typography;

export function LabsShow() {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const id = useMemo(() => (params.id ? Number(params.id) : 0), [params.id]);
  const screenSize = useBreakpoint();
  const dispatch = useAppDispatch();

  const { tab } = useAppSelector((state) => state.lab);

  const setActiveTab = (value: string) => {
    dispatch(setTab(value));
  };

  const { data: labData, isLoading, isError, refetch, isFetching } = useShowExperimentsQuery(id || skipToken);
  const items: CardProps['tabList'] = [
    {
      key: 'details',
      label: 'Detalhes',
    },
    {
      key: 'issues',
      label: 'Problemas',
    },
    {
      key: 'demands',
      label: 'Entregas',
    },
    {
      key: 'versions',
      label: 'Lançamentos',
    },
    {
      key: 'changelog',
      label: 'Alterações',
    },
    {
      key: 'files',
      label: 'Arquivos',
    },
  ];

  const handleApproved = ({ demands, issues }: ExperimentShowResponse) => {
    let isApproved = true;

    if (demands.length === 0 && issues.length === 0) {
      isApproved = false;
    }
    const demandsBoolean = demands.map((demand) => demand.status === DemandStatus.READY);
    const approvedIssues = issues.map((issue) => issue.approved);

    if (demandsBoolean.includes(false) || approvedIssues.includes(false)) {
      isApproved = false;
    }

    return (
      <BooleanField
        title={isApproved ? 'Aprovado' : 'Reprovado'}
        value={isApproved}
        trueIcon={<LikeOutlined className="text-emerald-700 text-xl" />}
        falseIcon={<DislikeOutlined className="text-red-700 text-xl" />}
      />
    );
  };

  const handleRelease = (data: ExperimentReleaseResponse[]) => {
    const newReleases: ExperimentRelease[] = [];

    forEach(groupBy(data, 'id'), (data) => {
      const releaseType: ReleaseType[] = [];
      data.forEach((el) => releaseType.push(el.releaseType));
      newReleases.push({ ...data[0], releaseType });
    });
    return newReleases;
  };

  const handleFiles = ({ demands }: ExperimentShowResponse): IFiles[] => {
    const files: IFiles[] = [];

    demands.forEach((demand) => files.push(...demand.files));

    return files;
  };

  const contentList: Record<string, ReactNode> = {
    details: labData ? (
      <Row gutter={[16, 16]}>
        <Col lg={12} md={24} sm={24} xs={24}>
          <Card
            bordered={false}
            className="px-4 pt-4 mb-4"
            actions={[
              <UrlField
                target="_blank"
                className="text-xl"
                value={`https://catalogoalgetec.grupoa.education/details/${labData.id}`}
              >
                {screenSize.lg ? (
                  <>
                    Catálogo <LinkOutlined className="text-cyan-700" />
                  </>
                ) : (
                  <Tooltip title="Catálogo">
                    <LinkOutlined className="text-cyan-700" />
                  </Tooltip>
                )}
              </UrlField>,
              screenSize.lg ? (
                <>
                  <Typography.Text className="text-xl pr-2 text-gray-400">Aprovado:</Typography.Text>
                  {handleApproved(labData)}
                </>
              ) : (
                handleApproved(labData)
              ),
            ]}
            cover={
              labData.image ? (
                <ImageField value={labData.image} imageTitle={labData.name} width="100%" />
              ) : (
                <ImageField value={placeholderImage} preview={false} imageTitle="Sem Imagem" width="100%" />
              )
            }
          />
          <Row gutter={[16, 16]}>
            <Col lg={12} md={12} sm={12} xs={24}>
              <Card bordered={false} className="text-center">
                <Statistic
                  title="Versão em Inglês"
                  value={completeVersion(labData.latest_english_release?.version || '')}
                  valueStyle={{ color: green.green9 }}
                />
              </Card>
            </Col>
            <Col lg={12} md={12} sm={12} xs={24}>
              <Card bordered={false} className="text-center">
                <Statistic
                  title="Versão em Espanhol"
                  value={completeVersion(labData.latest_spanish_release?.version || '')}
                  valueStyle={{ color: green.green9 }}
                />
              </Card>
            </Col>
            <Col lg={12} md={12} sm={12} xs={24}>
              <Card bordered={false} className="text-center">
                <Statistic
                  title="Versão Android"
                  value={completeVersion(labData.latest_android_release?.version || '')}
                  valueStyle={{ color: green.green9 }}
                />
              </Card>
            </Col>
            <Col lg={12} md={12} sm={12} xs={24}>
              <Card bordered={false} className="text-center">
                <Statistic
                  title="Versão WebGL"
                  value={completeVersion(labData.latest_webgl_release?.version || '')}
                  valueStyle={{ color: green.green9 }}
                />
              </Card>
            </Col>
            <Col lg={8} md={24} sm={24} xs={24}>
              <Card bordered={false} className="text-center">
                <Statistic
                  title="Problemas"
                  value={labData.issues.length}
                  valueStyle={{ color: tomato.tomato9 }}
                  prefix={<IssuesCloseOutlined />}
                />
              </Card>
            </Col>
            <Col lg={8} md={24} sm={24} xs={24}>
              <Card bordered={false} className="text-center">
                <Statistic
                  title="Entregas"
                  value={labData.demands.length}
                  valueStyle={{ color: cyan.cyan9 }}
                  prefix={<RocketOutlined />}
                />
              </Card>
            </Col>
            <Col lg={8} md={24} sm={24} xs={24}>
              <Card bordered={false} className="text-center">
                <Statistic
                  title="Lançamentos"
                  value={labData.releases.length}
                  valueStyle={{ color: purple.purple9 }}
                  prefix={<BuildOutlined />}
                />
              </Card>
            </Col>
            <Col span={24}>
              <Card bordered={false}>
                <Space align="center" direction="vertical" className="w-full">
                  <Title level={5}>Problemas por Gravidade</Title>
                </Space>
                {labData.issues?.length ? (
                  <div className="lg:px-16">
                    <IssueChart issues={labData.issues} />
                  </div>
                ) : (
                  <Empty description="Sem problemas" />
                )}
              </Card>
            </Col>
          </Row>
        </Col>

        <Col lg={12} md={24} sm={24} xs={24}>
          <Card bordered={false}>
            {labData.description ? <Paragraph>{parse(labData.description)}</Paragraph> : null}
          </Card>
        </Col>
      </Row>
    ) : null,
    issues: labData?.issues ? <IssuesTable dataSource={labData.issues} loading={isLoading || isFetching} /> : null,
    demands: labData?.demands ? <DemandsTable dataSource={labData.demands} loading={isLoading || isFetching} /> : null,
    versions: labData?.releases ? (
      <ReleaseTable dataSource={labData.releases} loading={isLoading || isFetching} />
    ) : null,
    changelog: labData?.releases.length ? (
      <Timeline
        mode="alternate"
        items={orderBy(handleRelease(labData.releases), 'created_at', 'desc').map((release) => ({
          label: <Title level={5}>{moment(release.created_at).calendar()}</Title>,
          children: (
            <Card key={nanoid()} title={completeVersion(release.version)}>
              <Space>
                {release.releaseType.map((type) => (
                  <TagField key={nanoid()} value={type.name} color={type.color} />
                ))}
              </Space>

              {release.description ? <Divider /> : null}
              <Paragraph
                className="text-justify"
                ellipsis={{
                  rows: 2,
                  expandable: true,
                  symbol: 'mais',
                }}
              >
                {release.description}
              </Paragraph>
              <Divider />
              <TextField className="italic text-gray-400" value={`"${release.author.name}"`} />
            </Card>
          ),
        }))}
      />
    ) : (
      <Empty />
    ),
    files: labData?.demands.length ? (
      <List
        grid={{ gutter: 16, column: 2, lg: 2, md: 1 }}
        dataSource={handleFiles(labData)}
        renderItem={(item) => (
          <List.Item key={nanoid()}>
            <Card>
              <Row>
                <Col span={18}>
                  <List.Item.Meta
                    title={`Enviado por ${item.user.name}`}
                    description={moment(item.created_at).calendar()}
                  />
                  <UrlField target="_blank" value={item.link}>
                    {handleLinkName(item.name)}
                  </UrlField>
                </Col>
                <Col span={6}>
                  <Button block className="h-full" icon={handleExtension(item.name)} />
                </Col>
              </Row>
            </Card>
          </List.Item>
        )}
      />
    ) : (
      <Empty />
    ),
  };

  useEffect(() => {
    const params = createSearchParams({ tab });
    setSearchParams(params);
  }, [tab]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, []);

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
    <Show
      resource="labs"
      title="Laboratórios"
      refetch={refetch}
      editUrl={`https://catalogoalgetec.grupoa.education/dashboard/experiments/edit?id=[${id}]`}
    >
      <Row gutter={[16, 16]}>
        {labData ? (
          <Col span={24}>
            <Card
              tabList={items}
              loading={isLoading}
              className="h-fit w-full"
              title={`${labData.id} - ${labData.name}`}
              activeTabKey={tab}
              onTabChange={setActiveTab}
            >
              {contentList[tab]}
            </Card>
          </Col>
        ) : null}
      </Row>
    </Show>
  );
}
