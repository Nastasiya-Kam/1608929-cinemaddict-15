import FilmDetailsView from '../view/film-details.js';
import CardFilmView from '../view/card-film.js';
import {renderElement, isEscEvent, remove, replace} from '../utils/dom.js';

const site = document.body; //? Корректно делать так?

class Film {
  constructor(filmContainer) {
    this._filmContainer = filmContainer;
    this._filmComponent = null;
    this._filmDetailsComponent = null;

    this._handleFilmDetails = this._handleFilmDetails.bind(this);
    this._onEscKeydown = this._onEscKeydown.bind(this);
    this._handlePosterClick = this._handlePosterClick.bind(this);
  }

  init(film) {
    // Отрисовываем карточку фильма (мини)
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    // Т.к. нам нужно много разных карточек, то мы не выносим new CardFilmView в конструктор, а создаём "на месте"
    this._filmComponent = new CardFilmView(this._film);

    // Обработчики кликов по названию, картинке и комментариям
    this._filmComponent.setOnPosterClick(() => this._renderFilmDetails(this._film));
    this._filmComponent.setOnTitleClick(() => this._renderFilmDetails(this._film));
    this._filmComponent.setOnCommentsClick(() => this._renderFilmDetails(this._film));
    // Обработчик клика по "нравится, смотрел, буду смотреть"
    this._filmComponent.setOnControlsClick(this._handlePosterClick);
    // Когда вся картчка отрисована, вставляем её в разметку
    // ?На подумать. Зачем вставлять каждую карточку в разметку, когда можно отрисовать сразу 5 (или меньше, если их меньше) и вставить "блок"?
    // ?Можно использовать document.createDocumentFragment()
    // ??или вообще возвращать template, который потом отрисовывать на лист
    if (prevFilmComponent === null) {
      renderElement(this._filmContainer, this._filmComponent.getElement());
      return;
    }

    if (this._filmContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  }

  destroy() {
    remove(this._filmDetailsComponent);
  }

  _handleFilmDetailsClick(evt) {
    if (evt.target.tagName === 'BUTTON') {
      evt.target.classList.toggle('film-details__control-button--active');
    }
  }

  _handleFilmDetails() {
    document.removeEventListener('keydown', this._onEscKeydown);
    site.classList.remove('hide-overflow');
    remove(this._filmDetailsComponent);
  }

  _onEscKeydown(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._handleFilmDetails();
    }
  }

  _renderFilmDetails(film) {
    this._filmDetailsComponent = new FilmDetailsView(film);

    site.appendChild(this._filmDetailsComponent.getElement());
    site.classList.add('hide-overflow');
    document.addEventListener('keydown', this._onEscKeydown);

    this._filmDetailsComponent.setOnFilmDetailsClick(this._handleFilmDetailsClick);
    this._filmDetailsComponent.setOnCloseButtonClick(this._handleFilmDetails);

    // todo При открытии нового попапа прежний закрывается, например при клике на другую карточку при открытом попапе.
    // !Одновременно может быть открыт только один попап.
    // !Несохранённые изменения (неотправленный комментарий) пропадают.
  }

  _checkClass(item) {
    return item === 'film-card__controls-item';
  }

  _handlePosterClick(evt) {
    const buttonClasses = Array.from(evt.target.classList);

    if (buttonClasses.some(this._checkClass)) {
      evt.target.classList.toggle('film-card__controls-item--active');
    }
  }
}

export default Film;
