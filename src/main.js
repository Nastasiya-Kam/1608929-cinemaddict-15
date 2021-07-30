import {createProfileTemplate} from './view/profile.js';
import {createSiteMenuTemplate} from './view/site-menu.js';
import {createSortTemplate} from './view/sort.js';
import {createFilmsTemplate} from './view/films.js';
import {createFilmListTemplate} from './view/film-list.js';
import {createCardFilmTemplate} from './view/card-film.js';
import {createShowMoreTemplate} from './view/show-more.js';
import {createTopRatedTemplate} from './view/top-rated.js';
import {createMostCommentedTemplate} from './view/most-commented.js';
import {createStatisticsTemplate} from './view/statistics.js';

const FILM_COUNT = 5;
const EXTRA_FILM_COUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeader = document.querySelector('.header');

render(siteHeader, createProfileTemplate(), 'beforeend');

const siteMain = document.querySelector('.main');

render(siteMain, createSiteMenuTemplate(), 'beforeend');
render(siteMain, createSortTemplate(), 'beforeend');
render(siteMain, createFilmsTemplate(), 'beforeend');

const filmsContainer = siteMain.querySelector('.films');

render(filmsContainer, createFilmListTemplate(), 'beforeend');

const filmsList = filmsContainer.querySelector('.films-list');
const filmsListContainer = filmsList.querySelector('.films-list__container');

for (let i = 0; i < FILM_COUNT; i ++) {
  render(filmsListContainer, createCardFilmTemplate(), 'beforeend');
}

render(filmsList, createShowMoreTemplate(), 'beforeend');
render(filmsContainer, createTopRatedTemplate(), 'beforeend');

const topRatedList = filmsContainer.querySelector('.films-list--extra .films-list__container');

for (let i = 0; i < EXTRA_FILM_COUNT; i ++) {
  render(topRatedList, createCardFilmTemplate(), 'beforeend');
}

render(filmsContainer, createMostCommentedTemplate(), 'beforeend');

const mostCommentedList = filmsContainer.querySelector('.films-list--extra:last-child .films-list__container');

for (let i = 0; i < EXTRA_FILM_COUNT; i ++) {
  render(mostCommentedList, createCardFilmTemplate(), 'beforeend');
}

const footerStatistics = document.querySelector('.footer__statistics');

render(footerStatistics, createStatisticsTemplate(), 'beforeend');

// todo Подробная информация о фильме (попап).
