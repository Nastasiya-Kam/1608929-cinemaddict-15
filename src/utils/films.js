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

const getUpdateFilm = (film, setting) => (Object.assign(
  {},
  film,
  {
    [setting]: !film[setting],
  },
));


export {getNumberFilms, ListType, Settings, getUpdateFilm};
