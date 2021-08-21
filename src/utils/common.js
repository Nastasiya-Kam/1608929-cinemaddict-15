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

// Взято из интернета, функция по обновлению элемента
// https://github.com/htmlacademy-ecmascript/taskmanager-15/blob/571a1663abccc5b0d8acac57fbb07ed829ef632f/src/utils/common.js
const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export {getRandomInteger, getInteger, getRandomFloat, updateItem};
