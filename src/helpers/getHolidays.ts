import dayjs, { Dayjs } from 'dayjs';

export interface IHoliday {
  date: Dayjs;
  description: string;
  name: string;
  type: 'NATIONAL' | 'STATE' | 'LOCAL' | 'OPTIONAL';
  uf?: string;
  city?: string;
}

const calculateEaster = (year: number) => {
  const C = Math.floor(year / 100);
  const N = year - 19 * Math.floor(year / 19);
  const K = Math.floor((C - 17) / 25);
  let I = C - Math.floor(C / 4) - Math.floor((C - K) / 3) + 19 * N + 15;
  I -= 30 * Math.floor(I / 30);
  I -= Math.floor(I / 28) * (1 - Math.floor(I / 28) * Math.floor(29 / (I + 1)) * Math.floor((21 - N) / 11));
  let J = year + Math.floor(year / 4) + I + 2 - C + Math.floor(C / 4);
  J -= 7 * Math.floor(J / 7);
  const L = I - J;
  const M = 3 + Math.floor((L + 40) / 44);
  const D = L + 28 - 31 * Math.floor(M / 4);
  const month = M < 10 ? `0${M}` : M;
  const day = D < 10 ? `0${D}` : D;
  const EasterDate = `${year}-${month}-${day}`;
  return dayjs(EasterDate);
};

const calculateCorpusChristi = (EasterDate: Dayjs) => EasterDate.clone().add(60, 'd');

const calculateCarnival = (EasterDate: Dayjs) => EasterDate.clone().add(-47, 'd');

const calculateGodsFriday = (EasterDate: Dayjs) => EasterDate.clone().add(-2, 'd');

