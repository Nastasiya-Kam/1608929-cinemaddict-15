import SiteMenuView from '../view/site-menu.js';
import SortView from '../view/sort.js';
import NoFilmsView from '../view/no-films.js';
import FilmsView from '../view/films.js';
import FilmsListView from '../view/films-list.js';
import ShowMoreView from '../view/show-more.js';
import ProfileView from '../view/profile.js';

import CommentsModel from '../model/comments.js';

import {render, remove, RenderPosition} from '../utils/dom.js';
import {ListType} from '../utils/films.js';

import FilmPresenter from './film.js';
import FilmDetailsPresenter from './film-details.js';
import {SortType} from '../const.js';
import {sortDate, compareRating, compareCommentsAmount, generateFilter} from '../utils/filter.js';

const FILM_COUNT_PER_STEP = 5;
const EXTRA_FILM_COUNT = 2;

class FilmsBoard {
  constructor(filmsContainer, headerContainer, filmsModel) {
    this._filmsContainer = filmsContainer;
    this._headerContainer = headerContainer;
    this._filmsModel = filmsModel;

    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._filmPresenter = new Map();
    this._filmTopPresenter = new Map();
    this._filmMostCommentedPresenter = new Map();

    this._currentSortType = SortType.DEFAULT;

    this._profileComponent = null;
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

  init() {
    this._renderSort();
    this._renderSiteMenu();

    render(this._filmsContainer, this._filmsComponent);

    this._renderFilmsBoard();
  }

  _getFilms() {
    switch (this._currentSortType) {
      case SortType.DATE:
        return this._filmsModel.films.slice().sort(sortDate);
      case SortType.RATING:
        return this._filmsModel.films.slice().sort(compareRating);
    }

    return this._filmsModel.films;
  }

  _getTopRatedFilms() {
    return this._getFilms().sort(compareRating).slice(0, EXTRA_FILM_COUNT);
  }

  _getMostCommentedFilms() {
    return this._getFilms().sort(compareCommentsAmount).slice(0, EXTRA_FILM_COUNT);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
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
    const filter = generateFilter(this._getFilms());
    this._siteMenuComponent = new SiteMenuView(filter);

    render(this._filmsContainer, this._siteMenuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    this._sortComponent = new SortView(this._currentSortType);

    render(this._filmsContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setOnSortTypeChange(this._handleSortTypeChange);
  }

  _handleModeChange(updatedFilm) {
    this._filmDetailsPresenter.renderControls(updatedFilm);
    this._handleFilmChange(updatedFilm);
  }

  _handleFilmChange(updatedFilm) {
    // todo Вызов обновления модели
    this._getFilmPresenters().map((presenter) => {
      if (presenter.has(updatedFilm.id)) {
        presenter.get(updatedFilm.id).init(updatedFilm);
      }
    });

    if (this._filmDetailsPresenter.isOpened() && this._filmDetailsPresenter.isIdEqual(updatedFilm.id)) {
      this._filmDetailsPresenter.renderControls(updatedFilm);
    }
  }

  _getFilmPresenters() {
    return [this._filmPresenter, this._filmTopPresenter, this._filmMostCommentedPresenter];
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

  _clearFilmList() {
    this._getFilmPresenters()
      .map((presenter) => {
        presenter.forEach((element) => element.destroy());
        presenter.clear();
      });

    remove(this._profileComponent);
    remove(this._showMoreComponent);
  }

  _renderMainFilmsList() {
    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmCount, FILM_COUNT_PER_STEP));

    if (this._mainFilmsListComponent === null) {
      this._mainFilmsListComponent = new FilmsListView(ListType.MAIN.title, ListType.MAIN.isExtraList);
    }

    this._renderFilms(this._mainFilmsListComponent, films);

    render(this._filmsComponent, this._mainFilmsListComponent, RenderPosition.AFTERBEGIN);

    if (filmCount > FILM_COUNT_PER_STEP) {
      this._renderShowMore();
    }
  }

  _renderFilms(container, films, presenter = this._filmPresenter) {
    films.forEach((film) => this._renderFilm(container.getContainer(), film, presenter));
  }

  _handleShowMoreClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmCount, newRenderedFilmCount);

    this._renderFilms(this._mainFilmsListComponent, films);
    this._renderedFilmCount = newRenderedFilmCount;

    if (this._renderedFilmCount >= filmCount) {
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
  // _renderExtraFilmsList(component, type, films, presenter) {
  //   if (component === null) {
  //     component = new FilmsListView(type.TOP.title, type.TOP.isExtraList);
  //   }

  //   this._renderFilms(component, films, presenter);

  //   render(this._filmsComponent, component);
  // }

  _renderTopRated() {
    if (this._topRatedComponent === null) {
      this._topRatedComponent = new FilmsListView(ListType.TOP.title, ListType.TOP.isExtraList);
    }

    this._renderFilms(this._topRatedComponent, this._getTopRatedFilms(), this._filmTopPresenter);

    render(this._filmsComponent, this._topRatedComponent);
  }

  _renderMostCommented() {
    if (this._mostCommentedComponent === null) {
      this._mostCommentedComponent = new FilmsListView(ListType.MOST_COMMENTED.title, ListType.MOST_COMMENTED.isExtraList);
    }

    this._renderFilms(this._mostCommentedComponent, this._getMostCommentedFilms(), this._filmMostCommentedPresenter);

    render(this._filmsComponent, this._mostCommentedComponent);
  }

  _renderProfile() {
    const rating = generateFilter(this._getFilms()).watched;
    this._profileComponent = new ProfileView(rating);

    render(this._headerContainer, this._profileComponent);
  }

  _renderFilmsBoard() {
    const filmCount = this._getFilms().length;

    this._renderProfile();
    if (filmCount === 0) {
      this._renderNoFilms; // todo Значение отображаемого текста зависит от выбранного фильтра
      return;
    }

    this._renderMainFilmsList();

    if (!this._getFilms().every(this._checkZeroRating)) {
      this._renderTopRated();
    }

    if (!this._getFilms().every(this._checkZeroComments)) {
      this._renderMostCommented();
    }
  }
}

export default FilmsBoard;
