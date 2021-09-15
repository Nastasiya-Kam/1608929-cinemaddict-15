import SortView from '../view/sort.js';
import NoFilmsView from '../view/no-films.js';
import FilmsView from '../view/films.js';
import FilmsListView from '../view/films-list.js';
import ShowMoreView from '../view/show-more.js';
import LoadingView from '../view/loading.js';

import {render, remove, RenderPosition, replace} from '../utils/dom.js';
import {ListType} from '../utils/films.js';
import {FilterType, filter} from '../utils/filter.js';

import FilmPresenter from './film.js';
import FilmDetailsPresenter from './film-details.js';
import {SortType, UpdateType, UserAction} from '../const.js';
import {sortDate, compareRating, compareCommentsAmount} from '../utils/filter.js';

const FILM_COUNT_PER_STEP = 5;
const EXTRA_FILM_COUNT = 2;

class FilmsBoard {
  constructor(filmsContainer, headerContainer, filmsModel, commentsModel, filterModel) {
    this._filmsContainer = filmsContainer;
    this._headerContainer = headerContainer;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;

    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._filterType = FilterType.ALL;
    this._filmPresenter = new Map();
    this._filmTopPresenter = new Map();
    this._filmMostCommentedPresenter = new Map();

    this._isLoading = true;

    this._currentSortType = SortType.DEFAULT;

    this._mainFilmsListComponent = null;
    this._mostCommentedComponent = null;
    this._topRatedComponent = null;
    this._sortComponent = null;
    this._showMoreComponent = null;
    this._noFilmsComponent = null;

    this._filmsComponent = new FilmsView();
    this._loadingComponent = new LoadingView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleShowMoreClick = this._handleShowMoreClick.bind(this);
    this._openDetails = this._openDetails.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleFilmModelEvent = this._handleFilmModelEvent.bind(this);

    this._filmDetailsPresenter = new FilmDetailsPresenter(this._handleViewAction, this._filmsModel, this._commentsModel);
  }

  init() {
    this._filmsModel.addObserver(this._handleFilmModelEvent);
    this._filterModel.addObserver(this._handleFilmModelEvent);

    this._renderFilmsBoard({renderTopRated: true, renderMostCommented: true});
  }

  destroy() {
    this._clearFilmsBoard({resetRenderedFilmCount: true, resetSortType: true});

    this._filmTopPresenter.forEach((element) => element.destroy());
    this._filmTopPresenter.clear();
    this._filmMostCommentedPresenter.forEach((element) => element.destroy());
    this._filmMostCommentedPresenter.clear();

    remove(this._sortComponent);
    this._sortComponent = null;
    remove(this._filmsComponent);

    this._filmsModel.removeObserver(this._handleFilmModelEvent);
    this._filterModel.removeObserver(this._handleFilmModelEvent);
  }

  _getFilms() {
    this._filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[this._filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredFilms.slice().sort(sortDate);
      case SortType.RATING:
        return filteredFilms.slice().sort(compareRating);
    }

    return filteredFilms;
  }

  _getTopRatedFilms() {
    return this._getFilms().slice().sort(compareRating).slice(0, EXTRA_FILM_COUNT);
  }

  _getMostCommentedFilms() {
    return this._getFilms().slice().sort(compareCommentsAmount).slice(0, EXTRA_FILM_COUNT);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this._clearFilmsBoard({resetRenderedFilmCount: true});
    this._renderFilmsBoard({renderTopRated: false, renderMostCommented: false});
  }