export const getHolidays = (year: number): IHoliday[] => {
  const EasterDate = calculateEaster(year);
  const corpusChristiDate = calculateCorpusChristi(EasterDate);
  const carnivalDate = calculateCarnival(EasterDate);
  const godsFridayDate = calculateGodsFriday(EasterDate);

  const collectiveVacation = {
    start: dayjs('2023-12-26'),
    finish: dayjs('2024-01-07'),
  };
  const vacationsDayDiff = collectiveVacation.finish.diff(collectiveVacation.start, 'd');
  const vacationsArray: Dayjs[] = [];

  let vacationsCount = 0;

  while (vacationsCount <= vacationsDayDiff) {
    vacationsArray.push(collectiveVacation.start.clone().add(vacationsCount, 'd'));
    vacationsCount += 1;
  }

  return [
    {
      date: EasterDate,
      description:
        'Páscoa ou Domingo da Ressurreição é uma festividade religiosa e um feriado que celebra a ressurreição de Jesus ocorrida três dias depois da sua crucificação no Calvário, conforme o relato do Novo Testamento.',
      type: 'NATIONAL',
      name: 'Páscoa',
    },
    {
      date: corpusChristiDate,
      description:
        'Corpus Christi (expressão latina que significa Corpo de Cristo), generalizada em Portugal como Corpo de Deus é um evento baseado em tradições católicas realizado na quinta-feira seguinte ao domingo da Santíssima Trindade, que, por sua vez, acontece no domingo seguinte ao de Pentecostes.',
      type: 'NATIONAL',
      name: 'Corpus Christi',
    },
    {
      date: carnivalDate,
      description:
        'Carnaval é um festival do cristianismo ocidental que ocorre antes da estação litúrgica da Quaresma. Os principais eventos ocorrem tipicamente durante fevereiro ou início de março, durante o período historicamente conhecido como Tempo da Septuagésima (ou pré-quaresma).',
      type: 'NATIONAL',
      name: 'Carnaval',
    },
    {
      date: godsFridayDate,
      description:
        'Sexta-feira Santa ou Sexta-Feira da Paixão é uma data religiosa cristã que relembra a crucificação de Jesus Cristo e sua morte no Calvário. O feriado é observado sempre na sexta-feira que antecede o Domingo de Páscoa.',
      type: 'NATIONAL',
      name: 'Sexta-feira Santa',
    },
    {
      date: dayjs(`${String(year)}-01-01`),
      description:
        'O Dia da Fraternidade Universal ou Dia da Confraternização Universal é um feriado nacional no Brasil, comemorado no dia 1 de janeiro. Foi instituído por lei em 1935, por Getúlio Vargas.',
      type: 'NATIONAL',
      name: 'Ano Novo',
    },
    {
      date: dayjs(`${String(year)}-04-21`),
      description:
        'Joaquim José da Silva Xavier, o Tiradentes, foi um dentista, tropeiro, minerador, comerciante, militar e ativista político que atuou no Brasil. O dia de sua execução, 21 de abril, é feriado nacional.',
      type: 'NATIONAL',
      name: 'Tiradentes',
    },
    {
      date: dayjs(`${String(year)}-05-01`),
      description:
        'O Dia do Trabalhador, Dia do Trabalho ou Dia Internacional dos Trabalhadores é celebrado anualmente no dia 1º de maio em numerosos países do mundo, sendo feriado no Brasil, em Portugal, Angola, Moçambique e outros países.',
      type: 'NATIONAL',
      name: 'Dia do Trabalhador',
    },
    {
      date: dayjs(`${String(year)}-09-07`),
      description:
        'Independência do Brasil é um processo que se estende de 1821 a 1825 e coloca em violenta oposição o Reino do Brasil e o Reino de Portugal, dentro do Reino Unido de Portugal, Brasil e Algarves.',
      type: 'NATIONAL',
      name: 'Independência do Brasil',
    },
    {
      date: dayjs(`${String(year)}-10-12`),
      description:
        'Nossa Senhora da Conceição Aparecida, popularmente chamada de Nossa Senhora Aparecida, é a padroeira do Brasil. Sua festa litúrgica é celebrada em 12 de outubro, um feriado nacional no Brasil desde 1980.',
      type: 'NATIONAL',
      name: 'Nossa Senhora Aparecida',
    },
    {
      date: dayjs(`${String(year)}-11-02`),
      description:
        'Dia dos Fiéis Defuntos ou Dia de Finados (conhecido ainda como Dia dos Mortos no México) é celebrado pela Igreja Católica no dia 2 de novembro.',
      type: 'NATIONAL',
      name: 'Dia de Finados',
    },
    {
      date: dayjs(`${String(year)}-11-15`),
      description:
        'A Proclamação da República Brasileira foi um levante político-militar ocorrido em 15 de novembro de 1889 que instaurou a forma republicana federativa presidencialista do governo no Brasil, derrubando a monarquia constitucional parlamentarista do Império do Brasil e, por conseguinte, pondo fim à soberania do imperador D. Pedro II. Foi, então, proclamada a República do Brasil.',
      type: 'NATIONAL',
      name: 'Proclamação da República',
    },
    {
      date: dayjs(`${String(year)}-12-25`),
      description:
        'Natal ou Dia de Natal é um feriado e festival religioso cristão comemorado anualmente em 25 de dezembro. A data é o centro das festas de fim de ano e da temporada de férias, sendo, no cristianismo, o marco inicial do Ciclo do Natal, que dura doze dias.',
      type: 'NATIONAL',
      name: 'Natal',
    },
    {
      uf: 'BA',
      date: dayjs(`${String(year)}-07-02`),
      description: 'Independência da Bahia (Data magna do estado) - Art. 6º, § 3º da Constituição estadual',
      type: 'STATE',
      name: 'Independência da Bahia',
    },
    {
      uf: 'BA',
      date: dayjs(`${String(year)}-08-12`),
      description: 'Dia de Nossa Senhora da Conceição conforme Lei Municipal nº 1997 de 21 de junho de 1967',
      name: 'Nossa Senhora da Conceição',
      type: 'LOCAL',
    },
    {
      uf: 'BA',
      date: dayjs(`${String(year)}-06-24`),
      description: 'Festa de São João (Festa Junina) conforme Lei Municipal nº 1997 de 21 de junho de 1967',
      name: 'São João',
      type: 'LOCAL',
    },
    {
      uf: 'BA',
      date: dayjs(`${String(year)}-06-23`),
      description: 'Festa de São João (Festa Junina) conforme Lei Municipal nº 1997 de 21 de junho de 1967',
      name: 'São João',
      type: 'OPTIONAL',
    },
    ...vacationsArray.map<IHoliday>((el) => ({
      uf: 'BA',
      date: el,
      description: 'Férias Coletivas',
      name: 'Férias',
      type: 'NATIONAL',
    })),
  ];
};

export const isHoliday = (givenDate: Dayjs) => {
  const nationalHolidays = getHolidays(givenDate.year());
  if (!givenDate.isValid()) {
    return false;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const holiday of nationalHolidays) {
    if (holiday.date.isSame(givenDate, 'day')) {
      return holiday;
    }
  }
  return false;
};
