const Grade = {
  LOW: 1,
  MIDDLE: 10,
  HIGH: 20,
};

const getRating = (rating) => {
  if (rating <= Grade.MIDDLE && rating >= Grade.LOW) {
    return 'Novice';
  } else if (rating <= Grade.HIGH) {
    return 'Fan';
  } else if (rating > Grade.HIGH) {
    return 'Movie Buff';
  }
};

export {getRating};
