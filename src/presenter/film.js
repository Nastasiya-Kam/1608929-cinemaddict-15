import CardFilmView from '../view/card-film.js';
import {renderElement, remove, replace} from '../utils/dom.js'; //, isEscEvent
// import {Mode} from '../const.js';

class Film {
  constructor(filmContainer, changeData, presenter) { //, changeMode
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._presenter = presenter;

    this._filmComponent = null;
    this._filmDetailsComponent = presenter;

    this._openDetails = this._openDetails.bind(this);
    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    // Т.к. нам нужно много разных карточек, то мы не выносим new CardFilmView в конструктор, а создаём "на месте"
    this._filmComponent = new CardFilmView(this._film);

    // Обработчики кликов по названию, картинке и комментариям
    this._filmComponent.setOnPosterClick(this._openDetails);
    this._filmComponent.setOnTitleClick(this._openDetails);
    this._filmComponent.setOnCommentsClick(this._openDetails);
    // Обработчик клика по "нравится, смотрел, буду смотреть"
    this._filmComponent.setOnWatchListClick(this._handleWatchListClick);
    this._filmComponent.setOnWatchedClick(this._handleWatchedClick);
    this._filmComponent.setOnFavoriteClick(this._handleFavoriteClick);

    // Когда вся карточка отрисована, вставляем её в разметку
    if (prevFilmComponent === null) {
      renderElement(this._filmContainer, this._filmComponent.getElement());
      return;
    }

    replace(this._filmComponent, prevFilmComponent);

    remove(prevFilmComponent);
  }

  _openDetails() {
    this._presenter.init(this._film);
  }

  destroy() {
    remove(this._filmComponent);
  }

  // todo Вынести в одну функцию?
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
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isWatched: !this._film.isWatched,
        },
      ),
    );
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
}

export default Film;
