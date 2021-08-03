import dayjs from 'dayjs';

const MAX_LENGTH_DESCRIPTION = 140;

const createCardFilmTemplate = (film) => {
  const {name, rating, release, runtime, genres, img, description, comments, isWatchList, isWatched, isFavorite} = film;

  const descriptionSliced = (description.length > 140) ? `${description.slice(0, MAX_LENGTH_DESCRIPTION - 1)}...` : description;
  const date = dayjs(release).format('YYYY');

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${name}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${date}</span>
        <span class="film-card__duration">${runtime}</span>
        <span class="film-card__genre">${genres}</span>
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

export {createCardFilmTemplate};
