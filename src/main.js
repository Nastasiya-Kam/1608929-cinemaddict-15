import ProfileView from './view/profile.js';
import SiteMenuView from './view/site-menu.js';
import SortTemplateView from './view/sort.js';
import FilmsView from './view/films.js';
import FilmsListView from './view/films-list.js';
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
import {RenderPosition, renderElement, isEscEvent} from './utils/utils.js';

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
const body = document.body;

const checkClass = (item) => item === 'film-card__controls-item';

const openFilmDetails = (film) => {
  const filmDetails = new FilmDetailsView(film);

  site.appendChild(filmDetails.getElement());
  body.classList.add('hide-overflow');

  filmDetails.getElement().querySelector('.film-details__controls').addEventListener('click', (evt) => {
    if (evt.target.tagName === 'BUTTON') {
      evt.target.classList.toggle('film-details__control-button--active');
    }
  });

  const onFilmDetailsEscKeydown = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      document.removeEventListener('keydown', onFilmDetailsEscKeydown);
      body.classList.remove('hide-overflow');
      site.removeChild(filmDetails.getElement());
    }
  };

  document.addEventListener('keydown', onFilmDetailsEscKeydown);

  const closeFilmDetails = () => {
    document.removeEventListener('keydown', onFilmDetailsEscKeydown);
    body.classList.remove('hide-overflow');
    site.removeChild(filmDetails.getElement());
  };

  filmDetails.getElement().querySelector('.film-details__close-btn').addEventListener('click', () => {
    closeFilmDetails();
  });

  // !Одновременно может быть открыт только один попап.
  // todo При открытии нового попапа прежний закрывается, например при клике на другую карточку при открытом попапе.
  // !Несохранённые изменения (неотправленный комментарий) пропадают.
};

const renderFilm = (filmsListElement, film) => {
  const filmComponent = new CardFilmView(film);

  //? Не выглядит ли все три навешивания событий повторением в коде? Возможно нужно все три слушателя повесить через делегирование?
  filmComponent.getElement().querySelector('.film-card__poster').addEventListener('click', () => {
    openFilmDetails(film);
  });

  filmComponent.getElement().querySelector('.film-card__title').addEventListener('click', () => {
    openFilmDetails(film);
  });

  filmComponent.getElement().querySelector('.film-card__comments').addEventListener('click', (evt) => {
    evt.preventDefault();
    openFilmDetails(film);
  });

  filmComponent.getElement().querySelector('.film-card__controls').addEventListener('click', (evt) => {
    const buttonClasses = Array.from(evt.target.classList);

    if (buttonClasses.some(checkClass)) {
      evt.target.classList.toggle('film-card__controls-item--active');
    }
  });

  renderElement(filmsListElement, filmComponent.getElement(), RenderPosition.BEFOREEND);
};

renderElement(siteHeader, new ProfileView(rating).getElement(), RenderPosition.BEFOREEND);
renderElement(siteMain, new SiteMenuView(filter).getElement(), RenderPosition.BEFOREEND);
renderElement(siteMain, new SortTemplateView().getElement(), RenderPosition.BEFOREEND);
renderElement(siteMain, new FilmsView().getElement(), RenderPosition.BEFOREEND);

const filmsContainer = siteMain.querySelector('.films');

const filmsListComponent = new FilmsListView();
renderElement(filmsContainer, filmsListComponent.getElement(), RenderPosition.BEFOREEND);

const filmsList = filmsContainer.querySelector('.films-list');

for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i ++) {
  renderFilm(filmsListComponent.getElement().querySelector('.films-list__container'), films[i]);
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  renderElement(filmsList, new ShowMoreView().getElement(), RenderPosition.BEFOREEND);

  const loadMoreButton = filmsContainer.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => renderFilm(filmsListComponent.getElement().querySelector('.films-list__container'), film));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      loadMoreButton.remove();
    }
  });
}

const topRatedComponent = new TopRatedView();
renderElement(filmsContainer, topRatedComponent.getElement(), RenderPosition.BEFOREEND);

for (let i = 0; i < EXTRA_FILM_COUNT; i ++) {
  renderFilm(topRatedComponent.getElement().querySelector('.films-list__container'), films[i]);
}

const mostCommentedComponent = new MostCommentedView();
renderElement(filmsContainer, mostCommentedComponent.getElement(), RenderPosition.BEFOREEND);

for (let i = 0; i < EXTRA_FILM_COUNT; i ++) {
  renderFilm(mostCommentedComponent.getElement().querySelector('.films-list__container'), films[i]);
}

renderElement(footerStatistics, new StatisticsView(numberFilms).getElement(), RenderPosition.BEFOREEND);
