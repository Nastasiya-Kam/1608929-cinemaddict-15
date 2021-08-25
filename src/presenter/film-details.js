import FilmDetailsView from '../view/film-details.js';
import {renderElement, isEscEvent, remove} from '../utils/dom.js';

const Mode = {
  CLOSED: 'CLOSED',
  OPENED: 'OPENED',
};

const site = document.body; //? Корректно делать так?

class FilmDetails {
  constructor(changeData, changeFilm) {
    this._changeData = changeData;
    this._changeFilm = changeFilm;
    this._mode = null;

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

    if (this._mode === Mode.OPENED) {
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

    renderElement(site, this._filmDetailsComponent.getElement());

    this._mode = Mode.OPENED;
  }

  _close() {
    document.removeEventListener('keydown', this._onEscKeydown);
    site.classList.remove('hide-overflow');
    remove(this._filmDetailsComponent);
    this._mode = Mode.CLOSED;
  }

  isOpened() {
    return this._mode === Mode.OPENED;
  }

  // todo Вынести в одну функцию?
  _getUpdateFilm() {
    return (Object.assign(
      {},
      this._film,
      {
        isWatched: !this._film.isWatched,
      },
    ));
  }

  _handleWatchListClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isWatchList: !this._film.isWatchList,
        },
      ),
    );
  }

  _handleWatchedClick() {
    this._changeData(this._getUpdateFilm());
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isFavorite: !this._film.isFavorite,
        },
      ),
    );
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
