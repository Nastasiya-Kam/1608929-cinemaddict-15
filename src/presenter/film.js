import FilmDetailsView from '../view/film-details.js';
import CardFilmView from '../view/card-film.js';
import {renderElement, isEscEvent} from '../utils/dom.js';

const site = document.body; //? Корректно делать так?

class Film {
  constructor(filmContainer) {
    this._filmContainer = filmContainer;
    this._filmDetailsComponent = null;

    this._handleFilmDetails = this._handleFilmDetails.bind(this);
    this._onEscKeydown = this._onEscKeydown.bind(this);
    this._handlePosterClick = this._handlePosterClick.bind(this);
  }

  init(filmsListContainer, film) {
    // Отрисовываем карточку фильма (мини)
    // Т.к. нам нужно много разных карточек, то мы не выносим new CardFilmView в конструктор, а создаём "на месте"
    const filmComponent = new CardFilmView(film);
    // Обработчики кликов по названию, картинке и комментариям
    filmComponent.setOnPosterClick(() => this._renderFilmDetails(film));
    filmComponent.setOnTitleClick(() => this._renderFilmDetails(film));
    filmComponent.setOnCommentsClick(() => this._renderFilmDetails(film));
    // Обработчик клика по "нравится, смотрел, буду смотреть"
    filmComponent.setOnControlsClick(this._handlePosterClick);
    // Когда вся картчка отрисована, вставляем её в разметку
    // ?На подумать. Зачем вставлять каждую карточку в разметку, когда можно отрисовать сразу 5 (или меньше, если их меньше) и вставить "блок"?
    // ?Можно использовать document.createDocumentFragment()
    // ??или вообще возвращать template, который потом отрисовывать на лист
    renderElement(filmsListContainer, filmComponent.getElement());
  }

  _handleFilmDetailsClick(evt) {
    if (evt.target.tagName === 'BUTTON') {
      evt.target.classList.toggle('film-details__control-button--active');
    }
  }

  _handleFilmDetails() {
    document.removeEventListener('keydown', this._onEscKeydown);
    site.classList.remove('hide-overflow');
    site.removeChild(this._filmDetailsComponent.getElement());
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
