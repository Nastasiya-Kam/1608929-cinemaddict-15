import FilmDetailsView from '../view/film-details.js';
import FilmCommentsView from '../view/film-comments.js';
import ControlsView from '../view/controls.js';
import {render, isEscEvent, remove} from '../utils/dom.js';
import {Settings, getUpdatedFilm} from '../utils/films.js';

const site = document.body; // todo добавить в конструктор

class FilmDetails {
  constructor(changeData) {
    this._changeData = changeData;
    this._isOpen = false;

    this._filmCommentsComponent = null;
    this._controlsComponent = null;

    this._open = this._open.bind(this);
    this._close = this._close.bind(this);
    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._onEscKeydown = this._onEscKeydown.bind(this);
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

  _open() {
    this._filmDetailsComponent = new FilmDetailsView(this._film);
    this._filmCommentsComponent = new FilmCommentsView(this._film.comments);

    site.classList.add('hide-overflow');
    document.addEventListener('keydown', this._onEscKeydown);

    this._filmDetailsComponent.setOnCloseButtonClick(this._handleCloseButtonClick);

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
    this._changeData(getUpdatedFilm(film, Settings.WATCH_LIST));
  }

  _handleWatchedClick(film) {
    this._changeData(getUpdatedFilm(film, Settings.WATCHED));
  }

  _handleFavoriteClick(film) {
    this._changeData(getUpdatedFilm(film, Settings.FAVORITE));
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
}

export default FilmDetails;
