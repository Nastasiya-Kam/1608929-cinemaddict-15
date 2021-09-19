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
  constructor(filmsContainer, headerContainer, filmsModel, commentsModel, filterModel, api) {
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
    this._api = api;

    this._currentSortType = SortType.DEFAULT;

    this._mainFilmsListComponent = null;
    this._mostCommentedComponent = null;
    this._topRatedComponent = null;
    this._sortComponent = null;
    this._showMoreComponent = null;
    this._noFilmsComponent = null;

    this._filmsComponent = null;
    this._loadingComponent = new LoadingView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleShowMoreClick = this._handleShowMoreClick.bind(this);
    this._openDetails = this._openDetails.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleFilmModelEvent = this._handleFilmModelEvent.bind(this);

    this._filmDetailsPresenter = new FilmDetailsPresenter(this._handleViewAction, this._filmsModel, this._commentsModel, this._api);
  }

  init() {
    this._filmsModel.addObserver(this._handleFilmModelEvent);
    this._filterModel.addObserver(this._handleFilmModelEvent);

    this._renderFilmsBoard({renderTopRated: true, renderMostCommented: true});
  }

  destroy() {
    this._clearFilmsBoard({resetRenderedFilmCount: true, resetSortType: true});

    remove(this._sortComponent);
    remove(this._mainFilmsListComponent);
    remove(this._topRatedComponent);
    remove(this._mostCommentedComponent);
    remove(this._filmsComponent);
    this._sortComponent = null;
    this._mainFilmsListComponent = null;
    this._topRatedComponent = null;
    this._mostCommentedComponent = null;
    this._filmsComponent = null;

    this._filmsModel.removeObserver(this._handleFilmModelEvent);
    this._filterModel.removeObserver(this._handleFilmModelEvent);
  }

  _clearFilmsBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().currentFilteredfilms.length;

    this._getFilmPresenters((presenter) => {
      presenter.forEach((element) => element.destroy());
      presenter.clear();
    });

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

  _getFilms() {
    this._filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    let filteredFilms = filter[this._filterType](films);
    const topRatedFilms = films.slice().filter((film) => film.rating !== 0).sort(compareRating).slice(0, EXTRA_FILM_COUNT);
    const mostCommentedFilms = films.slice().filter((film) => film.comments.length !== 0).sort(compareCommentsAmount).slice(0, EXTRA_FILM_COUNT);

    switch (this._currentSortType) {
      case SortType.DATE:
        filteredFilms = filteredFilms.slice().sort(sortDate);
        break;
      case SortType.RATING:
        filteredFilms = filteredFilms.slice().sort(compareRating);
        break;
    }

    return {
      currentFilteredfilms: filteredFilms,
      topRatedFilms: topRatedFilms,
      mostCommentedFilms: mostCommentedFilms,
    };
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

  _getFilmPresenters() {
    return [this._filmPresenter, this._filmTopPresenter, this._filmMostCommentedPresenter];
  }

  _renderFilm(container, film, presenter) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._openDetails);
    filmPresenter.init(film);
    presenter.set(film.id, filmPresenter);
  }

  _openDetails(film) {
    this._filmDetailsPresenter.open(film);
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
    const prevMainFilmsListComponent = this._mainFilmsListComponent;

    const filmCount = this._getFilms().currentFilteredfilms.length;

    if (this._renderedFilmCount % FILM_COUNT_PER_STEP !== 0) {
      this._renderedFilmCount = this._renderedFilmCount + (this._renderedFilmCount % FILM_COUNT_PER_STEP);
    }

    const films = this._getFilms().currentFilteredfilms.slice(0, Math.min(filmCount, this._renderedFilmCount));

    this._mainFilmsListComponent = new FilmsListView(ListType.MAIN.title, ListType.MAIN.isExtraList);

    if (this._noFilmsComponent !== null) {
      replace(this._mainFilmsListComponent, this._noFilmsComponent);
      this._noFilmsComponent = null;
    }

    this._renderFilms(this._mainFilmsListComponent, films);

    if (prevMainFilmsListComponent === null) {
      render(this._filmsComponent, this._mainFilmsListComponent, RenderPosition.AFTERBEGIN);
    } else {
      replace(this._mainFilmsListComponent, prevMainFilmsListComponent);
      remove(prevMainFilmsListComponent);
    }

    if (filmCount > this._renderedFilmCount) {
      this._renderShowMore();
    }
  }

  _renderFilms(container, films, presenter = this._filmPresenter) {
    films.forEach((film) => this._renderFilm(container.getContainer(), film, presenter));
  }

  _renderShowMore() {
    if (this._showMoreComponent !== null) {
      this._showMoreComponent = null;
    }

    this._showMoreComponent = new ShowMoreView();
    this._showMoreComponent.setOnShowMoreClick(this._handleShowMoreClick);

    render(this._mainFilmsListComponent, this._showMoreComponent);
  }

  _renderExtraFilmsList(component, type, films, presenter) {
    const prevComponent = component;

    component = new FilmsListView(type.title, type.isExtraList);
    this._renderFilms(component, films, presenter);

    if (prevComponent === null) {
      render(this._filmsComponent, component);
      return component;
    }

    replace(component, prevComponent);
    remove(prevComponent);

    return component;
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_CONTROLS:
        this._api.updateFilm(update).then((response) => {
          this._filmsModel.updateFilm(updateType, response);
        });
        break;
      case UserAction.UPDATE_COMMENTS:
        this._api.updateFilm(update).then((response) => {
          this._filmsModel.updateFilm(updateType, response);
        });
        break;
    }
  }

  _handleFilmModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.FAVORITE_WATCHLIST:
      case UpdateType.WATCHED:
        this._getFilmPresenters().map((presenter) => {
          if (presenter.has(data.id)) {
            presenter.get(data.id).init(data);
          }
        });

        if (this._filterModel.getFilter() !== FilterType.ALL) {
          this._clearFilmsBoard({resetRenderedFilmCount: false, resetSortType: false});
          this._renderFilmsBoard({renderTopRated: true, renderMostCommented: true});
        }
        break;
      case UpdateType.COMMENT_ADDED:
      case UpdateType.COMMENT_DELETED:
        this._getFilmPresenters().map((presenter) => {
          if (presenter.has(data.id)) {
            presenter.get(data.id).init(data);
          }
        });

        remove(this._mostCommentedComponent);
        this._mostCommentedComponent = null;

        if (this._getFilms().mostCommentedFilms.length !== 0) {
          this._mostCommentedComponent = this._renderExtraFilmsList(this._mostCommentedComponent, ListType.MOST_COMMENTED, this._getFilms().mostCommentedFilms, this._filmMostCommentedPresenter);
        }
        break;
      case UpdateType.FILTER_CHANGED:
        this._clearFilmsBoard({resetRenderedFilmCount: true, resetSortType: true});
        this._renderFilmsBoard({renderTopRated: true, renderMostCommented: true});
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderFilmsBoard();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this._clearFilmsBoard({resetRenderedFilmCount: true});
    this._renderFilmsBoard({renderTopRated: false, renderMostCommented: false});
  }

  _handleShowMoreClick() {
    const filmCount = this._getFilms().currentFilteredfilms.length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this._getFilms().currentFilteredfilms.slice(this._renderedFilmCount, newRenderedFilmCount);

    this._renderFilms(this._mainFilmsListComponent, films);
    this._renderedFilmCount = newRenderedFilmCount;

    if (this._renderedFilmCount >= filmCount) {
      remove(this._showMoreComponent);
    }
  }

  _renderFilmsBoard({renderTopRated = true, renderMostCommented = true} = {}) {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const films = this._getFilms();
    const filmCount = films.currentFilteredfilms.length;

    this._renderSort();

    if (this._filmsComponent === null) {
      this._filmsComponent = new FilmsView();
      render(this._filmsContainer, this._filmsComponent);
    }

    if (filmCount === 0) {
      this._renderNoFilms();
    } else {
      this._renderMainFilmsList();
    }

    if (renderTopRated) {
      if (films.topRatedFilms.length !== 0) {
        this._topRatedComponent = this._renderExtraFilmsList(this._topRatedComponent, ListType.TOP, films.topRatedFilms, this._filmTopPresenter);
      }
    }

    if (renderMostCommented) {
      if (films.mostCommentedFilms.length !== 0) {
        this._mostCommentedComponent = this._renderExtraFilmsList(this._mostCommentedComponent, ListType.MOST_COMMENTED, films.mostCommentedFilms, this._filmMostCommentedPresenter);
      }
    }
  }
}

export default FilmsBoard;
