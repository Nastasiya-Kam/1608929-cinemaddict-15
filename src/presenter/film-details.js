import FilmDetailsView from '../view/film-details.js';
import FilmCommentsView from '../view/film-comments.js';
import ControlsView from '../view/controls.js';
import {render, isEscEvent, remove} from '../utils/dom.js';
import {Settings, getUpdatedFilm} from '../utils/films.js';
import {UserAction, UpdateType} from '../const.js';

import CommentsModel from '../model/comments.js';

const site = document.body; // todo добавить в конструктор

class FilmDetails {
  constructor(changeData) {
    this._changeData = changeData;
    this._isOpen = false;

    this._commentsModel = new CommentsModel();

    this._filmCommentsComponent = null;
    this._controlsComponent = null;

    this._open = this._open.bind(this);
    this._close = this._close.bind(this);
    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._onEscKeydown = this._onEscKeydown.bind(this);
    this._handleCommentSubmit = this._handleCommentSubmit.bind(this);
    this._handleCommentDelete = this._handleCommentDelete.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    // this._handleModelEvent = this._handleModelEvent.bing(this);

    this._commentsModel.addObserver(this._handleModelEvent);
  }

  init(film) {
    this._film = film;

    if (this._isOpen) {
      this._close();
    }

    this._open();
  }

  isOpened() {
    return this._isOpen;
  }

  isIdEqual(id) {
    return this._film.id === id;
  }

  renderControls(film) {
    if (this._isOpen) {
      remove(this._controlsComponent);
    }

    const {isWatchList, isWatched, isFavorite} = film;

    this._controlsComponent = new ControlsView({isWatchList, isWatched, isFavorite});

    render(this._filmDetailsComponent.getTopContainer(), this._controlsComponent);

    this._controlsComponent.setOnWatchListClick(() => this._handleWatchListClick(film));
    this._controlsComponent.setOnWatchedClick(() => this._handleWatchedClick(film));
    this._controlsComponent.setOnFavoriteClick(() => this._handleFavoriteClick(film));
  }

  _getComments() {
    this._commentsModel.comments = this._film.comments;

    return this._commentsModel.comments;
  }

  _handleViewAction(actionType, updateType, update) {
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(updateType, update);
        break;
    }
  }

  // _handleModelEvent(updateType, data) {
  //   В зависимости от типа изменений решаем, что делать:
  // - действие при удалении комментария
  // - действие при добавлении комментария
  //   switch (updateType) {
  //   case UpdateType.PATCH:
  //     // - обновить часть списка (всех трёх) (например, когда удалили/добавили комментарий)
  //     this._getFilmPresenters().map((presenter) => {
  //       if (presenter.has(data.id)) {
  //         presenter.get(data.id).init(data);
  //       }
  //     });
  //     break;
  //   case UpdateType.MINOR:
  //     // - обновить список (например, когда фильм добавили в избранное, просмотренное или буду смотреть)
  //     this._clearFilmsBoard();
  //     this._renderFilmsBoard();
  //     break;
  //   case UpdateType.MAJOR:
  //     // - обновить всю страницу фильмов (например, при переключении фильтра)
  //     this._clearFilmsBoard({resetSortType: true});
  //     this._renderFilmsBoard();
  //     break;
  //   }
  // }

  _open() {
    this._filmDetailsComponent = new FilmDetailsView(this._film);
    this._filmCommentsComponent = new FilmCommentsView(this._getComments());

    site.classList.add('hide-overflow');
    document.addEventListener('keydown', this._onEscKeydown);

    this._filmDetailsComponent.setOnCloseButtonClick(this._handleCloseButtonClick);
    this._filmCommentsComponent.setOnCommentSubmit(this._handleCommentSubmit);
    this._filmCommentsComponent.setOnCommentDelete(this._handleCommentDelete);

    render(site, this._filmDetailsComponent);
    render(this._filmDetailsComponent.getBottomContainer(), this._filmCommentsComponent);
    this.renderControls(this._film);

    this._isOpen = true;
  }

  _close() {
    document.removeEventListener('keydown', this._onEscKeydown);
    site.classList.remove('hide-overflow');
    remove(this._filmDetailsComponent);
    this._isOpen = false;
  }

  _handleWatchListClick(film) {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.FAVORITE_WATCHLIST,
      getUpdatedFilm(film, Settings.WATCH_LIST));
  }

  _handleWatchedClick(film) {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.WATCHED,
      getUpdatedFilm(film, Settings.WATCHED));
  }

  _handleFavoriteClick(film) {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.FAVORITE_WATCHLIST,
      getUpdatedFilm(film, Settings.FAVORITE));
  }

  _handleCloseButtonClick() {
    this._close();
  }

  _onEscKeydown(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._handleCloseButtonClick();
    }
  }

  _handleCommentSubmit() {
    // this._changeData(
    //   UserAction.UPDATE_FILM,
    //   UpdateType.MINOR,
    //   comment,
    // );

    // ?добавили комментарий к списку комментариев
  }

  _handleCommentDelete() { //(comment)
    //удалить комментарий, по которому был клик
    // this._changeData(
    //   UserAction.DELETE_TASK,
    //   UpdateType.MINOR,
    //   comment,
    // );
  }
}

export default FilmDetails;
