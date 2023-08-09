import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { PRIORITY } from '../../../models/enum/priority.enum';
import { ExperimentIssue } from '../../../services/experiments.service';

ChartJS.register(ArcElement, Tooltip, Legend);

interface IssueChartProps {
  issues: ExperimentIssue[];
}

export function IssueChart({ issues }: IssueChartProps) {
  const handleIssues = () => {
    let normal = 0;
    let low = 0;
    let high = 0;
    let critical = 0;

    issues.forEach((issue) => {
      switch (issue.priority) {
        case PRIORITY.LOW:
          low += 1;
          break;
        case PRIORITY.NORMAL:
          normal += 1;
          break;
        case PRIORITY.HIGH:
          high += 1;
          break;
        case PRIORITY.CRITICAL:
          critical += 1;
          break;
        default:
          break;
      }
    });

    return [low, normal, high, critical];
  };

  const data = {
    labels: ['Baixa', 'Normal', 'Alta', 'Critica'],
    datasets: [
      {
        data: handleIssues(),
        backgroundColor: [
          'rgba(98, 196, 80, 0.3)',
          'rgba(255, 216, 39, 0.3)',
          'rgba(247, 141, 55, 0.3)',
          'rgba(212, 42, 52, 0.3)',
        ],
        borderColor: ['rgba(98, 196, 80, 1)', 'rgba(255, 216, 39, 1)', 'rgba(247, 141, 55, 1)', 'rgba(212, 42, 52, 1)'],
        borderWidth: 2,
      },
    ],
  };
  return <Pie data={data} options={{ responsive: true, maintainAspectRatio: false }} height={300} />;
}
