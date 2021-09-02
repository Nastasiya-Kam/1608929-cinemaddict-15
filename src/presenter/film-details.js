import FilmDetailsView from '../view/film-details.js';
import {render, isEscEvent, remove} from '../utils/dom.js';
import {Settings, getUpdatedFilm} from '../utils/films.js';

const site = document.body; // todo добавить в конструктор

class FilmDetails {
  constructor(changeData) {
    this._changeData = changeData;
    this._isOpen = false;

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

    // todo Несохранённые изменения (неотправленный комментарий) пропадают.
  }

  _open() {
    this._filmDetailsComponent = new FilmDetailsView(this._film);

    site.classList.add('hide-overflow');
    document.addEventListener('keydown', this._onEscKeydown);

    this._filmDetailsComponent.setOnWatchListClick(this._handleWatchListClick);
    this._filmDetailsComponent.setOnWatchedClick(this._handleWatchedClick);
    this._filmDetailsComponent.setOnFavoriteClick(this._handleFavoriteClick);
    this._filmDetailsComponent.setOnCloseButtonClick(this._handleCloseButtonClick);

    render(site, this._filmDetailsComponent);

    this._isOpen = true;
  }

  _close() {
    document.removeEventListener('keydown', this._onEscKeydown);
    site.classList.remove('hide-overflow');
    remove(this._filmDetailsComponent);
    this._isOpen = false;
  }

  // ?Вопросик. Переделала Mode на булин isOpen.
  // ?Тогда можно ли (лучше ли) сделать переменную доступной (т.е. переименовать в isOpen),
  // ?чтобы в презентере обращаться не к методу this._filmDetailsPresenter.isOpened(), а просто к переменной this._filmDetailsPresenter.isOpen?
  isOpened() {
    return this._isOpen;
  }

  isIdEqual(id) {
    return this._film.id === id;
  }

  _handleWatchListClick() {
    this._changeData(getUpdatedFilm(this._film, Settings.WATCH_LIST));
  }

  _handleWatchedClick() {
    this._changeData(getUpdatedFilm(this._film, Settings.WATCHED));
  }

  _handleFavoriteClick() {
    this._changeData(getUpdatedFilm(this._film, Settings.FAVORITE));
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
