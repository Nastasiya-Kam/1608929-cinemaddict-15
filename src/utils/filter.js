const Filter = {watchList: 'watchList', watched: 'watched', favorite: 'favorite'};

const Filters = [
  {
    typeFilter: 'all',
    href: '#all',
    isActive: true,
    title: 'All movies',
    isCount: false,
  },
  {
    typeFilter: Filter.watchList,
    href: '#watchlist',
    isActive: false,
    title: 'Watchlist',
    isCount: true,
  },
  {
    typeFilter: Filter.watched,
    href: '#history',
    isActive: false,
    title: 'History',
    isCount: true,
  },
  {
    typeFilter: Filter.favorite,
    href: '#favorites',
    isActive: false,
    title: 'Favorites',
    isCount: true,
  },
];

const filmToFilterMap = {
  [Filter.watchList]: (films) => films.filter((film) => film.isWatchList).length,
  [Filter.watched]: (films) => films.filter((film) => film.isWatched).length,
  [Filter.favorite]: (films) => films.filter((film) => film.isFavorite).length,
};

const generateFilter = (films) => {
  const filter = {};

  Object.entries(filmToFilterMap).forEach(([filterName, countFilms]) => (filter[filterName] = countFilms(films)));
  return filter;
};

export {generateFilter, Filters};
