const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

const TITLES = {
  mainList: {title: 'All movies. Upcoming', isExtraList: false},
  topList: {title: 'Top rated', isExtraList: true},
  mostCommentedList: {title: 'Most commented', isExtraList: true},
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

// Функция из интернета по созданию элемента
// https://github.com/htmlacademy-ecmascript/taskmanager-15/pull/3/commits/e5b37903905e6b3896d48563a1880456ced4c04d
const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export {RenderPosition, renderElement, createElement, isEscEvent, TITLES};
