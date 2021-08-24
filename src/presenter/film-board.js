import FilmsListView from '../view/films-list.js';
import NoFilmsView from '../view/no-films.js';
import ShowMoreView from '../view/show-more.js';
import FilmsView from '../view/films.js';
import SortView from '../view/sort.js';
import {updateItem} from '../utils/common.js';
import {renderElement, remove, RenderPosition} from '../utils/dom.js';
import {Title} from '../utils/films.js'; //getNumberFilms
import FilmPresenter from './film.js';
import {SortType} from '../const.js';
import {sortDate, compareRating, compareCommentsAmount} from '../utils/filter.js';
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
    // Т.к. основной список фильмов используется для отрисовки ShowMore кнопки, то сделаем её видимой для всего класса
    this._currentSortType = SortType.DEFAULT;
    this._mainFilmsListComponent = null;
    this._mostCommentedComponent = null;
    this._topRatedComponent = null;

    this._sortComponent = new SortView();
    this._filmsComponent = new FilmsView();
    this._noFilmsComponent = new NoFilmsView();
    this._showMoreComponent = new ShowMoreView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreClick = this._handleShowMoreClick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(films) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();
    this._mostCommentedFilms = films.slice().sort(compareCommentsAmount).slice(0, EXTRA_FILM_COUNT);
    this._topRatedFilms = films.slice().sort(compareRating).slice(0, EXTRA_FILM_COUNT);

    this._renderSort();

    renderElement(this._filmsContainer, this._filmsComponent.getElement());

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
    this._renderMainFilmsList();
    this._renderTopRated();
    this._renderMostCommented();
  }

  _renderSort() {
    renderElement(this._filmsContainer, this._sortComponent.getElement());
    this._sortComponent.setOnSortTypeChange(this._handleSortTypeChange);
  }

  _handleModeChange(updatedFilm) {
    this._filmDetailsPresenter.init(updatedFilm);
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);
    this._mostCommentedFilms = updateItem(this._mostCommentedFilms, updatedFilm);
    this._topRatedFilms = updateItem(this._topRatedFilms, updatedFilm);

    // todo Вынести в функцию?
    if (this._filmPresenter.has(updatedFilm.id)) {
      this._filmPresenter.get(updatedFilm.id).init(updatedFilm);
    }

    if (this._filmTopPresenter.has(updatedFilm.id)) {
      this._filmTopPresenter.get(updatedFilm.id).init(updatedFilm);
    }

    if (this._filmMostCommentedPresenter.has(updatedFilm.id)) {
      this._filmMostCommentedPresenter.get(updatedFilm.id).init(updatedFilm);
    }

    // ?Куда это нужно перенести, чтобы закрытие/открытие попапа происходило по клику на постер, титульный или комменты
    // this._filmDetailsPresenter.init(updatedFilm);
  }

  _renderNoFilms() {
    renderElement(this._filmsComponent.getElement(), this._noFilmsComponent.getElement());
  }

  _renderFilm(container, film, presenter) {
    this._filmDetailsPresenter = new FilmDetailsPresenter(this._handleFilmChange, this._handleModeChange);
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange, this._filmDetailsPresenter);

    filmPresenter.init(film);

    presenter.set(film.id, filmPresenter);
  }

  _clearFilmList() {
    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmTopPresenter.forEach((presenter) => presenter.destroy());
    this._filmMostCommentedPresenter.forEach((presenter) => presenter.destroy());

    this._filmPresenter.clear();
    this._filmTopPresenter.clear();
    this._filmMostCommentedPresenter.clear();

    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this._showMoreComponent);
  }

  _renderMainFilmsList() {
    if (this._mainFilmsListComponent === null) {
      this._mainFilmsListComponent = new FilmsListView(Title.MAIN.title, Title.MAIN.isExtraList);
    }

    for (let i = 0; i < Math.min(this._films.length, this._renderedFilmCount); i ++) {
      this._renderFilm(this._mainFilmsListComponent.getContainer(), this._films[i], this._filmPresenter);
    }

    renderElement(this._filmsComponent.getElement(), this._mainFilmsListComponent.getElement(), RenderPosition.AFTERBEGIN);

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
    renderElement(this._mainFilmsListComponent.getElement(), this._showMoreComponent.getElement());
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
    if (this._films.every(this._checkZeroRating)) {
      return;
    }

    if (this._topRatedComponent === null) {
      this._topRatedComponent = new FilmsListView(Title.TOP.title, Title.TOP.isExtraList);
    }

    for (let i = 0; i < EXTRA_FILM_COUNT; i ++) {
      this._renderFilm(this._topRatedComponent.getContainer(), this._topRatedFilms[i], this._filmTopPresenter);
    }

    renderElement(this._filmsComponent.getElement(), this._topRatedComponent.getElement());
  }

  _renderMostCommented() {
    if (this._films.every(this._checkZeroComments)) {
      return;
    }

    if (this._mostCommentedComponent === null) {
      this._mostCommentedComponent = new FilmsListView(Title.MOST_COMMENTED.title, Title.MOST_COMMENTED.isExtraList);
    }

    for (let i = 0; i < EXTRA_FILM_COUNT; i ++) {
      this._renderFilm(this._mostCommentedComponent.getContainer(), this._mostCommentedFilms[i], this._filmMostCommentedPresenter);
    }

    renderElement(this._filmsComponent.getElement(), this._mostCommentedComponent.getElement());
  }

  _renderFilmsBoard() {
    if (this._films.length === 0) {
      this._renderNoFilms; // todo Значение отображаемого текста зависит от выбранного фильтра
      return;
    }
    this._renderMainFilmsList();
    this._renderTopRated();
    this._renderMostCommented();
  }
}

export default FilmsBoard;