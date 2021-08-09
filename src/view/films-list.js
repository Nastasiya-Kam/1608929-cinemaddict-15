import {createElement} from '../utils/dom.js';

// todo Значение отображаемого текста зависит от выбранного фильтра
const createFilmsListTemplate = (title, isExtraList = false, isEmptyList = false) => {
  const classList = (isExtraList) ? 'films-list films-list--extra' : 'films-list';
  const emptyList = (isEmptyList) ? '' : '<div class="films-list__container"></div>';

  return (
    `<section class="${classList}">
      <h2 class="films-list__title ${(isExtraList || isEmptyList) ? '' : 'visually-hidden'}">${title}</h2>
      ${emptyList}
    </section>`
  );
};

class FilmsList {
  constructor(title, isExtraList, isEmptyList) {
    this._title = title;
    this._isExtraList = isExtraList;
    this._isEmptyList = isEmptyList;
    this._element = null;
  }

  getTemplate() {
    return createFilmsListTemplate(this._title, this._isExtraList, this._isEmptyList);
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
