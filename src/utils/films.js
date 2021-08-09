const getNumberFilms = (films) => films.length;

const TITLES = {
  mainList: {title: 'All movies. Upcoming', isExtraList: false, isEmptyList: false},
  topList: {title: 'Top rated', isExtraList: true, isEmptyList: false},
  mostCommentedList: {title: 'Most commented', isExtraList: true, isEmptyList: false},
  emptyList: {title: 'There are no movies in our database', isExtraList: false, isEmptyList: true},
};

// todo Значение отображаемого текста зависит от выбранного фильтра:
//   * All movies – 'There are no movies in our database'
//   * Watchlist — 'There are no movies to watch now';
//   * History — 'There are no watched movies now';
//   * Favorites — 'There are no favorite movies now'.

export {getNumberFilms, TITLES};
