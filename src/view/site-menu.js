import AbstractView from './abstract.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {typeFilter, href, title, hasCount, count} = filter;

  return (
    `<a
      href="${href}"
      class="main-navigation__item
      ${(typeFilter === currentFilterType && currentFilterType !== null)
      ? 'main-navigation__item--active'
      : ''}"
      data-filter-type="${typeFilter}"
    >
      ${title}
      ${(hasCount)
      ? `<span class="main-navigation__item-count">${count}</span>`
      : ''}
    </a>`);
};

const createSiteMenuTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">${filterItemsTemplate}</div>
      <a href="#stats" class="main-navigation__additional${(currentFilterType === null) ? ' main-navigation__additional--active' : ''}">Stats</a>
    </nav>`
  );
};

class SiteMenu extends AbstractView {
  constructor(filter, currentFilterType) {
    super();

    this._filter = filter;
    this._currentFilterType = currentFilterType;

    this._onFilterTypeClick = this._onFilterTypeClick.bind(this);
    this._onStatsClick = this._onStatsClick.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filter, this._currentFilterType);
  }

  setOnFilterTypeClick(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().querySelector('.main-navigation__items').addEventListener('click', this._onFilterTypeClick);
  }

  setOnStatsClick(callback) {
    this._callback.statsClick = callback;
    this.getElement().querySelector('.main-navigation__additional').addEventListener('click', this._onStatsClick);
  }

  _onFilterTypeClick(evt) {
    if (evt.target.tagName === 'A') {
      evt.preventDefault();
      this._callback.filterTypeChange(evt.target.dataset.filterType);
    }
  }

  _onStatsClick(evt) {
    evt.preventDefault();
    this._callback.statsClick();
  }
}

export default SiteMenu;
