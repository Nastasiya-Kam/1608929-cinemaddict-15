import CardFilmView from '../view/card-film.js';
import {render, remove, replace} from '../utils/dom.js';
import {Settings, getUpdatedFilm} from '../utils/films.js';

class Film {
  constructor(filmContainer, changeData, openPresenter) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._openPresenter = openPresenter;

    this._filmComponent = null;

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
    this._filmComponent.setOnPosterClick(() => this._openPresenter(this._film));
    this._filmComponent.setOnTitleClick(() => this._openPresenter(this._film));
    this._filmComponent.setOnCommentsClick(() => this._openPresenter(this._film));
    // Обработчик клика по "нравится, смотрел, буду смотреть"
    this._filmComponent.setOnWatchListClick(this._handleWatchListClick);
    this._filmComponent.setOnWatchedClick(this._handleWatchedClick);
    this._filmComponent.setOnFavoriteClick(this._handleFavoriteClick);

    // Когда вся карточка отрисована, вставляем её в разметку
    if (prevFilmComponent === null) {
      render(this._filmContainer, this._filmComponent);
      return;
    }

    replace(this._filmComponent, prevFilmComponent);

    remove(prevFilmComponent);
  }

  destroy() {
    remove(this._filmComponent);
  }

  _handleWatchListClick() {
    this._changeData(getUpdatedFilm(this._film, Settings.WATCH_LIST));
  }

  _handleWatchedClick() {
    this._changeData(getUpdatedFilm(this._film, Settings.WATCHED));
  }

  _handleFavoriteClick() {
    this._changeData(getUpdatedFilm(this._film, Settings.FAVORITE));
  }
}

export default Film;
