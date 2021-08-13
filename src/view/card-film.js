import {getCardDate} from '../utils/dates.js';
import AbstractView from './abstract.js';

const MAX_LENGTH_DESCRIPTION = 140;

const createCardFilmTemplate = (film) => {
  const {name, rating, release, duration, genres, img, description, comments, isWatchList, isWatched, isFavorite} = film;

  const descriptionSliced = (description.length > 140)
    ? `${description.slice(0, MAX_LENGTH_DESCRIPTION - 1)}...`
    : description;
  const date = getCardDate(release);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${name}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${date}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="./images/posters/${img}" alt="" class="film-card__poster">
      <p class="film-card__description">${descriptionSliced}</p>
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
    this._onControlsClick = this._onControlsClick.bind(this);
  }

  getTemplate() {
    return createCardFilmTemplate(this._film);
  }

  _onPosterClick() {
    this._callback.posterClick();
  }

  setOnPosterClick(callback) {
    this._callback.posterClick = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._onPosterClick);
  }

  _onTitleClick() {
    this._callback.titleClick();
  }

  setOnTitleClick(callback) {
    this._callback.titleClick = callback;
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._onTitleClick);
  }

  _onCommentsClick(evt) {
    evt.preventDefault();
    this._callback.commentsClick();
  }

  setOnCommentsClick(callback) {
    this._callback.commentsClick = callback;
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._onCommentsClick);
  }

  _onControlsClick(evt) {
    this._callback.controlsClick(evt);
  }

  setOnControlsClick(callback) {
    this._callback.controlsClick = callback;
    this.getElement().querySelector('.film-card__controls').addEventListener('click', this._onControlsClick);
  }
}

export default CardFilm;
