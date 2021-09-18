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

export {updateItem};
