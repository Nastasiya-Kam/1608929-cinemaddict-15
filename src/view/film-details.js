import {getReleaseDate, getDuration} from '../utils/dates.js';
import AbstractView from './abstract.js';

const createGenresTemplate = (genres) => genres
  .map((genre) => `<span class="film-details__genre">${genre}</span>`)
  .join('');

const createFilmDetailsTemplate = (film) => {
  const {img, age, name, original, rating, director, writers, actors, release, duration, country, genres, description} = film;

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${img}" alt="">

              <p class="film-details__age">${age}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${name}</h3>
                  <p class="film-details__title-original">Original: ${original}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${getReleaseDate(release)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${getDuration(duration)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${(genres.length > 1) ? 'Genres' : 'Genre'}</td>
                  <td class="film-details__cell">${createGenresTemplate(genres)}</td>
                </tr>
              </table>

              <p class="film-details__film-description">${description}</p>
            </div>
          </div>
        </div>

        <div class="film-details__bottom-container"></div>
      </form>
    </section>`
  );
};

class FilmDetails extends AbstractView {
  constructor(film) {
    super();

    this._film = film;
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film);
  }

  _onCloseButtonClick() {
    this._callback.closeButtonClick();
  }

  setOnCloseButtonClick(callback) {
    this._callback.closeButtonClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._onCloseButtonClick);
  }

  getTopContainer() {
    return this.getElement().querySelector('.film-details__top-container');
  }

  getBottomContainer() {
    return this.getElement().querySelector('.film-details__bottom-container');
  }
}

export default FilmDetails;
