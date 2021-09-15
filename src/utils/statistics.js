import {isInDateRange, isDateToday} from '../utils/dates.js';

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

const makeItemsUnique = (items) => [...new Set(items)];
const countFilmsByGenre = (genresTypes, genre) => genresTypes.filter((type) => type === genre).length;

const sortGenre = (genreA, genreB) => {
  const genreCountA = genreA.count;
  const genreCountB = genreB.count;

  return genreCountB - genreCountA;
};

const getCountWatchedFilms = (films, period) => {
  const watchedFilms = films.filter((film) => film.isWatched);

  switch (period) {
    case StatisticType.ALL:
      return watchedFilms;
    case StatisticType.TODAY:
      return watchedFilms.filter((film) => isDateToday(film.watchingDate));
    default:
      return watchedFilms.filter((film) => isInDateRange(film.watchingDate, period));
  }
};

const getFilmGenres = (films) => films.reduce((accumulator, film) => accumulator.concat(film.genres), []);

const getGenresData = (uniqueGenres, allGenres) => {
  const data = [];

  for (let i = 0; i < uniqueGenres.length; i++) {
    const genreObject = {
      genre: uniqueGenres[i],
      count: 0,
    };

    for (let j = 0; j < allGenres.length; j++) {
      if (allGenres[j] === genreObject.genre) {
        genreObject.count += 1;
      }
    }

    data.push(genreObject);
  }

  data.sort(sortGenre);

  return {
    labels: data.map((element) => element.genre),
    data: data.map((element) => element.count),
  };
};

export {StatisticType, Statistics, makeItemsUnique, countFilmsByGenre, sortGenre, getCountWatchedFilms, getFilmGenres, getGenresData};
