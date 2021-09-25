import {getToday} from './dates.js';

const MAX_LENGTH_DESCRIPTION = 140;
const MINUTES_IN_HOUR = 60;

const ListType = {
  MAIN: {title: 'All movies. Upcoming', isExtraList: false, isEmptyList: false},
  TOP: {title: 'Top rated', isExtraList: true, isEmptyList: false},
  MOST_COMMENTED: {title: 'Most commented', isExtraList: true, isEmptyList: false},
};

const Settings = {
  WATCH_LIST: 'isWatchList',
  WATCHED: 'isWatched',
  FAVORITE: 'isFavorite',
};

const getUpdatedFilm = (film, setting) => (Object.assign(
  {},
  film,
  {
    [setting]: !film[setting],
  },
));

const getUpdatedWatchedFilm = (film) => {
  const watchingDate = (!film.isWatched) ? getToday() : null;

  return (Object.assign(
    {},
    film,
    {
      isWatched: !film.isWatched,
      watchingDate: watchingDate,
    },
  ));
};

const getShortDescription = (text) => (text.length > MAX_LENGTH_DESCRIPTION)
  ? `${text.slice(0, MAX_LENGTH_DESCRIPTION - 1).trim()}...`
  : text;

const getDuration = (minutes) => `${Math.trunc(minutes/MINUTES_IN_HOUR)}h ${minutes - Math.trunc(minutes/MINUTES_IN_HOUR)*MINUTES_IN_HOUR}m`;

export {MINUTES_IN_HOUR, ListType, Settings, getUpdatedFilm, getUpdatedWatchedFilm, getShortDescription, getDuration};
