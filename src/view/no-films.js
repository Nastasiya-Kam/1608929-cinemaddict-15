import AbstractView from './abstract.js';

const createNoFilmsTemplate = () => '<section class="films-list"><h2 class="films-list__title">There are no movies in our database</h2></section>';
// const createNoFilmTemplate = (filter, type) => `<h2 class="films-list__title">${filter[type].text}</h2>`;
// todo Значение отображаемого текста зависит от выбранного фильтра:
//   * All movies – 'There are no movies in our database'
//   * Watchlist — 'There are no movies to watch now';
//   * History — 'There are no watched movies now';
//   * Favorites — 'There are no favorite movies now'.

// переменная с наименованиями фильтров находится в модуле filter.js

class NoFilms extends AbstractView {
  // constructor(filter, type) {
  //   super();

  //   this._filter = filter;
  //   this._type = type;
  // }

  getTemplate() {
    return createNoFilmsTemplate();
    // return createNoFilmTemplate(this._filter, this._type);
  }
}

export default NoFilms;
