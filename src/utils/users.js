const Grade = {
  LOW: 1,
  MIDDLE: 10,
  HIGH: 20,
};

const getRating = (films) => {
  let rating = '';
  const watched = films.filter((film) => film.isWatched).length;

  if (watched <= Grade.MIDDLE && watched >= Grade.LOW) {
    rating = 'novice';
  } else if (watched <= Grade.HIGH) {
    rating = 'fan';
  } else if (watched > Grade.HIGH) {
    rating = 'Movie Buff';
  }

  return rating;
};

export {getRating};
