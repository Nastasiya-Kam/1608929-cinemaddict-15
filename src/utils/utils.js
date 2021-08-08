const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

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
// Функция из интернета по вставке элемента в начало или в конец родительского элемента
// https://github.com/htmlacademy-ecmascript/taskmanager-15/pull/3/commits/e5b37903905e6b3896d48563a1880456ced4c04d
const renderElement = (container, element, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};
// Функция из интернета по созданию элемента
// https://github.com/htmlacademy-ecmascript/taskmanager-15/pull/3/commits/e5b37903905e6b3896d48563a1880456ced4c04d
const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export {getRandomInteger, getInteger, getRandomFloat, renderTemplate, RenderPosition, renderElement, createElement, isEscEvent};
