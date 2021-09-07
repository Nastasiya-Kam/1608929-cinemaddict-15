import dayjs from 'dayjs';

const FilterType = {
  ALL: 'all',
  WATCH_LIST: 'watchList',
  WATCHED: 'watched',
  FAVORITE: 'favorite',
};

const filter = {
  [FilterType.WATCH_LIST]: (films) => films.filter((film) => film.isWatchList),
  [FilterType.WATCHED]: (films) => films.filter((film) => film.isWatched),
  [FilterType.FAVORITE]: (films) => films.filter((film) => film.isFavorite),
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

export {FilterType, filter, sortDate, compareRating, compareCommentsAmount};