  _renderSort() {
    const prevSortComponent = this._sortComponent;

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setOnSortTypeChange(this._handleSortTypeChange);

    if (prevSortComponent === null) {
      render(this._filmsContainer, this._sortComponent);
      return;
    }

    replace(this._sortComponent, prevSortComponent);
    remove(prevSortComponent);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_CONTROLS:
        // следим за кликами по контролам
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.UPDATE_COMMENTS:
        // следим за изменением кол-ва комментариев
        this._filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  _handleFilmModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.FAVORITE_WATCHLIST:
      case UpdateType.WATCHED:
        // кликнули по контролам:
        // - обновить инфо о фильме в списках
        this._getFilmPresenters().map((presenter) => {
          if (presenter.has(data.id)) {
            presenter.get(data.id).init(data);
          }
        });
        // если установлен фильтр, то необходимо перерисовать основной список
        if (this._filterModel.getFilter() !== FilterType.ALL) {
          this._clearFilmsBoard({resetRenderedFilmCount: false, resetSortType: true});
          this._renderFilmsBoard({renderTopRated: false, renderMostCommented: false});
        }
        break;
      case UpdateType.COMMENT_ADDED:
      case UpdateType.COMMENT_DELETED:
        // удалили/добавили комментарий:
        // - перерисовать карточку в трёх местах
        this._getFilmPresenters().map((presenter) => {
          if (presenter.has(data.id)) {
            presenter.get(data.id).init(data);
          }
        });
        // - перерисовать список most commented
        remove(this._mostCommentedComponent);
        this._renderMostCommented();
        break;
      case UpdateType.FILTER_CHANGED:
        // - обновить всю страницу фильмов
        // при смене фильтра/сортировки (если фильтру соответствует больше 5 фильмов, то первые пять + кнопка)
        // при переключении с экрана с фильмами на экран статистики и  обратно сортировка сбрасывается до default
        this._clearFilmsBoard({resetRenderedFilmCount: true, resetSortType: true});
        this._renderFilmsBoard({renderTopRated: false, renderMostCommented: false});
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderFilmsBoard();
        break;
    }
  }

  _getFilmPresenters() {
    return [this._filmPresenter, this._filmTopPresenter, this._filmMostCommentedPresenter];
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

    this._filmPresenter.forEach((element) => element.destroy());
    this._filmPresenter.clear();

    remove(this._loadingComponent);
    remove(this._showMoreComponent);

    if (this._noFilmsComponent) {
      remove(this._noFilmsComponent);
    }

    if (resetRenderedFilmCount) {
      this._renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this._renderedFilmCount = (filmCount < FILM_COUNT_PER_STEP) ? FILM_COUNT_PER_STEP : Math.min(filmCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderNoFilms() {
    this._noFilmsComponent = new NoFilmsView(this._filterType);

    if (this._mainFilmsListComponent === null) {
      render(this._filmsComponent, this._noFilmsComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._noFilmsComponent, this._mainFilmsListComponent);
    this._mainFilmsListComponent = null;
  }

  _renderLoading() {
    render(this._filmsContainer, this._loadingComponent);
  }

  _renderMainFilmsList() {
    const filmCount = this._getFilms().length;

    if (this._renderedFilmCount % FILM_COUNT_PER_STEP !== 0) {
      this._renderedFilmCount = this._renderedFilmCount + (this._renderedFilmCount % FILM_COUNT_PER_STEP);
    }

    const films = this._getFilms().slice(0, Math.min(filmCount, this._renderedFilmCount));

    if (this._mainFilmsListComponent === null) {
      this._mainFilmsListComponent = new FilmsListView(ListType.MAIN.title, ListType.MAIN.isExtraList);
    }

    if (this._noFilmsComponent !== null) {
      replace(this._mainFilmsListComponent, this._noFilmsComponent);
      this._noFilmsComponent = null;
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

  _renderFilmsBoard({renderTopRated = true, renderMostCommented = true} = {}) {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const filmCount = this._getFilms().length;

    this._renderSort();

    render(this._filmsContainer, this._filmsComponent);

    if (filmCount === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderMainFilmsList();

    if (renderTopRated) {
      if (!this._getFilms().every(this._checkZeroRating)) {
        this._renderTopRated();
      }
    }

    if (renderMostCommented) {
      if (!this._getFilms().every(this._checkZeroComments)) {
        this._renderMostCommented();
      }
    }
  }
}

export default FilmsBoard;
