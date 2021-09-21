import {getFormattedCardDate} from '../utils/dates.js';
import {getShortDescription} from '../utils/films.js';
import {getDuration} from '../utils/films.js';
import AbstractView from './abstract.js';

const createCardFilmTemplate = (film) => {
  const {name, rating, release, duration, genres, img, description, comments, isWatchList, isWatched, isFavorite} = film;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${name}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${getFormattedCardDate(release)}</span>
        <span class="film-card__duration">${getDuration(duration)}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="${img}" alt="" class="film-card__poster">
      <p class="film-card__description">${getShortDescription(description)}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${(isWatchList) ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${(isWatched) ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${(isFavorite) ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};

class CardFilm extends AbstractView {
  constructor(film) {
    super();

    this._film = film;

    this._onPosterClick = this._onPosterClick.bind(this);
    this._onTitleClick = this._onTitleClick.bind(this);
    this._onCommentsClick = this._onCommentsClick.bind(this);
    this._onWatchListClick = this._onWatchListClick.bind(this);
    this._onWatchedClick = this._onWatchedClick.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);
  }

  getTemplate() {
    return createCardFilmTemplate(this._film);
  }

  setOnTitleClick(callback) {
    this._callback.titleClick = callback;
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._onTitleClick);
  }

  setOnCommentsClick(callback) {
    this._callback.commentsClick = callback;
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._onCommentsClick);
  }

  setOnPosterClick(callback) {
    this._callback.posterClick = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._onPosterClick);
  }

  setOnWatchListClick(callback) {
    this._callback.watchListClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._onWatchListClick);
  }

  setOnWatchedClick(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._onWatchedClick);
  }

  setOnFavoriteClick(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._onFavoriteClick);
  }

  _onTitleClick() {
    this._callback.titleClick();
  }

  _onCommentsClick(evt) {
    evt.preventDefault();
    this._callback.commentsClick();
  }

  _onPosterClick() {
    this._callback.posterClick();
  }

  _onWatchListClick() {
    this._callback.watchListClick();
  }

  _onWatchedClick() {
    this._callback.watchedClick();
  }

  _onFavoriteClick() {
    this._callback.favoriteClick();
  }
}

export default CardFilm;
