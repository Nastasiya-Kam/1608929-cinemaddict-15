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

    this._commentsWrapComponent = new CommentsWrapView(); //не будем удалять и переопределять. Обёртка для списка, загаловка и нового комментария
    this._commentsListTitleComponent = null;
    this._commentsListComponent = null;
    this._commentNewComponent = null;

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
    if (this._controlsComponent !== null) {
      remove(this._controlsComponent);
    }

    const {isWatchList, isWatched, isFavorite} = film;

    this._controlsComponent = new ControlsView({isWatchList, isWatched, isFavorite});
    this._controlsComponent.setOnWatchListClick(() => this._handleWatchListClick(film));
    this._controlsComponent.setOnWatchedClick(() => this._handleWatchedClick(film));
    this._controlsComponent.setOnFavoriteClick(() => this._handleFavoriteClick(film));

    render(this._filmDetailsComponent.getTopContainer(), this._controlsComponent);
  }

  _renderComments() {
    const comments = this._getComments();
    const length = comments.length;

    this._renderCommentsList(comments);
    this._renderCommentsTitle(length);
  }

  _renderCommentsTitle(length) {
    if (this._commentsListTitleComponent !== null) {
      remove(this._commentsListTitleComponent);
    }

    this._commentsListTitleComponent = new CommentsListTitleView(length);

    render(this._commentsWrapComponent, this._commentsListTitleComponent, RenderPosition.AFTERBEGIN);
  }

  _renderCommentsList(comments) {
    if (this._commentsListComponent !== null) {
      remove(this._commentsListComponent);
      if (this._commentsPresenter) {
        this._commentsPresenter.forEach((element) => element.destroy());
        this._commentsPresenter.clear();
      }
    }

    this._commentsListComponent = new CommentsListView(length);
    render(this._commentsWrapComponent, this._commentsListComponent, RenderPosition.AFTERBEGIN);

    comments.map((comment) => this._renderComment(comment));
  }

  _renderComment(comment) {
    const commentPresenter = new CommentView(comment);
    commentPresenter.setOnCommentDelete(this._handleCommentDelete);

    this._commentsPresenter.set(comment.id, commentPresenter);

    render(this._commentsListComponent, commentPresenter);
  }

  _renderCommentNew() {
    if (this._commentNewComponent !== null) {
      remove(this._commentNewComponent);
    }

    this._commentNewComponent = new CommentNewView();
    this._commentNewComponent.setOnCommentSubmit(this._handleCommentSubmit);

    render(this._commentsWrapComponent, this._commentNewComponent);
  }

  // _clearFilmDetails() {
  //   this._commentsPresenter.forEach((element) => element.destroy());
  //   this._commentsPresenter.clear();

  //   remove(this._commentsListTitleComponent);
  //   remove(this._commentsListComponent);
  // }

  _open() {
    this._filmDetailsComponent = new FilmDetailsView(this._film);
    this._filmDetailsComponent.setOnCloseButtonClick(this._handleCloseButtonClick);

    site.classList.add('hide-overflow');
    document.addEventListener('keydown', this._onEscKeydown);

    render(site, this._filmDetailsComponent);

    this.renderControls(this._film);

    render(this._filmDetailsComponent.getBottomContainer(), this._commentsWrapComponent);

    this._renderComments();
    this._renderCommentNew();

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
