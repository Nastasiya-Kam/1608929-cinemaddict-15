import ProfileView from './view/profile.js';
import SiteMenuView from './view/site-menu.js';
import SortTemplateView from './view/sort.js';
import FilmsView from './view/films.js';
import FilmListView from './view/film-list.js';
import CardFilmView from './view/card-film.js';
import ShowMoreView from './view/show-more.js';
import TopRatedView from './view/top-rated.js';
import MostCommentedView from './view/most-commented.js';
import StatisticsView from './view/statistics.js';
import FilmDetailsView from './view/popup.js';
import {generateFilm} from './mock/film.js';
import {generateFilter} from './utils/filter.js';
import {getRating} from './utils/users.js';
import {getNumberFilms} from './utils/films.js';
import {RenderPosition, renderElement} from './utils/utils.js';

const EXTRA_FILM_COUNT = 2;
const FILM_DEVELOPER_COUNT = 22;
const FILM_COUNT_PER_STEP = 5;

const films = new Array(FILM_DEVELOPER_COUNT).fill().map(() => generateFilm());
const filter = generateFilter(films);
const numberFilms = getNumberFilms(films);
const rating = getRating(films);

const site = document.body;
const siteHeader = site.querySelector('.header');
const siteMain = site.querySelector('.main');
const footerStatistics = site.querySelector('.footer__statistics');

renderElement(siteHeader, new ProfileView(rating).getElement(), RenderPosition.BEFOREEND);
renderElement(siteMain, new SiteMenuView(filter).getElement(), RenderPosition.BEFOREEND);
renderElement(siteMain, new SortTemplateView().getElement(), RenderPosition.BEFOREEND);
renderElement(siteMain, new FilmsView().getElement(), RenderPosition.BEFOREEND);

const filmsContainer = siteMain.querySelector('.films');

renderElement(filmsContainer, new FilmListView().getElement(), RenderPosition.BEFOREEND);

const filmsList = filmsContainer.querySelector('.films-list');
const filmsListContainer = filmsList.querySelector('.films-list__container');

const checkClass = (item) => item === 'film-card__controls-item';

filmsListContainer.addEventListener('click', (evt) => {
  const buttonClasses = Array.from(evt.target.classList);

  if (buttonClasses.some(checkClass)) {
    evt.target.classList.toggle('film-card__controls-item--active');
  }
});

for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i ++) {
  renderElement(filmsListContainer, new CardFilmView(films[i]).getElement(), RenderPosition.BEFOREEND);
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  renderElement(filmsList, new ShowMoreView().getElement(), RenderPosition.BEFOREEND);

  const loadMoreButton = filmsContainer.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => renderElement(filmsListContainer, new CardFilmView(film).getElement(), RenderPosition.BEFOREEND));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      loadMoreButton.remove();
    }
  });
}

renderElement(filmsContainer, new TopRatedView().getElement(), RenderPosition.BEFOREEND);

const topRatedList = filmsContainer.querySelector('.films-list--extra .films-list__container');

for (let i = 0; i < EXTRA_FILM_COUNT; i ++) {
  renderElement(topRatedList, new CardFilmView(films[i]).getElement(), RenderPosition.BEFOREEND);
}

renderElement(filmsContainer, new MostCommentedView().getElement(), RenderPosition.BEFOREEND);

const mostCommentedList = filmsContainer.querySelector('.films-list--extra:last-child .films-list__container');

for (let i = 0; i < EXTRA_FILM_COUNT; i ++) {
  renderElement(mostCommentedList, new CardFilmView(films[i]).getElement(), RenderPosition.BEFOREEND);
}

renderElement(footerStatistics, new StatisticsView(numberFilms).getElement(), RenderPosition.BEFOREEND);

// todo действия для открытия попапа с подробной информацией о фильме
// функция отрисовки (?) в обработчик события кликов по ТЗ: Клик по обложке фильма, заголовку, количеству комментариев открывает попап с подробной информацией о фильме;

// const openFilmDetailsSuccess = () => {
//   renderTemplate(site, createFilmDetailsTemplate(films[0]), 'beforeend');
//   document.addEventListener('keydown', onFilmDetailsEscKeydown);
// };

renderElement(site, new FilmDetailsView(films[0]).getElement(), RenderPosition.BEFOREEND);

const filmDetails = site.querySelector('.film-details');
const filmDetailsControls = filmDetails.querySelector('.film-details__controls');
const filmDetailsCloseButton = filmDetails.querySelector('.film-details__close-btn');

filmDetailsControls.addEventListener('click', (evt) => {
  if (evt.target.tagName === 'BUTTON') {
    evt.target.classList.toggle('film-details__control-button--active');
  }
});

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
