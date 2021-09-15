// Временная замена сервера по генерации случайной даты и случайного id
import {nanoid} from 'nanoid';
import {getRandomInteger} from '../utils/common.js';
const generateDate = () => `${getRandomInteger(1950, 2021)}-${getRandomInteger(1, 12)}-${getRandomInteger(1, 28)}`;

import FilmDetailsView from '../view/film-details.js';

import CommentsWrapView from '../view/comments/comments-wrap.js';
import CommentsListTitleView from '../view/comments/comments-list-title.js';
import CommentsListView from '../view/comments/comments-list.js';
import CommentView from '../view/comments/comment.js';
import CommentNewView from '../view/comments/comment-new.js';

import ControlsView from '../view/controls.js';
import {render, isEscEvent, remove, RenderPosition} from '../utils/dom.js';
import {Settings, getUpdatedFilm, getUpdatedWatchedFilm} from '../utils/films.js';
import {UserAction, UpdateType} from '../const.js';

const site = document.body; // todo добавить в конструктор

class FilmDetails {
  constructor(changeData, filmsModel, commentsModel) {
    this._changeData = changeData;
    this._commentsModel = commentsModel;
    this._filmsModel = filmsModel;

    this._isOpen = false;

    this._commentsPresenter = new Map();

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
    this._handleFilmModelEvent = this._handleFilmModelEvent.bind(this);
    this._handleCommentsModelEvent = this._handleCommentsModelEvent.bind(this);
  }

  init(film) {
    this._film = film;
    this._commentsModel.setComments(this._comments);

    this._filmsModel.addObserver(this._handleFilmModelEvent);
    this._commentsModel.addObserver(this._handleCommentsModelEvent);

    if (this._isOpen) {
      this._close();
    }

    this._open();
  }

  _getComments() {
    return this._commentsModel.getComments();
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
    const comments = this._getComments().filter((comment) => comment.filmId === this._film.id);
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

    this._filmsModel.removeObserver(this._handleFilmModelEvent);
    this._commentsModel.removeObserver(this._handleCommentsModelEvent);
  }

  _getUpdatedComment(properties) {
    this._newComment = {
      filmId: this._film.id,
      id: nanoid(),
      author: 'Ilya O\'Reilly',
      comment: properties.comment,
      date: generateDate(),
      emotion: properties.emotion,
    };
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.ADD_COMMENT: {
        this._comments.push(this._newComment);
        this._commentsModel.addComment(updateType, this._newComment);
        const updatedComments = this._commentsModel.getComments().filter((comment) => comment.filmId === this._film.id);
        this._filmsModel.updateFilmComments(updateType, this._film.id, updatedComments);
        break;
      }
      case UserAction.DELETE_COMMENT: {
        this._comments = this._comments.filter((comment) => comment.id !== update.id);
        this._commentsModel.deleteComment(updateType, update);
        const updatedComments = this._commentsModel.getComments().filter((comment) => comment.filmId === this._film.id);
        this._filmsModel.updateFilmComments(updateType, this._film.id, updatedComments);
        break;
      }
      case UserAction.UPDATE_CONTROLS:
        this._api.updateFilm(update).then((response) => {
          this._filmsModel.updateFilm(updateType, response);
        });
        break;
    }
  }

  _handleFilmModelEvent(updateType, data) {
    if (this._film.id !== data.id) {
      return;
    }
    switch (updateType) {
      // если изменился фильм, для которого открыт попап, то обновляем инфо
      case UpdateType.FAVORITE_WATCHLIST:
      case UpdateType.WATCHED:
        this.renderControls(data);
        break;
    }
  }

  _handleCommentsModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.COMMENT_DELETED:
        // - действие при удалении комментария
        this._renderComments();
        break;
      case UpdateType.COMMENT_ADDED:
        // - действие при добавлении комментария
        this._renderComments();
        this._renderCommentNew();
        break;

    }
  }

  _handleWatchListClick(film) {
    this._handleViewAction(
      UserAction.UPDATE_CONTROLS,
      UpdateType.FAVORITE_WATCHLIST,
      getUpdatedFilm(film, Settings.WATCH_LIST));
  }

  _handleWatchedClick(film) {
    this._handleViewAction(
      UserAction.UPDATE_CONTROLS,
      UpdateType.WATCHED,
      getUpdatedWatchedFilm(film));
  }

  _handleFavoriteClick(film) {
    this._handleViewAction(
      UserAction.UPDATE_CONTROLS,
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

  _handleCommentSubmit(newComment) {
    this._getUpdatedComment(newComment);

    this._handleViewAction(
      UserAction.ADD_COMMENT,
      UpdateType.COMMENT_ADDED,
      newComment,
    );
  }

  _handleCommentDelete(comment) {
    this._handleViewAction(
      UserAction.DELETE_COMMENT,
      UpdateType.COMMENT_DELETED,
      comment,
    );
  }
}

export default FilmDetails;
