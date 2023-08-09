import dayjs from 'dayjs';
import moment from 'moment';

import { isBusinessDay } from '../helpers';

export interface Log {
  taskStartDateTime: string; // Data de início da demanda
  taskEndDateTime: string; // Data de término da demanda
  taskProgress: number; // Progresso da demanda
  logDateTime: string; // Data do log
}

interface PointRemaining {
  x: Date;
  y_remainingWork: number;
}

interface ChartData {
  idealBurn: PointRemaining[];
  actualBurn: PointRemaining[];
  idealSpeed: number;
  actualSpeed: number;
}

interface PointWorkDone {
  x: Date;
  y_workDone: number;
}

/* --------------------------------------------------------------------------
 */
/*                                 Algoritmo;                                 */
/* -------------------------------------------------------------------------- */

const getNonWorkingDaysBetweenDates = (startDate: Date, endDate: Date) => {
  let nonWorkingDays = 0;

  const currentDate = moment(startDate).clone();

  while (currentDate.isSameOrBefore(endDate)) {
    if (!isBusinessDay(dayjs(currentDate.toDate()))) {
      nonWorkingDays += 1;
    }
    currentDate.add(1, 'day');
  }

  return nonWorkingDays;
};

const workingDaysIntervalBetweenDates = (startDate: Date, endDate: Date) => {
  const nonWorkingDays = getNonWorkingDaysBetweenDates(startDate, endDate);
  return dayjs(endDate).diff(startDate) / (1000 * 60 * 60 * 24) - nonWorkingDays;
};

const idealRemainingWork = (
  previousRemainingWork: number,
  previousDateTime: Date,
  currentDateTime: Date,
  currentTaskEndDateTime: Date,
) => {
  const taskDuration = workingDaysIntervalBetweenDates(previousDateTime, currentTaskEndDateTime);
  const idealSpeed = previousRemainingWork / taskDuration;
  const timeBetween = workingDaysIntervalBetweenDates(previousDateTime, currentDateTime);
  return previousRemainingWork - idealSpeed * timeBetween;
};

function last<T>(arr: T[]) {
  return arr[arr.length - 1];
}

const getIdealDeliveryLog = (lastLog: Log) => {
  const log: Log = {
    taskStartDateTime: lastLog.taskStartDateTime,
    taskEndDateTime: lastLog.taskEndDateTime,
    taskProgress: 100,
    logDateTime: moment(lastLog.taskEndDateTime).toISOString(),
  };
  return log;
};

function sortByLogDate(): ((a: Log, b: Log) => number) | undefined {
  return (a, b) => {
    const aDate = moment(a.logDateTime).toDate();
    const bDate = moment(b.logDateTime).toDate();
    return aDate.getTime() - bDate.getTime();
  };
}

function removeDuplicates(remainingWorkPoints: PointRemaining[]): PointRemaining[] {
  // Cria um "Map" para armazenar pontos únicos com base em sua data x
  const map = new Map<string, PointRemaining>();
  // Percorre o vetor de trás para frente para garantir que o último ponto com x duplicado seja mantido
  for (let i = remainingWorkPoints.length - 1; i >= 0; i -= 1) {
    const point = remainingWorkPoints[i];
    // Converte a data x em uma string para usar como chave no Map
    const key = point.x.toISOString();
    // Se o "Map" ainda não tem uma entrada para esse valor x, adiciona o ponto ao Map
    if (!map.has(key)) {
      map.set(key, point);
    }
  }
  // Converte o "Map" em um vetor e retorna o resultado
  return Array.from(map.values()).reverse();
}

function toRemainingWorkingPoints(): (
  previousValue: PointRemaining[],
  currentValue: Log,
  currentIndex: number,
  array: Log[],
) => PointRemaining[] {
  return (points: PointRemaining[], log: Log, index: number) => {
    if (index === 0) {
      const startingPoints: PointRemaining[] = [
        {
          x: moment(log.taskStartDateTime).toDate(),
          y_remainingWork: 100,
        },
      ];
      return startingPoints;
    }
    const logDate = moment(log.logDateTime).toDate();
    const startDate = moment(log.taskStartDateTime).toDate();
    const endDate = moment(log.taskEndDateTime).toDate();
    if (logDate.getTime() < startDate.getTime() || logDate.getTime() > endDate.getTime()) {
      return points;
    }
    return points.concat({
      x: logDate,
      y_remainingWork: idealRemainingWork(
        last(points).y_remainingWork,
        last(points).x,
        logDate,
        moment(log.taskEndDateTime).toDate(),
      ),
    });
  };
}

