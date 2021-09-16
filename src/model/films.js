import AbstractObserver from '../utils/abstract-observer.js';

class Films extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
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
    const filmInfo = film['film_info'];
    const userDetails = film['user_details'];

    const adaptedFilm = Object.assign(
      {},
      film,
      {
        name: filmInfo['title'],
        original: filmInfo['alternative_title'],
        img: filmInfo['poster'],
        description: film['film_info']['description'],
        rating: filmInfo['total_rating'],
        release: filmInfo['release']['date'],
        duration: filmInfo['runtime'],
        genres: filmInfo['genre'],
        director:	filmInfo['director'],
        writers:	filmInfo['writers'],
        actors:	filmInfo['actors'],
        country:	filmInfo['release']['release_country'],
        age: filmInfo['age_rating'],
        isWatchList: userDetails['watchlist'],
        watchingDate: userDetails['watching_date'],
        isWatched: userDetails['already_watched'],
        isFavorite: userDetails['favorite'],
      },
    );

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];

    return adaptedFilm;
  }

  static adaptToServer(film) {
    return {
      'id': film.id,
      'comments': film.comments,
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
        'writers': film.writers,
        'actors': film.actors,
        'age_rating': film.age,
      },
      'user_details': {
        'watchlist': film.isWatchList,
        'watching_date': film.watchingDate,
        'already_watched': film.isWatched,
        'favorite': film.isFavorite,
      },
    };
  }
}

export default Films;
