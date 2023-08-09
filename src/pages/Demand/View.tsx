// noinspection JSIgnoredPromiseFromCall

import { PlusOutlined, StopOutlined } from '@ant-design/icons';
import { nanoid } from '@reduxjs/toolkit';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import {
  Button,
  Card,
  Col,
  Collapse,
  Descriptions,
  Grid,
  List,
  message,
  Popconfirm,
  Progress,
  Row,
  Tooltip,
  Typography,
} from 'antd';
import { CardTabListType } from 'antd/es/card';
import { groupBy } from 'lodash';
import moment from 'moment';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useParams } from 'react-router-dom';
import { useComponentSize } from 'react-use-size';
import { TagField, TextField } from '../../components';
import { Show } from '../../components/crud/show';
import { UrlField } from '../../components/fields/url';
import { getUniqueColor, handleError, handleStringDate, handleTypeName } from '../../helpers';
import { useDisclosure } from '../../hooks/useDisclosure';
import { Demand } from '../../models/demands.model';
import { useGetDemandByIdQuery, useInactiveLogByIdMutation } from '../../services/demands.service';
import { AddLog } from './Log';

const { useBreakpoint } = Grid;
const { Panel } = Collapse;

export function DemandsView() {
  const { id } = useParams();
  const [toast, contextHolder] = message.useMessage();
  const { data: demandData, isLoading, refetch } = useGetDemandByIdQuery(Number(id) || skipToken);
  const create = useDisclosure();
  const [alterLog, { isLoading: alterLogIsLoading, isError, isSuccess, error }] = useInactiveLogByIdMutation();
  const demand = useMemo(() => (demandData ? new Demand(demandData).toProduction() : null), [demandData]);
  const [activeTabKey, setActiveTabKey] = useState<string>('details');
  const groupDemandLogsByType = useMemo(() => groupBy(demand?.logs, 'type'), [demand]);
  const [type, setType] = useState<string>('');
  const [startedAt, setStartedAt] = useState('');
  const screenSize = useBreakpoint();
  const { ref, width } = useComponentSize();

  const handleDeadline = (value: number | undefined) => {
    if (!value) return '';
    let hours = Number(value);
    const days = Math.floor(hours / 24);
    hours -= days * 24;
    if (days === 0) {
      return `${hours} horas`;
    }
    return hours > 0 ? `${days} dias e ${hours} horas` : `${days} dias`;
  };

  const onFinish = (id: number) => {
    alterLog({ id, active: false });
  };

  const onTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const tabList: CardTabListType[] = [
    {
      key: 'details',
      label: 'Detalhes',
    },
    {
      key: 'history',
      label: 'Histórico',
    },
  ];

  const contentList: Record<string, ReactNode> = {
    details: (
      <Row gutter={[16, 16]}>
        <Col span={24} ref={ref}>
          {/* eslint-disable-next-line no-nested-ternary */}
          <Descriptions
            layout={screenSize.lg || screenSize.md || screenSize.xl ? 'horizontal' : 'vertical'}
            column={1}
            bordered
          >
            <Descriptions.Item label="Experimento">
              <UrlField
                style={{
                  maxWidth: width - 70,
                }}
                ellipsis
                value={`/labs/show/${demandData?.experiment_id}`}
                target="_blank"
              >
                {demandData?.experiments.name}
              </UrlField>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <TagField value={demandData?.status} color={getUniqueColor(demandData?.status || '')} />
            </Descriptions.Item>
            <Descriptions.Item label="Instituição">
              <TextField value={demandData?.institutions.name} />
            </Descriptions.Item>
            <Descriptions.Item label="Autor">
              <TextField value={demandData?.creator?.name || '-'} />
            </Descriptions.Item>
            <Descriptions.Item label="Tags">
              {demandData?.demandTags?.map((tag) => (
                <TagField key={nanoid()} value={tag.name} color={getUniqueColor(tag.name)} />
              ))}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={24}>
          {demand && demand.issues.length ? (
            <List
              grid={{ gutter: 2, xs: 1, sm: 2, md: 2, column: 2 }}
              dataSource={demand.issues}
              renderItem={(item) => (
                <List.Item key={nanoid()} className="w-full">
                  <Card className="w-full" title={item.title}>
                    <Typography.Text>{item.approved}</Typography.Text>
                    <br />
                    <Typography.Text>{item.status}</Typography.Text>
                  </Card>
                </List.Item>
              )}
            />
          ) : null}
        </Col>
        {demand?.production.map((card) => (
          <Col sm={24} xs={24} md={24} xl={12} key={nanoid()}>
            <Card className="h-full">
              <Descriptions
                title={card.type}
                layout={screenSize.lg || screenSize.md ? 'horizontal' : 'vertical'}
                bordered
                column={1}
              >
                <Descriptions.Item label="Início">
                  {card.started_at ? card.started_at : 'Não iniciado'}
                </Descriptions.Item>
                <Descriptions.Item label="Fim">
                  {card.finished_at ? card.finished_at : 'Não finalizado'}
                </Descriptions.Item>
                <Descriptions.Item label="Prazo">{handleDeadline(card.deadline)}</Descriptions.Item>
                <Descriptions.Item label="Progresso">
                  <Progress percent={card.progress} />
                </Descriptions.Item>
                <Descriptions.Item label="Responsável">{card.responsible}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        ))}
      </Row>
    ),
    history: (
      <Collapse>
        {Object.entries(groupDemandLogsByType).map(([key, logs]) => (
          <Panel header={handleTypeName(key)} key={nanoid()}>
            <Row>
              <Col lg={20} md={24} sm={24} xs={24}>
                <Typography.Title level={4}>{handleTypeName(key)}</Typography.Title>
              </Col>
              <Col lg={4} md={24} sm={24} xs={24}>
                <Button
                  onClick={() => {
                    const lastLog = logs.sort(
                      (a, b) => moment(b.created_at).valueOf() - moment(a.created_at).valueOf(),
                    )[0];
                    setStartedAt(lastLog.started_at);
                    setType(key);
                    create.onOpen();
                  }}
                  icon={<PlusOutlined />}
                  type="primary"
                />
              </Col>
              <Col span={24}>
                {logs
                  .filter((filter) => filter.active)
                  .map((log, index, array) => {
                    const nextIndex = index + 1;
                    const afterLog = nextIndex === array.length ? null : array[nextIndex];
                    return (
                      <Descriptions
                        key={nanoid()}
                        layout={screenSize.lg || screenSize.md ? 'horizontal' : 'vertical'}
                        bordered
                        title={`Data de Atualização: ${moment(log.updated_at).format('DD/MM/YYYY HH:mm:ss')}`}
                        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                        extra={
                          array.length > 1 ? (
                            <Tooltip title="Inativar log" placement="bottom">
                              <Popconfirm
                                title="Inativar log"
                                description="Tem certeza que quer inativar esse log??"
                                okText="Sim"
                                cancelText="Não"
                                okButtonProps={{
                                  danger: true,
                                  loading: alterLogIsLoading,
                                }}
                                onConfirm={() => {
                                  onFinish(log.id);
                                }}
                              >
                                <Button danger icon={<StopOutlined />} />
                              </Popconfirm>
                            </Tooltip>
                          ) : undefined
                        }
                      >
                        <Descriptions.Item label="Data de Criação">
                          {handleStringDate(log.created_at, 'llll')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Data de Início">
                          {afterLog && log.started_at !== afterLog.started_at ? (
                            <Highlighter
                              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                              searchWords={[handleStringDate(log.started_at, 'llll') || '']}
                              autoEscape
                              textToHighlight={handleStringDate(log.started_at, 'llll') || ''}
                            />
                          ) : (
                            handleStringDate(log.started_at, 'llll')
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Data de Encerramento">
                          {afterLog && log.finished_at !== afterLog.finished_at ? (
                            <Highlighter
                              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                              searchWords={[handleStringDate(log.finished_at, 'llll') || '']}
                              autoEscape
                              textToHighlight={handleStringDate(log.finished_at, 'llll') || ''}
                            />
                          ) : (
                            handleStringDate(log.finished_at, 'llll')
                          )}
                        </Descriptions.Item>

                        <Descriptions.Item label="Prazo">
                          {afterLog && log.deadline !== afterLog.deadline ? (
                            <Highlighter
                              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                              searchWords={[handleDeadline(log.deadline)]}
                              autoEscape
                              textToHighlight={handleDeadline(log.deadline)}
                            />
                          ) : (
                            handleDeadline(log.deadline)
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Progresso">
                          {afterLog && log.progress !== afterLog.progress ? (
                            <Highlighter
                              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                              searchWords={[`${log.progress}%`]}
                              autoEscape
                              textToHighlight={`${log.progress}%`}
                            />
                          ) : (
                            `${log.progress}%`
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tipo">
                          {afterLog && log.type !== afterLog.type ? (
                            <Highlighter
                              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                              searchWords={[handleTypeName(log.type)]}
                              autoEscape
                              textToHighlight={handleTypeName(log.type)}
                            />
                          ) : (
                            handleTypeName(log.type)
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Atualizado por">
                          {afterLog && log.logger.name !== afterLog.logger.name ? (
                            <Highlighter
                              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                              searchWords={[log.logger.name]}
                              autoEscape
                              textToHighlight={log.logger.name}
                            />
                          ) : (
                            log.logger.name
                          )}
                        </Descriptions.Item>
                      </Descriptions>
                    );
                  })}
              </Col>
            </Row>
          </Panel>
        ))}
      </Collapse>
    ),
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('Log alterado com sucesso');
    }
    if (isError && error && 'data' in error) {
      const errorMessage = handleError(error);
      toast.error(errorMessage);
    }
  }, [isError, isSuccess]);

  return (
    <Show resource="demands" refetch={refetch} title="Entregas">
      <Card
        title={!isLoading ? `${demand?.id} - ${demand?.experimentName}` : null}
        loading={isLoading}
        tabList={tabList}
        activeTabKey={activeTabKey}
        onTabChange={onTabChange}
      >
        {contextHolder}
        {contentList[activeTabKey]}
        <AddLog
          onClose={create.onClose}
          open={create.isOpen}
          demandId={Number(id)}
          type={type}
          lastStartedAt={startedAt}
        />
      </Card>
    </Show>
  );
}
