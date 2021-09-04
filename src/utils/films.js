const MAX_LENGTH_DESCRIPTION = 140;

const getNumberFilms = (films) => films.length;

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

const getShortDescription = (text) => (text.length > MAX_LENGTH_DESCRIPTION)
  ? `${text.slice(0, MAX_LENGTH_DESCRIPTION - 1).trim()}...`
  : text;

export {getNumberFilms, ListType, Settings, getUpdatedFilm, getShortDescription};
