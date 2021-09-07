import AbstractObserver from '../utils/abstract-observer.js';

class Films extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
  }

  set films(films) {
    this._films = films.slice();
  }

  get films() {
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

    // const indexComment = currentFilm.comments.findIndex((comment) => comment === update.id);

    // if (indexComment === -1) {
    //   throw new Error('Can\'t delete unexisting comment');
    // }

    // currentFilm.comments = [
    //   ...currentFilm.comments.slice(0, indexComment),
    //   ...currentFilm.comments.slice(indexComment + 1),
    // ];

    this._notify(updateType, update);
  }
}

export default Films;
