import { nanoid } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Center, DashboardComponent, Flex, Spinner, Text, Title } from '../../components';
import { Card } from '../../components/Card';
import { Separator } from '../../components/Separator';
import { Demand } from '../../models/demands.model';
import { useGetDemandByIdQuery } from '../../services/demands.service';

export function ProductionPage() {
  const params = useParams();
  const id = useMemo(() => (params.id ? params.id : ''), [params]);
  const { data: demandData, isLoading } = useGetDemandByIdQuery(Number(id), {
    skip: !id,
  });

  const demand = useMemo(() => (demandData ? new Demand(demandData).toProduction() : null), [demandData]);

  if (!demand) {
    return (
      <Center
        css={{
          height: '100%',
        }}
      >
        <Spinner />
      </Center>
    );
  }

  return (
    <DashboardComponent isLoading={isLoading}>
      <Flex
        css={{
          width: '100%',
          flexDirection: 'column',
        }}
      >
        <Box>
          <Title size="extraLarge">{demand.experimentName}</Title>
          <Separator />
          <Text size="normal">Status: {demand.status}</Text>
        </Box>

        <Box
          css={{
            display: 'grid',
            marginTop: '$sm',
            gap: '$lg',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gridGap: '$md',
          }}
        >
          {demand.production.map((card) => (
            <Card
              key={nanoid()}
              css={{
                width: '100%',
              }}
            >
              <Title size="large">{card.type}</Title>
              <Text>Responsável: {card.responsible}</Text>
              <Text>Início: {card.started_at ? card.started_at : 'Não iniciado'}</Text>
              <Text>Fim: {card.finished_at ? card.finished_at : 'Não finalizado'}</Text>
              <Text>Prazo: {card.deadline} dias úteis</Text>
              <Text>Progresso: {card.progress}%</Text>
            </Card>
          ))}
        </Box>
      </Flex>
    </DashboardComponent>
  );
}
