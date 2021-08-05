const getRating = (films) => {
  let rating = '';
  const watched = films.filter((film) => film.isWatched).length;

  if (watched <= 10 && watched >= 1) {
    rating = 'novice';
  } else if (watched <= 20) {
    rating = 'fan';
  } else if (watched > 20) {
    rating = 'Movie Buff';
  }

  return rating;
};

export {getRating};