function roundAndKeepPositive(chartData: ChartData): ChartData {
  return {
    idealBurn: chartData.idealBurn.map((point) => ({
      x: point.x,
      y_remainingWork: Math.max(0, Math.round(point.y_remainingWork * 10) / 10),
    })),
    actualBurn: chartData.actualBurn.map((point) => ({
      x: point.x,
      y_remainingWork: Math.max(0, Math.round(point.y_remainingWork * 10) / 10),
    })),
    idealSpeed: Math.max(0, Math.round(chartData.idealSpeed * 10) / 10),
    actualSpeed: Math.max(0, Math.round(chartData.actualSpeed * 10) / 10),
  };
}

export default function burningDownChart(logs: Log[]): ChartData {
  // Cada entrada do log será um ponto no gráfico.
  // O progresso da demanda será a altura do ponto.
  // A data do log será a posição do ponto no eixo X.
  // Além desses pontos, há o ponto final que corresponde ao prazo final da demanda
  // considerando um avanço linear do progresso (ideal).
  // O ponto final é o ponto de referência para o cálculo do atraso.
  const logsOrderedByDate = logs.length <= 1 ? logs : logs.sort(sortByLogDate()).slice(1);
  const lastLog = last(logsOrderedByDate);
  const idealStartLog: Log[] = [
    {
      taskStartDateTime: lastLog.taskStartDateTime,
      taskEndDateTime: lastLog.taskEndDateTime,
      taskProgress: 0,
      logDateTime: lastLog.taskStartDateTime,
    },
  ];
  const idealRemainingWorkPoints = idealStartLog
    .concat(getIdealDeliveryLog(lastLog))
    .reduce(toRemainingWorkingPoints(), []);
  const idealRemainingWorkPointsFixed = removeDuplicates(idealRemainingWorkPoints);
  // Pontos de trabalho real
  const actualRemainingWorkPoints: PointRemaining[] = logsOrderedByDate.map((log) => ({
    x: moment(log.logDateTime).toDate(),
    y_remainingWork: 100 - log.taskProgress,
  }));
  const actualRemainingWorkPointsFixed = removeDuplicates(actualRemainingWorkPoints);
  // Velocidade ideal
  const idealWorkingPoints: PointWorkDone[] = idealRemainingWorkPointsFixed.map((point) => ({
    x: point.x,
    y_workDone: 100 - point.y_remainingWork,
  }));
  const idealWorkBetweenPoints = idealWorkingPoints.map((point, index) => {
    if (index === 0) {
      return 0;
    }
    return point.y_workDone - idealWorkingPoints[index - 1].y_workDone;
  });
  const idealTimeBetweenPoints = idealWorkingPoints.map((point, index) => {
    if (index === 0) {
      return 0;
    }
    return workingDaysIntervalBetweenDates(idealWorkingPoints[index - 1].x, point.x);
  });
  const idealSpeed =
    idealWorkBetweenPoints.reduce((sum, value) => sum + value, 0) /
    idealTimeBetweenPoints.reduce((sum, value) => sum + value, 0);
  // Velocidade real
  const actualWorkingPoints: PointWorkDone[] = actualRemainingWorkPointsFixed.map((point) => ({
    x: point.x,
    y_workDone: 100 - point.y_remainingWork,
  }));
  const actualWorkBetweenPoints = actualWorkingPoints.map((point, index) => {
    if (index === 0) {
      return 0;
    }
    return point.y_workDone - actualWorkingPoints[index - 1].y_workDone;
  });
  const actualTimeBetweenPoints = actualWorkingPoints.map((point, index) => {
    if (index === 0) {
      return 0;
    }
    return workingDaysIntervalBetweenDates(actualWorkingPoints[index - 1].x, point.x);
  });
  const actualSpeed =
    actualWorkBetweenPoints.length === 1
      ? 0
      : actualWorkBetweenPoints.reduce((sum, value) => sum + value, 0) /
        actualTimeBetweenPoints.reduce((sum, value) => sum + value, 0);
  // Retorno
  const chartData: ChartData = {
    actualBurn: actualRemainingWorkPointsFixed,
    idealBurn: idealRemainingWorkPointsFixed,
    actualSpeed,
    idealSpeed,
  };
  return roundAndKeepPositive(chartData);
}
