const filmToFilterMap = {
  watchList: (films) => films.filter((film) => film.isWatchList).length,
  watched: (films) => films.filter((film) => film.isWatched).length,
  favorite: (films) => films.filter((film) => film.isFavorite).length,
};

// todo как сделать объект {свойство: кол-во, свойство: кол-во, свойство: кол-во}?
const generateFilter = (films) => Object.entries(filmToFilterMap).map(([filterName, countFilms]) => ({[filterName]: countFilms(films)}));

export {generateFilter};
