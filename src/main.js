import ProfileView from './view/profile.js';
import SiteMenuView from './view/site-menu.js';
import SortView from './view/sort.js';
import FilmsView from './view/films.js';
import FilmsListView from './view/films-list.js';
import NoFilmsView from './view/no-films.js';
import CardFilmView from './view/card-film.js';
import ShowMoreView from './view/show-more.js';
import StatisticsView from './view/statistics.js';
import FilmDetailsView from './view/film-details.js';
import {generateFilm} from './mock/film.js';
import {generateFilter} from './utils/filter.js';
import {getRating} from './utils/users.js';
import {getNumberFilms, Title} from './utils/films.js';
import {renderElement, isEscEvent} from './utils/dom.js';

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

const checkClass = (item) => item === 'film-card__controls-item';

const openFilmDetails = (film) => {
  const filmDetailsComponent = new FilmDetailsView(film);

  site.appendChild(filmDetailsComponent.getElement());
  site.classList.add('hide-overflow');

  filmDetailsComponent.setOnFilmDetailsClick((evt) => {
    if (evt.target.tagName === 'BUTTON') {
      evt.target.classList.toggle('film-details__control-button--active');
    }
  });

  const onFilmDetailsEscKeydown = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      document.removeEventListener('keydown', onFilmDetailsEscKeydown);
      site.classList.remove('hide-overflow');
      site.removeChild(filmDetailsComponent.getElement());
    }
  };

  document.addEventListener('keydown', onFilmDetailsEscKeydown);

  filmDetailsComponent.setOnCloseButtonClick(() => {
    document.removeEventListener('keydown', onFilmDetailsEscKeydown);
    site.classList.remove('hide-overflow');
    site.removeChild(filmDetailsComponent.getElement());
  });

  // !Одновременно может быть открыт только один попап.
  // todo При открытии нового попапа прежний закрывается, например при клике на другую карточку при открытом попапе.
  // !Несохранённые изменения (неотправленный комментарий) пропадают.
};

const renderFilm = (filmsListElement, film) => {
  const filmComponent = new CardFilmView(film);

  filmComponent.setOnPosterClick(() => openFilmDetails(film));
  filmComponent.setOnTitleClick(() => openFilmDetails(film));
  filmComponent.setOnCommentsClick(() => openFilmDetails(film));

  filmComponent.setOnControlsClick((evt) => {
    const buttonClasses = Array.from(evt.target.classList);

    if (buttonClasses.some(checkClass)) {
      evt.target.classList.toggle('film-card__controls-item--active');
    }
  });

  renderElement(filmsListElement, filmComponent.getElement());
};

renderElement(siteHeader, new ProfileView(rating).getElement());
renderElement(siteMain, new SiteMenuView(filter).getElement());
renderElement(siteMain, new SortView().getElement());

const filmsComponent = new FilmsView();

renderElement(siteMain, filmsComponent.getElement());

const renderFilmsLists = () => {
  if (films.length === 0) {
    // todo Значение отображаемого текста зависит от выбранного фильтра
    renderElement(filmsComponent.getElement(), new NoFilmsView().getElement());
    return;
  }

  const filmsListComponent = new FilmsListView(Title.MAIN.title, Title.MAIN.isExtraList);

  renderElement(filmsComponent.getElement(), filmsListComponent.getElement());

  for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i ++) {
    renderFilm(filmsListComponent.getContainer(), films[i]);
  }

  if (films.length > FILM_COUNT_PER_STEP) {
    let renderedFilmCount = FILM_COUNT_PER_STEP;

    const showMoreComponent = new ShowMoreView();
    renderElement(filmsListComponent.getElement(), showMoreComponent.getElement());

    showMoreComponent.setOnShowMoreClick(() => {
      films
        .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
        .forEach((film) => renderFilm(filmsListComponent.getContainer(), film));

      renderedFilmCount += FILM_COUNT_PER_STEP;

      if (renderedFilmCount >= films.length) {
        showMoreComponent.getElement().remove();
      }
    });
  }

  const topRatedComponent = new FilmsListView(Title.TOP.title, Title.TOP.isExtraList);
  renderElement(filmsComponent.getElement(), topRatedComponent.getElement());

  for (let i = 0; i < EXTRA_FILM_COUNT; i ++) {
    renderFilm(topRatedComponent.getContainer(), films[i]);
  }

  const mostCommentedComponent = new FilmsListView(Title.MOST_COMMENTED.title, Title.MOST_COMMENTED.isExtraList);
  renderElement(filmsComponent.getElement(), mostCommentedComponent.getElement());

  for (let i = 0; i < EXTRA_FILM_COUNT; i ++) {
    renderFilm(mostCommentedComponent.getContainer(), films[i]);
  }
};

renderElement(footerStatistics, new StatisticsView(numberFilms).getElement());

renderFilmsLists();
