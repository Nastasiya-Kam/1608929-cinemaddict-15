import {createElement} from '../utils/dom.js';
import {Filters} from '../utils/filter.js';

const createSiteMenuTemplate = (filter) => {
  let filterTemplate = '';

  for (const element of Filters) {
    filterTemplate += `<a href="${element.href}" class="main-navigation__item ${(element.isActive) ? 'main-navigation__item--active' : ''}">${element.title}${(element.isCount) ? `<span class="main-navigation__item-count">${filter[element.typeFilter]}</span>` : ''}</a>`;
  }

  return (`<nav class="main-navigation">
    <div class="main-navigation__items">${filterTemplate}</div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`);
};

class SiteMenu {
  constructor(filter) {
    this._filter = filter;
    this._element = null;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filter);
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

export default SiteMenu;
