import {createElement} from '../utils/dom.js';

const createSiteMenuTemplate = (filter) => {
  const {watchList, watched, favorite} = filter;

  return (`<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchList}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${watched}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorite}</span></a>
    </div>
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
