import AbstractView from './abstract.js';

const createControlsTemplate = (controls) => {
  const {isWatchList, isWatched, isFavorite} = controls;

  return (
    `<section class="film-details__controls">
      <button type="button" class="film-details__control-button${(isWatchList) ? ' film-details__control-button--active ' : ' '}film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
      <button type="button" class="film-details__control-button${(isWatched) ? ' film-details__control-button--active ' : ' '}film-details__control-button--watched" id="watched" name="watched">Already watched</button>
      <button type="button" class="film-details__control-button${(isFavorite) ? ' film-details__control-button--active ' : ' '}film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
    </section>`
  );
};

class Controls extends AbstractView {
  constructor(controls) {
    super();

    this._controls = controls;
    this._onWatchListClick = this._onWatchListClick.bind(this);
    this._onWatchedClick = this._onWatchedClick.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);
  }

  getTemplate() {
    return createControlsTemplate(this._controls);
  }

  setOnWatchListClick(callback) {
    this._callback.watchListClick = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._onWatchListClick);
  }

  setOnWatchedClick(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._onWatchedClick);
  }

  setOnFavoriteClick(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._onFavoriteClick);
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

export default Controls;
