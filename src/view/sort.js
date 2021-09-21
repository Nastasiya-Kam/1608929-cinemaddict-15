import AbstractView from './abstract.js';
import {SortType} from '../const.js';

const createSortTemplate = (sortType) => (
  `<ul class="sort">
    <li><a href="#" class="sort__button${(sortType === SortType.DEFAULT) ? ' sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button${(sortType === SortType.DATE) ? ' sort__button--active' : ''}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button${(sortType === SortType.RATING) ? ' sort__button--active' : ''}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`
);

class Sort extends AbstractView {
  constructor(sortType) {
    super();
    this._sortType = sortType;

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._sortType);
  }

  setOnSortTypeChange(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._onSortTypeChange);
  }

  _onSortTypeChange(evt) {
    if (evt.target.tagName === 'A') {
      evt.preventDefault();
      this._callback.sortTypeChange(evt.target.dataset.sortType);
    }
  }
}

export default Sort;
