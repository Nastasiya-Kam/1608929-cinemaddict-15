import {createElement} from '../utils/dom';

const createNoFilmsTemplate = () => '<section class="films-list"><h2 class="films-list__title">There are no movies in our database</h2></section>';
// const createNoFilmTemplate = (filter, type) => `<h2 class="films-list__title">${filter[type].text}</h2>`;
// todo Значение отображаемого текста зависит от выбранного фильтра:
//   * All movies – 'There are no movies in our database'
//   * Watchlist — 'There are no movies to watch now';
//   * History — 'There are no watched movies now';
//   * Favorites — 'There are no favorite movies now'.

// переменная с наименованиями фильтров находится в модуле filter.js

class NoFilms {
  constructor() {
  // constructor(filter, type) {
    // this._filter = filter;
    // this._type = type;
    this._element = null;
  }

  getTemplate() {
    return createNoFilmsTemplate();
    // return createNoFilmTemplate(this._filter, this._type);
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

export default NoFilms;
