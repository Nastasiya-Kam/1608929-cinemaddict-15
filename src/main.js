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
import {generateFilm} from './mock/film.js';
import {generateFilter} from './view/filter.js';

const EXTRA_FILM_COUNT = 2;
const FILM_DEVELOPER_COUNT = 21;
const FILM_COUNT_PER_STEP = 5;

const films = new Array(FILM_DEVELOPER_COUNT).fill().map(() => generateFilm());
const filter = generateFilter(films);

const site = document.body;
const siteHeader = site.querySelector('.header');
const siteMain = site.querySelector('.main');
const footerStatistics = site.querySelector('.footer__statistics');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(siteHeader, createProfileTemplate(filter[1]), 'beforeend');
render(siteMain, createSiteMenuTemplate(filter), 'beforeend');
render(siteMain, createSortTemplate(), 'beforeend');
render(siteMain, createFilmsTemplate(), 'beforeend');

const filmsContainer = siteMain.querySelector('.films');

render(filmsContainer, createFilmListTemplate(), 'beforeend');

const filmsList = filmsContainer.querySelector('.films-list');
const filmsListContainer = filmsList.querySelector('.films-list__container');

for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i ++) {
  render(filmsListContainer, createCardFilmTemplate(films[i]), 'beforeend');
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  render(filmsList, createShowMoreTemplate(), 'beforeend');

  const loadMoreButton = filmsContainer.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => render(filmsListContainer, createCardFilmTemplate(film), 'beforeend'));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      loadMoreButton.remove();
    }
  });
}

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

render(footerStatistics, createStatisticsTemplate(films), 'beforeend');

// todo действия для открытия попапа с подробной информацией о фильме
// функция отрисовки (?) в обработчик события кликов по ТЗ: Клик по обложке фильма, заголовку, количеству комментариев открывает попап с подробной информацией о фильме;

// const openFilmDetailsSuccess = () => {
//   render(site, createFilmDetailsTemplate(films[0]), 'beforeend');
//   document.addEventListener('keydown', onFilmDetailsEscKeydown);
// };

render(site, createFilmDetailsTemplate(films[0]), 'beforeend');

const filmDetails = site.querySelector('.film-details');
const filmDetailsCloseButton = filmDetails.querySelector('.film-details__close-btn');

// const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

// const onFilmDetailsEscKeydown = (evt) => {
//   if (isEscEvent(evt)) {
//     evt.preventDefault();
//     document.removeEventListener('keydown', onFilmDetailsEscKeydown);
//     filmDetails.remove();
//   }
// };

const closeFilmDetails = () => {
  // document.removeEventListener('keydown', onFilmDetailsEscKeydown);
  filmDetails.remove();
};

filmDetailsCloseButton.addEventListener('click', () => {
  closeFilmDetails();
});
