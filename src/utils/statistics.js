import dayjs from 'dayjs';

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

const sortGenre = (genreA, genreB) => {
  const genreCountA = genreA[1];
  const genreCountB = genreB[1];

  return genreCountB - genreCountA;
};

const getCountWatchedFilms = (films, period) => {
  const watchedFilms = films.filter((film) => film.isWatched);

  switch (period) {
    case StatisticType.ALL:
      return watchedFilms;
    case StatisticType.TODAY:
      return watchedFilms.filter((film) => dayjs(film.watchingDate) === dayjs());
    case StatisticType.WEEK:
      return watchedFilms.filter((film) => dayjs(film.watchingDate) >= dayjs().subtract(1, 'week'));
    case StatisticType.MONTH:
      return watchedFilms.filter((film) => dayjs(film.watchingDate) > dayjs().subtract(1, 'month'));
    case StatisticType.YEAR:
      return watchedFilms.filter((film) => dayjs(film.watchingDate) >= dayjs().subtract(1, 'year'));
  }
};

const getFilmGenres = (films) => films.reduce((accumulator, film) => accumulator.concat(film.genres), []);

export {StatisticType, Statistics, makeItemsUniq, countFilmsByGenre, sortGenre, getCountWatchedFilms, getFilmGenres};
