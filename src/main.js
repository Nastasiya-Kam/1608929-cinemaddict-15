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
import {createFilmDetailsTemplate} from './view/popup.js';
import {createControlsTemplate} from './view/popup-controls.js';
import {createFilmCommentsTemplate} from './view/popup-details.js';
import {generateFilm} from './mock/film.js';

const FILM_COUNT = 5;
const EXTRA_FILM_COUNT = 2;
const FILM_DEVELOPER_COUNT = 20;

const films = new Array(FILM_DEVELOPER_COUNT).fill().map(() => generateFilm());

const site = document.body;
const siteHeader = site.querySelector('.header');
const siteMain = site.querySelector('.main');
const footerStatistics = site.querySelector('.footer__statistics');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(siteHeader, createProfileTemplate(), 'beforeend');
render(siteMain, createSiteMenuTemplate(), 'beforeend');
render(siteMain, createSortTemplate(), 'beforeend');
render(siteMain, createFilmsTemplate(), 'beforeend');

const filmsContainer = siteMain.querySelector('.films');

render(filmsContainer, createFilmListTemplate(), 'beforeend');

const filmsList = filmsContainer.querySelector('.films-list');
const filmsListContainer = filmsList.querySelector('.films-list__container');

for (let i = 0; i < FILM_COUNT; i ++) {
  render(filmsListContainer, createCardFilmTemplate(films[i]), 'beforeend');
}

render(filmsList, createShowMoreTemplate(), 'beforeend');
render(filmsContainer, createTopRatedTemplate(), 'beforeend');

const topRatedList = filmsContainer.querySelector('.films-list--extra .films-list__container');

for (let i = 0; i < EXTRA_FILM_COUNT; i ++) {
  render(topRatedList, createCardFilmTemplate(films[i]), 'beforeend');
}

render(filmsContainer, createMostCommentedTemplate(), 'beforeend');

const mostCommentedList = filmsContainer.querySelector('.films-list--extra:last-child .films-list__container');

for (let i = 0; i < EXTRA_FILM_COUNT; i ++) {
  render(mostCommentedList, createCardFilmTemplate(films[i]), 'beforeend');
}

render(footerStatistics, createStatisticsTemplate(), 'beforeend');
render(site, createFilmDetailsTemplate(), 'beforeend');

const filmDetails = site.querySelector('.film-details');
const filmDetailsTop = filmDetails.querySelector('.film-details__top-container');

render(filmDetailsTop, createControlsTemplate(), 'beforeend');

const filmDetailsBottom = filmDetails.querySelector('.film-details__bottom-container');

render(filmDetailsBottom, createFilmCommentsTemplate(), 'beforeend');
