// todo Переделать создание filter из модуля filter.js

const createSiteMenuTemplate = (filter) => (
  `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${filter[0].watchList}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${filter[1].watched}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${filter[2].favorite}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);


export {createSiteMenuTemplate};
