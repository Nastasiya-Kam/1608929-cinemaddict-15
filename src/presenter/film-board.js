import SiteMenuView from '../view/site-menu.js';
import FilmsListView from '../view/films-list.js';
import NoFilmsView from '../view/no-films.js';
import ShowMoreView from '../view/show-more.js';
import FilmsView from '../view/films.js';
import SortView from '../view/sort.js';
import {updateItem} from '../utils/common.js';
import {render, remove, RenderPosition} from '../utils/dom.js';
import {ListType} from '../utils/films.js';
import FilmPresenter from './film.js';
import {SortType} from '../const.js';
import {sortDate, compareRating, compareCommentsAmount, generateFilter} from '../utils/filter.js';
import FilmDetailsPresenter from './film-details.js';

const FILM_COUNT_PER_STEP = 5;
const EXTRA_FILM_COUNT = 2;

class FilmsBoard {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._filmPresenter = new Map();
    this._filmTopPresenter = new Map();
    this._filmMostCommentedPresenter = new Map();

    this._currentSortType = SortType.DEFAULT;

    this._mainFilmsListComponent = null;
    this._mostCommentedComponent = null;
    this._topRatedComponent = null;
    this._sortComponent = null;
    this._siteMenuComponent = null;
    this._filmsComponent = new FilmsView();
    this._noFilmsComponent = new NoFilmsView();
    this._showMoreComponent = new ShowMoreView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreClick = this._handleShowMoreClick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._openDetails = this._openDetails.bind(this);

    this._filmDetailsPresenter = new FilmDetailsPresenter(this._handleModeChange);
  }

  init(films) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();
    this._mostCommentedFilms = films.slice().sort(compareCommentsAmount).slice(0, EXTRA_FILM_COUNT);
    this._topRatedFilms = films.slice().sort(compareRating).slice(0, EXTRA_FILM_COUNT);

    this._renderSort();
    this._renderSiteMenu();

    render(this._filmsContainer, this._filmsComponent);

    this._renderFilmsBoard();
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._films.sort(sortDate);
        break;
      case SortType.RATING:
        this._films.sort(compareRating);
        break;
      default:
        this._films = this._sourcedFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmList();

    remove(this._sortComponent);
    remove(this._siteMenuComponent);

    this._renderSort();
    this._renderSiteMenu();
    this._renderMainFilmsList();
    this._renderTopRated();
    this._renderMostCommented();
  }

  _renderSiteMenu() {
    const filter = generateFilter(this._films);
    this._siteMenuComponent = new SiteMenuView(filter);

    render(this._filmsContainer, this._siteMenuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    this._sortComponent = new SortView(this._currentSortType);

    render(this._filmsContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setOnSortTypeChange(this._handleSortTypeChange);
  }

  _handleModeChange(updatedFilm) {
    this._filmDetailsPresenter.init(updatedFilm);
    this._handleFilmChange(updatedFilm);
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);
    this._mostCommentedFilms = updateItem(this._mostCommentedFilms, updatedFilm);
    this._topRatedFilms = updateItem(this._topRatedFilms, updatedFilm);

    this._getFilmPresenters
      .map((presenter) => this._getUpdatedFilmsList(presenter, updatedFilm));

    if (this._filmDetailsPresenter.isOpened() && this._filmDetailsPresenter.isIdEqual(updatedFilm.id)) {
      this._filmDetailsPresenter.init(updatedFilm);
    }
  }

  _getUpdatedFilmsList(presenter, film) {
    if (presenter.has(film.id)) {
      presenter.get(film.id).init(film);
    }
  }

  _renderNoFilms() {
    render(this._filmsComponent, this._noFilmsComponent);
  }

  _renderFilm(container, film, presenter) {
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange, this._openDetails);

    filmPresenter.init(film);

    presenter.set(film.id, filmPresenter);
  }

  _openDetails(film) {
    this._filmDetailsPresenter.init(film);
  }

  _getFilmPresenters() {
    return [this._filmPresenter, this._filmTopPresenter, this._filmMostCommentedPresenter];
  }

  _clearFilmList() {
    this._getFilmPresenters
      .map((presenter) => {
        presenter.forEach((element) => element.destroy());
        presenter.clear();
      });

    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this._showMoreComponent);
  }

  _renderMainFilmsList() {
    if (this._mainFilmsListComponent === null) {
      this._mainFilmsListComponent = new FilmsListView(ListType.MAIN.title, ListType.MAIN.isExtraList);
    }

    for (let i = 0; i < Math.min(this._films.length, this._renderedFilmCount); i ++) {
      this._renderFilm(this._mainFilmsListComponent.getContainer(), this._films[i], this._filmPresenter);
    }

    render(this._filmsComponent, this._mainFilmsListComponent, RenderPosition.AFTERBEGIN);

    if (this._films.length > this._renderedFilmCount) {
      this._renderShowMore();
    }
  }

  _renderFilms(container, from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilm(container.getContainer(), film, this._filmPresenter));
  }

  _handleShowMoreClick() {
    this._renderFilms(this._mainFilmsListComponent, this._renderedFilmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);

    this._renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this._renderedFilmCount >= this._films.length) {
      remove(this._showMoreComponent);
    }
  }

  _renderShowMore() {
    render(this._mainFilmsListComponent, this._showMoreComponent);
    this._showMoreComponent.setOnShowMoreClick(this._handleShowMoreClick);
  }

  // todo вынести проверку на наличие комментируемых и фильмов с рейтингов в отдельную функцию
  _checkZeroRating(film) {
    return film.rating === 0;
  }

  _checkZeroComments(film) {
    return film.comments.length === 0;
  }

  // todo соединить отрисовку одинаковых списков?
  _renderTopRated() {
    if (this._topRatedComponent === null) {
      this._topRatedComponent = new FilmsListView(ListType.TOP.title, ListType.TOP.isExtraList);
    }

    for (let i = 0; i < EXTRA_FILM_COUNT; i ++) {
      this._renderFilm(this._topRatedComponent.getContainer(), this._topRatedFilms[i], this._filmTopPresenter);
    }

    render(this._filmsComponent, this._topRatedComponent);
  }

  _renderMostCommented() {
    if (this._mostCommentedComponent === null) {
      this._mostCommentedComponent = new FilmsListView(ListType.MOST_COMMENTED.title, ListType.MOST_COMMENTED.isExtraList);
    }

    for (let i = 0; i < EXTRA_FILM_COUNT; i ++) {
      this._renderFilm(this._mostCommentedComponent.getContainer(), this._mostCommentedFilms[i], this._filmMostCommentedPresenter);
    }

    render(this._filmsComponent, this._mostCommentedComponent);
  }

  _renderFilmsBoard() {
    if (this._films.length === 0) {
      this._renderNoFilms; // todo Значение отображаемого текста зависит от выбранного фильтра
      return;
    }

    this._renderMainFilmsList();

    if (!this._films.every(this._checkZeroRating)) {
      this._renderTopRated();
    }

    if (!this._films.every(this._checkZeroComments)) {
      this._renderMostCommented();
    }
  }
}

export default FilmsBoard;
