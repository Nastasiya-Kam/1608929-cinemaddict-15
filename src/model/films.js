import AbstractObserver from '../utils/abstract-observer.js';

class Films extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  updateFilmComments(updateType, id, update) {
    const indexFilm = this._films.findIndex((film) => film.id === id);

    if (indexFilm === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    const currentFilm = this._films[indexFilm];
    const currentComments = update.map((comment) => comment.id);

    currentFilm.comments = currentComments;

    this._notify(updateType, currentFilm);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        name: film['film_info']['title'],
        original: film['film_info']['alternative_title'],
        img: film['film_info']['poster'],
        description: film['film_info']['description'],
        rating: film['film_info']['total_rating'],
        release: film['film_info']['release']['date'],
        duration: film['film_info']['runtime'],
        genres: film['film_info']['genre'],
        director:	film['film_info']['director'],
        writers:	film['film_info']['writers'].map((writer) => writer).join(', '),
        actors:	film['film_info']['actors'].map((actor) => actor).join(', '),
        country:	film['film_info']['release']['release_country'],
        age: `${film['film_info']['age_rating']}+`,
        isWatchList: film['user_details']['watchlist'],
        watchingDate: film['user_details']['watching_date'],
        isWatched: film['user_details']['already_watched'],
        isFavorite: film['user_details']['favorite'],
      },
    );

    // Ненужные ключи мы удаляем
    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        'film_info': {
          'title': film.name,
          'alternative_title': film.original,
          'poster': film.img,
          'description': film.description,
          'total_rating': film.rating,
          'release': {
            'date': film.release,
            'release_country': film.country,
          },
          'runtime': film.duration,
          'genre': film.genres,
          'director': film.director,
          'writers': film.writers.split(', '),
          'actors': film.actors.split(', '),
          'age_rating': parseInt(film.age, 10),
        },
        'user_details': {
          'watchlist': film.isWatchList,
          'watching_date': film.watchingDate,
          'already_watched': film.isWatched,
          'favorite': film.isFavorite,
        },
      },
    );

    // Ненужные ключи мы удаляем
    delete adaptedFilm.name;
    delete adaptedFilm.original;
    delete adaptedFilm.img;
    delete adaptedFilm.description;
    delete adaptedFilm.rating;
    delete adaptedFilm.release;
    delete adaptedFilm.duration;
    delete adaptedFilm.genres;
    delete adaptedFilm.director;
    delete adaptedFilm.writers;
    delete adaptedFilm.actors;
    delete adaptedFilm.country;
    delete adaptedFilm.age;
    delete adaptedFilm.isWatchList;
    delete adaptedFilm.watchingDate;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.isFavorite;

    return adaptedFilm;
  }
}

export default Films;
