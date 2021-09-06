import {nanoid} from 'nanoid';
import {getRandomInteger, getRandomFloat} from '../utils/common.js';
const MAX_DESCRIPTION_COUNT = 5;
const MIN_DESCRIPTION_COUNT = 1;

const getRandomBoolean = () => Boolean(getRandomInteger(0, 1));
const getRandomArrayItem = (array) => array[getRandomInteger(0, array.length - 1)];

const generateFilmName = () => {
  const NAMES = [
    'The Dance of Life',
    'Sagebrush Trail',
    'The Man with the Golden Arm',
    'Santa Claus Conquers the Martians',
    'Popeye the Sailor Meets Sindbad the Sailor',
    'The Great Flamarion',
    'Made for Each Other',
  ];

  return getRandomArrayItem(NAMES);
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

  return getRandomArrayItem(FILM_IMAGE);
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

  return new Array(count).fill().map(() => getRandomArrayItem(SENTENCES)).join(' ');
};

const generateGenres = (count) => {
  const GENRES = [
    'Drama',
    'Film-Noir',
    'Mystery',
    'Western',
    'Comedy',
    'Cartoon',
    'Mystery',
  ];

  return new Array(count).fill().map(() => getRandomArrayItem(GENRES));
};

const generateDate = () => `${getRandomInteger(1950, 2021)}-${getRandomInteger(1, 12)}-${getRandomInteger(1, 28)}`;

const generateFilm = () => ({
  id: nanoid(),
  name: generateFilmName(),
  original: generateFilmName(),
  img: generateFilmImage(),
  description: generateDescription(getRandomInteger(MIN_DESCRIPTION_COUNT, MAX_DESCRIPTION_COUNT)),
  comments: [],
  rating: getRandomFloat(0, 10, 1),
  release: generateDate(),
  duration: getRandomInteger(0, 220),
  genres: generateGenres(getRandomInteger(1, 3)),
  director:	'Anthony Mann', //?массив
  writers:	'Anne Wigton, Heinz Herald, Richard Weil', //?массив
  actors:	'Erich von Stroheim, Mary Beth Hughes, Dan Duryea', //?массив
  country:	'USA',
  age: '18+',
  isWatchList: getRandomBoolean(),
  isWatched: getRandomBoolean(),
  isFavorite: getRandomBoolean(),
});

export {generateFilm};
