import AbstractView from './abstract.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {typeFilter, href, title, hasCount} = filter;

  return (
    `<a
      href="${href}"
      class="main-navigation__item
      ${(typeFilter === currentFilterType)
      ? 'main-navigation__item--active'
      : ''}"
      data-filter-type="${typeFilter}"
    >
      ${title}
      ${(hasCount !== -1)
      ? `<span class="main-navigation__item-count">${hasCount}</span>`
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
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

class SiteMenu extends AbstractView {
  constructor(filter, currentFilterType) {
    super();

    this._filter = filter;
    this._currentFilterType = currentFilterType;

    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filter, this._currentFilterType);
  }

  _onFilterTypeChange(evt) {
    if (evt.target.tagName === 'A') {
      evt.preventDefault();
      this._callback.filterTypeChange(evt.target.dataset.filterType);
    }
  }

  setOnFilterTypeChange(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().querySelector('.main-navigation__items').addEventListener('click', this._onFilterTypeChange);
  }
}

export default SiteMenu;
