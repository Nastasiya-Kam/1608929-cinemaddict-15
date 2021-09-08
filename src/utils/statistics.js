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

// Функция нахождения уникальных данных в массиве и функция определения кол-ва вхождений каждого элемента
// Взято: https://github.com/htmlacademy-ecmascript/taskmanager-15/pull/7/commits/929cfcecd2d39e0612261eb5e4075e5531f94ef3
const makeItemsUniq = (items) => [...new Set(items)];
const countFilmsByGenre = (genresTypes, genre) => genresTypes.filter((type) => type === genre).length;

export {StatisticType, Statistics, makeItemsUniq, countFilmsByGenre};
