const Grade = {
  LOW: 1,
  MIDDLE: 10,
  HIGH: 20,
};

const getRating = (rating) => {
  if (rating <= Grade.MIDDLE && rating >= Grade.LOW) {
    return 'novice';
  } else if (rating <= Grade.HIGH) {
    return 'fan';
  } else if (rating > Grade.HIGH) {
    return 'Movie Buff';
  }
};

export {getRating};
