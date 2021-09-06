import SiteMenuView from '../view/site-menu.js';
import SortView from '../view/sort.js';
import NoFilmsView from '../view/no-films.js';
import FilmsView from '../view/films.js';
import FilmsListView from '../view/films-list.js';
import ShowMoreView from '../view/show-more.js';
import ProfileView from '../view/profile.js';

import {render, remove, RenderPosition} from '../utils/dom.js';
import {ListType} from '../utils/films.js';

import FilmPresenter from './film.js';
import FilmDetailsPresenter from './film-details.js';
import {SortType, UpdateType, UserAction} from '../const.js';
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
    this._showMoreComponent = null;

    this._filmsComponent = new FilmsView();
    this._noFilmsComponent = new NoFilmsView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleShowMoreClick = this._handleShowMoreClick.bind(this);
    this._openDetails = this._openDetails.bind(this);

    this._filmDetailsPresenter = new FilmDetailsPresenter(this._handleViewAction);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
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

    this._clearFilmsBoard();
    this._renderFilmsBoard();
  }

  _renderSiteMenu() {
    const filter = generateFilter(this._getFilms());
    this._siteMenuComponent = new SiteMenuView(filter);

    render(this._filmsContainer, this._siteMenuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setOnSortTypeChange(this._handleSortTypeChange);

    render(this._filmsContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _handleViewAction(actionType, updateType, update) {
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_CONTROLS:
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.UPDATE_COMMENTS:
        this._filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    // В зависимости от типа изменений решаем, что делать:
    switch (updateType) {
      case UpdateType.FAVORITE_WATCHLIST:
        // - обновить инфо о фильме
        this._getFilmPresenters().map((presenter) => {
          if (presenter.has(data.id)) {
            presenter.get(data.id).init(data);
          }
        });

        // - обновить фильтры
        remove(this._siteMenuComponent);
        this._renderSiteMenu();

        if (this._filmDetailsPresenter.isOpened()) {
          this._filmDetailsPresenter.renderControls(data);
        }

        break;
      case UpdateType.WATCHED:
        // Если пользователь добавил/удалил из просмотренного, то нужно
        // - обновить инфо о фильме
        this._getFilmPresenters().map((presenter) => {
          if (presenter.has(data.id)) {
            presenter.get(data.id).init(data);
          }
        });

        // - обновить фильтр
        remove(this._siteMenuComponent);
        // - обновить рейтинг пользователя
        remove(this._profileComponent);
        this._renderSiteMenu();
        this._renderProfile();

        if (this._filmDetailsPresenter.isOpened()) {
          this._filmDetailsPresenter.renderControls(data);
        }

        break;
      case UpdateType.MINOR:
        // - удалили/добавили комментарий
        // - перерисовать карточку в трёх местах
        this._getFilmPresenters().map((presenter) => {
          if (presenter.has(data.id)) {
            presenter.get(data.id).init(data);
          }
        });
        // *если попап открыт, то и его перерисовать - перерисовка происходит в film-details
        // - перерисовать список most commented
        remove(this._mostCommentedComponent);
        this._renderMostCommented();
        break;
      case UpdateType.MAJOR:
        // - обновить всю страницу фильмов
        // при смене фильтра (если фильтру соответствует больше 5 фильмов, то первые пять + кнопка)
        // ?ВОПРОС: в ТЗ не указано какое кол-во фильмов должно оставаться при сортировке

        // при переключении с экрана с фильмами на экран статистики и  обратно сортировка сбрасывается до default
        // ?ВОПРОС: а что происходит с кол-вом показанных фильмов, всё схлопывается до 5?
        this._clearFilmsBoard({resetRenderedFilmCount: true, resetSortType: true});
        this._renderFilmsBoard();
        break;
    }
  }

  _getFilmPresenters() {
    return [this._filmPresenter, this._filmTopPresenter, this._filmMostCommentedPresenter];
  }

  _renderNoFilms() {
    render(this._filmsComponent, this._noFilmsComponent);
  }

  _renderFilm(container, film, presenter) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._openDetails);

    filmPresenter.init(film);

    presenter.set(film.id, filmPresenter);
  }

  _openDetails(film) {
    this._filmDetailsPresenter.init(film);
  }

  _clearFilmsBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;

    this._getFilmPresenters()
      .map((presenter) => {
        presenter.forEach((element) => element.destroy());
        presenter.clear();
      });

    remove(this._profileComponent);
    remove(this._siteMenuComponent);
    remove(this._sortComponent);
    remove(this._noFilmsComponent);
    remove(this._showMoreComponent);

    if (resetRenderedFilmCount) {
      // Фильтрация: сброс до 5
      this._renderedFilmCount = FILM_COUNT_PER_STEP; //?Нужно ли выбрать через Math.min, если фильмов меньше
    } else {
      // ?Сортировка: не сбрасываем, сортируем что есть
      // предусматриваем перерисовку фильма, если находять, например, в фильтре избранного, у фильма снята пометка избранного
      this._renderedFilmCount = Math.min(filmCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderMainFilmsList() {
    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmCount, this._renderedFilmCount));

    if (this._mainFilmsListComponent === null) {
      this._mainFilmsListComponent = new FilmsListView(ListType.MAIN.title, ListType.MAIN.isExtraList);
    }

    this._renderFilms(this._mainFilmsListComponent, films);

    render(this._filmsComponent, this._mainFilmsListComponent, RenderPosition.AFTERBEGIN);

    if (filmCount > this._renderedFilmCount) {
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
    if (this._showMoreComponent !== null) {
      this._showMoreComponent = null;
    }

    this._showMoreComponent = new ShowMoreView();
    this._showMoreComponent.setOnShowMoreClick(this._handleShowMoreClick);

    render(this._mainFilmsListComponent, this._showMoreComponent);
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
    this._renderSort();
    this._renderSiteMenu();

    if (filmCount === 0) {
      this._renderNoFilms(); // todo Значение отображаемого текста зависит от выбранного фильтра
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
