const Filter = {watchList: 'watchList', watched: 'watched', favorite: 'favorite'};

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

export {generateFilter};
