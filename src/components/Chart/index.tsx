import { ApexOptions } from 'apexcharts';
import ptBr from 'apexcharts/dist/locales/pt-br.json';
import { ComponentProps, useMemo } from 'react';
import ApexChart from 'react-apexcharts';
import { useComponentSize } from 'react-use-size';

export type ApexChartProps = ComponentProps<typeof ApexChart>;

type ChartProps = {
  series: ApexChartProps['series'];
  categories: string[];
  text: string;
  dashArray?: number[];
};

export function LineChart({ categories, series, text, dashArray }: ChartProps) {
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
    [categories, text, dashArray],
  );

  return <ApexChart options={chartOptions} series={series} type="line" />;
}

LineChart.defaultProps = {
  dashArray: undefined,
};

interface RadialChartProps {
  series: ApexChartProps['series'];
}

export function RadialChart({ series }: RadialChartProps) {
  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        id: 'radialBar',
        locales: [ptBr],
        defaultLocale: 'pt-br',
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            },
          },
        },
      },
      labels: ['Roteirização', 'Programação', 'Testes', 'UALAB', 'Modelagem'],
      legend: {
        show: true,
        floating: true,
        fontSize: '16px',
        position: 'left',
        offsetX: 160,
        offsetY: 15,
        labels: {
          useSeriesColors: true,
        },
        formatter(seriesName, opts) {
          return `${seriesName}:  ${opts.w.globals.series[opts.seriesIndex]}`;
        },
      },
    }),
    [],
  );
  return <ApexChart options={chartOptions} series={series} type="radialBar" width="100%" height={500} />;
}

interface DateTimeChartProps {
  series: ApexChartProps['series'];
}

export function DateTimeChart({ series }: DateTimeChartProps) {
  const options = useMemo<ApexOptions>(
    () => ({
      chart: {
        id: 'area-datetime',
        locales: [ptBr],
        defaultLocale: 'pt-br',
        type: 'area',
        zoom: {
          autoScaleYaxis: true,
        },
        height: 350,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      markers: {
        size: 0,
        style: 'hollow',
      },
      xaxis: {
        type: 'datetime',
        tickAmount: 6,
        labels: {
          datetimeUTC: false,
        },
      },
      yaxis: {
        title: { text: 'Trabalho restante (%)', offsetX: 0, offsetY: 0 },
      },
      tooltip: {
        x: {
          format: 'dd MMMM yyyy HH:mm',
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.1,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
    }),
    [],
  );

  const { ref, width } = useComponentSize();

  return (
    <div ref={ref} className="w-full">
      <ApexChart options={options} series={series} type="area" width={width} />
    </div>
  );
}
