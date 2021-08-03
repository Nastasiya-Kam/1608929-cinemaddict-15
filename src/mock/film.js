const MAX_COUNT = 5;
const MIN_COMMENTS_COUNT = 0;
const MIN_DESCRIPTION_COUNT = 1;

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getInteger = (number, decimal) => {
  for (let index = 0; index < decimal; index++) {
    number *= 10;
  }

  return Math.floor(number);
};

const getRandomFloat = (start = 0, finish = 1, decimalPlaces = 1) => {
  const startInt = getInteger(start, decimalPlaces);
  const finishInt = getInteger(finish, decimalPlaces);

  let number = Math.floor(Math.random() * (finishInt - startInt + 1) + startInt); // Взято с MDN: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  const lengthNumber = (start === 0) ? decimalPlaces + 2 : String(number).length;

  for (let index = 0; index < decimalPlaces; index++) {
    number /= 10;
  }

  return Number(String(number).substr(0, decimalPlaces + (lengthNumber - decimalPlaces + 1)));
};

const generateFilmName = () => {
  const NAMES = [
    'The Dance of Life',
    'Sagebrush Trail',
    'The Man with the Golden Arm',
    'Santa Claus Conquers the Martians',
    'Popeye the Sailor Meets Sindbad the Sailor',
    'The Man with the Golden Arm',
    'The Great Flamarion',
    'Santa Claus Conquers the Martians',
    'Made for Each Other',
  ];

  return NAMES[getRandomInteger(0, NAMES.length - 1)];
};

const generateFilmImage = () => {
  const FILM_IMAGE = [
    'made-for-each-other.png',
    'popeye-meets-sinbad.png',
    'sagebrush-trail.jpg',
    'santa-claus-conquers-the-martians.jpg',
    'the-dance-of-life.jpg',
    'the-great-flamarion.jpg',
    'the-man-with-the-golden-arm.jpg',
  ];

  return FILM_IMAGE[getRandomInteger(0, FILM_IMAGE.length - 1)];
};

const generateDescription = (count) => {
  const SENTENCES = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.',
  ];

  return new Array(count).fill().map(() => SENTENCES[getRandomInteger(0, SENTENCES.length - 1)]).join(' ');
};

const comment = {
  text: '',
  emoji: '',
  author: '',
  date: '',
  button: '',
};

const generateComments = (count) => new Array(count).fill().map(() => comment);

const generateDate = () => `${getRandomInteger(1950, 2021)}-${getRandomInteger(1, 12)}-${getRandomInteger(1, 28)} `;

const generateFilm = () => ({
  name: generateFilmName(),
  original: generateFilmName(),
  img: generateFilmImage(),
  description: generateDescription(getRandomInteger(MIN_DESCRIPTION_COUNT, MAX_COUNT)),
  comments: generateComments(getRandomInteger(MIN_COMMENTS_COUNT, MAX_COUNT)),
  rating: getRandomFloat(0, 10, 1),
  release: generateDate(),
  runtime: `${getRandomInteger(0, 2)}h ${getRandomInteger(0, 59)}m`, //?число (минуты)
  genres: 'Drama Film-Noir Mystery', //?массив
  director:	'Anthony Mann', //?массив
  writers:	'Anne Wigton, Heinz Herald, Richard Weil', //?массив
  actors:	'Erich von Stroheim, Mary Beth Hughes, Dan Duryea', //?массив
  country:	'USA',
  ratingAge: '18+',
  isWatchList: Boolean(getRandomInteger(0, 1)),
  isWatched: Boolean(getRandomInteger(0, 1)),
  isFavorite: Boolean(getRandomInteger(0, 1)),
});

export {generateFilm};
