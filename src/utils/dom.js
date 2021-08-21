import Abstract from '../view/abstract.js';

const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
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

// Функция из интернета по удалению элемента
// https://github.com/htmlacademy-ecmascript/taskmanager-15/blob/master/src/utils/render.js
const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

// Функция из интернета по замене элемента
// https://github.com/htmlacademy-ecmascript/taskmanager-15/blob/master/src/utils/render.js
const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};


export {RenderPosition, renderElement, createElement, isEscEvent, remove, replace};
