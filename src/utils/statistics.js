const StatisticType = {
  ALL: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

const Statistics = [
  {
    type: StatisticType.ALL,
    text: 'All time',
  },
  {
    type: StatisticType.TODAY,
    text: 'Today',
  },
  {
    type: StatisticType.WEEK,
    text: 'Week',
  },
  {
    type: StatisticType.MONTH,
    text: 'Month',
  },
  {
    type: StatisticType.YEAR,
    text: 'Year',
  },
];

export {StatisticType, Statistics};
