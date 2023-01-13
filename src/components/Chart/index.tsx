import { ApexOptions } from 'apexcharts';
import ptBr from 'apexcharts/dist/locales/pt-br.json';
import { ComponentProps, useMemo } from 'react';
import ApexChart from 'react-apexcharts';

type ApexChartProps = ComponentProps<typeof ApexChart>;

type ChartProps = {
  series: ApexChartProps['series'];
  categories: string[];
  text: string;
  dashArray?: number[];
};

export function Chart({ categories, series, text, dashArray }: ChartProps) {
  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        id: 'basic-line',
        locales: [ptBr],
        defaultLocale: 'pt-br',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
        dashArray,
      },
      xaxis: {
        categories,
      },
      yaxis: {
        title: {
          text,
        },
      },
    }),
    [],
  );

  return <ApexChart options={chartOptions} series={series} type="line" width="250%" />;
}

Chart.defaultProps = {
  dashArray: undefined,
};
