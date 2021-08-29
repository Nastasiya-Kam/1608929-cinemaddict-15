import dayjs from 'dayjs';

const Filter = {ALL: 'all', WATCH_LIST: 'watchList', WATCHED: 'watched', FAVORITE: 'favorite'};

const Filters = [
  {
    typeFilter: Filter.ALL,
    href: '#all',
    isActive: true,
    title: 'All movies',
    hasCount: false,
  },
  {
    typeFilter: Filter.WATCH_LIST,
    href: '#watchlist',
    isActive: false,
    title: 'Watchlist',
    hasCount: true,
  },
  {
    typeFilter: Filter.WATCHED,
    href: '#history',
    isActive: false,
    title: 'History',
    hasCount: true,
  },
  {
    typeFilter: Filter.FAVORITE,
    href: '#favorites',
    isActive: false,
    title: 'Favorites',
    hasCount: true,
  },
];

const filmToFilterMap = {
  [Filter.WATCH_LIST]: (films) => films.filter((film) => film.isWatchList).length,
  [Filter.WATCHED]: (films) => films.filter((film) => film.isWatched).length,
  [Filter.FAVORITE]: (films) => films.filter((film) => film.isFavorite).length,
};

const generateFilter = (films) => {
  const filter = {};

  Object.entries(filmToFilterMap).forEach(([filterName, countFilms]) => (filter[filterName] = countFilms(films)));
  return filter;
};

const sortDate = (filmA, filmB) => {
  const dateA = dayjs(filmA.release);
  const dateB = dayjs(filmB.release);

  return dateB.diff(dateA);
};

const compareRating = (filmA, filmB) => {
  const ratingA = filmA.rating;
  const ratingB = filmB.rating;

  return ratingB - ratingA;
};

const compareCommentsAmount = (filmA, filmB) => {
  const commentsAmountA = filmA.comments.length;
  const commentsAmountB = filmB.comments.length;

  return commentsAmountB - commentsAmountA;
};

export {generateFilter, Filters, sortDate, compareRating, compareCommentsAmount};
