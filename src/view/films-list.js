import {createElement} from '../utils/dom.js';

const createFilmsListTemplate = (title, isExtraList) => {
  const classList = (isExtraList) ? 'films-list films-list--extra' : 'films-list';

  return (
    `<section class="${classList}">
      <h2 class="films-list__title ${(isExtraList) ? '' : 'visually-hidden'}">${title}</h2>
      <div class="films-list__container"></div>
    </section>`
  );
};

class FilmsList {
  constructor(title, isExtraList = false) {
    this._title = title;
    this._isExtraList = isExtraList;
    this._element = null;
  }

  getTemplate() {
    return createFilmsListTemplate(this._title, this._isExtraList);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default FilmsList;
