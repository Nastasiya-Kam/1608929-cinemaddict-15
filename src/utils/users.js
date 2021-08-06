const Grades = {
  LOW: 1,
  MIDDLE: 10,
  HIGH: 20,
};

const getRating = (films) => {
  let rating = '';
  const watched = films.filter((film) => film.isWatched).length;

  if (watched <= Grades.MIDDLE && watched >= Grades.LOW) {
    rating = 'novice';
  } else if (watched <= Grades.HIGH) {
    rating = 'fan';
  } else if (watched > Grades.HIGH) {
    rating = 'Movie Buff';
  }

  return rating;
};

export {getRating};
