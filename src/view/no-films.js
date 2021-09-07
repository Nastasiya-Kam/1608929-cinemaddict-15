import AbstractView from './abstract.js';
import {FilterType} from '../utils/filter.js';

const NoFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCH_LIST]: 'There are no movies to watch now',
  [FilterType.WATCHED]: 'There are no watched movies now',
  [FilterType.FAVORITE]: 'There are no favorite movies now',
};

const createNoFilmsTemplate = (filterType) => `<section class="films-list"><h2 class="films-list__title">${NoFilmsTextType[filterType]}</h2></section>`;

class NoFilms extends AbstractView {
  constructor(filterType) {
    super();

    this._filterType = filterType;
  }

  getTemplate() {
    return createNoFilmsTemplate(this._filterType);
  }
}

export default NoFilms;
