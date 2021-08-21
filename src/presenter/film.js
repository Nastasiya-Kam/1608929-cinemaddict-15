import FilmDetailsView from '../view/film-details.js';
import CardFilmView from '../view/card-film.js';
import {renderElement, isEscEvent, remove, replace} from '../utils/dom.js';

const site = document.body; //? Корректно делать так?

class Film {
  constructor(filmContainer, changeData) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;

    this._filmComponent = null;
    this._filmDetailsComponent = null;

    this._onEscKeydown = this._onEscKeydown.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    const prevFilmDetailsComponent = this._filmDetailsComponent;
    // Т.к. нам нужно много разных карточек, то мы не выносим new CardFilmView в конструктор, а создаём "на месте"
    this._filmComponent = new CardFilmView(this._film);
    this._filmDetailsComponent = new FilmDetailsView(film);

    // Обработчики кликов по названию, картинке и комментариям
    this._filmComponent.setOnPosterClick(() => this._renderFilmDetails(this._film));
    this._filmComponent.setOnTitleClick(() => this._renderFilmDetails(this._film));
    this._filmComponent.setOnCommentsClick(() => this._renderFilmDetails(this._film));
    // Обработчик клика по "нравится, смотрел, буду смотреть"
    this._filmComponent.setOnFavoriteClick(this._handleFavoriteClick);
    this._filmComponent.setOnWatchListClick(this._handleWatchListClick);
    this._filmComponent.setOnWatchedClick(this._handleWatchedClick);

    this._filmDetailsComponent.setOnFavoriteClick(this._handleFavoriteClick);
    this._filmDetailsComponent.setOnWatchListClick(this._handleWatchListClick);
    this._filmDetailsComponent.setOnWatchedClick(this._handleWatchedClick);
    this._filmDetailsComponent.setOnCloseButtonClick(this._handleCloseButtonClick);

    // Когда вся картчка отрисована, вставляем её в разметку
    if (prevFilmComponent === null || prevFilmDetailsComponent === null) {
      renderElement(this._filmContainer, this._filmComponent.getElement());
      return;
    }

    if (this._filmContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (site.contains(prevFilmDetailsComponent.getElement())) {
      replace(this._filmDetailsComponent, prevFilmDetailsComponent);
    }

    remove(prevFilmComponent);
    remove(prevFilmDetailsComponent);
  }

  _renderFilmDetails() {
    site.appendChild(this._filmDetailsComponent.getElement());
    site.classList.add('hide-overflow');
    document.addEventListener('keydown', this._onEscKeydown);

    // todo При открытии нового попапа прежний закрывается, например при клике на другую карточку при открытом попапе.
    // !Одновременно может быть открыт только один попап.
    // !Несохранённые изменения (неотправленный комментарий) пропадают.
  }

  destroy() {
    remove(this._filmDetailsComponent);
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

  _handleCloseButtonClick() {
    document.removeEventListener('keydown', this._onEscKeydown);
    site.classList.remove('hide-overflow');
    remove(this._filmDetailsComponent);
  }

  _onEscKeydown(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._handleCloseButtonClick();
    }
  }

  _checkClass(item) {
    return item === 'film-card__controls-item';
  }
}

export default Film;
