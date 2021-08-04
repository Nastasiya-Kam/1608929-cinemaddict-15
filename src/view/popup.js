import {getReleaseDate} from '../utils.js';
import {createFilmCommentsTemplate} from './popup-comments.js';

const createGenresTemplate = (genres) => {
  let genresTemplate = '';

  for (const genre of genres) {
    genresTemplate += `<span class="film-details__genre">${genre}</span>`;
  }

  return genresTemplate;
};

const createControlsTemplate = (filmStatus) => {
  const {isWatchList, isWatched, isFavorite} = filmStatus;

  return (
    `<section class="film-details__controls">
      <button type="button" class="film-details__control-button${(isWatchList) ? ' film-details__control-button--active ' : ' '}film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
      <button type="button" class="film-details__control-button${(isWatched) ? ' film-details__control-button--active ' : ' '}film-details__control-button--watched" id="watched" name="watched">Already watched</button>
      <button type="button" class="film-details__control-button${(isFavorite) ? ' film-details__control-button--active ' : ' '}film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
    </section>`
  );
};

const createFilmDetailsTemplate = (film) => {
  const {img, age, name, original, rating, director, writers, actors, release, duration, country, genres, description} = film;
  const releaseDate = getReleaseDate(release);

  return (`<section class="film-details">
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
                  <td class="film-details__cell">${releaseDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${duration}</td>
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
          ${createControlsTemplate(film)}
        </div>

        <div class="film-details__bottom-container">${createFilmCommentsTemplate(film)}</div>
      </form>
    </section>`
  );
};

export {createFilmDetailsTemplate};
