import {nanoid} from 'nanoid';
import {EMOJI} from '../const.js';
import {getRandomInteger} from '../utils/common.js';


const generateEmoji = () => EMOJI[getRandomInteger(0, EMOJI.length - 1)];
const getRandomArrayItem = (array) => array[getRandomInteger(0, array.length - 1)];
const generateDate = () => `${getRandomInteger(1950, 2021)}-${getRandomInteger(1, 12)}-${getRandomInteger(1, 28)}`;

const generateText = () => {
  const TEXTS = [
    'Interesting setting and a good cast',
    'Booooooooooring',
    'Very very old. Meh',
    'Almost two hours? Seriously?',
  ];

  return getRandomArrayItem(TEXTS);
};

const generateAuthor = () => {
  const AUTHORS = [
    'Tim Macoveev',
    'John Doe',
  ];

  return getRandomArrayItem(AUTHORS);
};

const generateComments = (count, filmId) => new Array(count).fill().map(() => ({
  filmId: filmId,
  id: nanoid(),
  author: generateAuthor(),
  comment: generateText(),
  date: generateDate(),
  emotion: generateEmoji(),
}));

export {generateComments};
