const getNumberFilms = (films) => films.length;

const Title = {
  MAIN: {title: 'All movies. Upcoming', isExtraList: false, isEmptyList: false},
  TOP: {title: 'Top rated', isExtraList: true, isEmptyList: false},
  MOST_COMMENTED: {title: 'Most commented', isExtraList: true, isEmptyList: false},
};

export {getNumberFilms, Title};
