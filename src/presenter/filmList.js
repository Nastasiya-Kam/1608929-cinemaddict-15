import FilmsListView from '../view/films-list.js';
import NoFilmsView from '../view/no-films.js';
import ShowMoreView from '../view/show-more.js';
import FilmsView from '../view/films.js';
import {renderElement} from '../utils/dom.js';
import {Title} from '../utils/films.js'; //getNumberFilms
import FilmPresenter from './film.js';

const FILM_COUNT_PER_STEP = 5;

class FilmsBoard {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    // Т.к. основной список фильмов используется для отрисовки ShowMore кнопки, то сделаем её видимой для всего класса
    this._mainFilmsListComponent = null;

    this._filmsComponent = new FilmsView();
    this._noFilmsComponent = new NoFilmsView();
    this._showMoreComponent = new ShowMoreView();

    this._handleShowMoreClick = this._handleShowMoreClick.bind(this);
  }

  init(films) {
    this._films = films.slice();

    // Отрисовываем контейнер, в котором будут списки фильмов
    renderElement(this._filmsContainer, this._filmsComponent.getElement());
    // Переходим к отрисовке содержимого
    this._renderFilmsBoard();
  }

  _renderNoFilms() {
    // Отрисовываем заглушку для списка без фильмов
    renderElement(this._filmsComponent.getElement(), this._noFilmsComponent.getElement());
  }

  _renderFilm(container, film) {
    const filmPresenter = new FilmPresenter();
    filmPresenter.init(container, film);
  }

  _renderMainFilmsList() {
    // Отрисовываем основной список фильмов
    this._mainFilmsListComponent = new FilmsListView(Title.MAIN.title, Title.MAIN.isExtraList);

    renderElement(this._filmsComponent.getElement(), this._mainFilmsListComponent.getElement());

    for (let i = 0; i < Math.min(this._films.length, this._renderedFilmCount); i ++) {
      this._renderFilm(this._mainFilmsListComponent.getContainer(), this._films[i]);
    }
    // Если фильмов больше 5, то отрисовываем кнопку
    if (this._films.length > this._renderedFilmCount) {
      this._renderShowMore();
    }
  }

  _renderFilms(container, from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilm(container.getContainer(), film));
  }

  _handleShowMoreClick() {
    // Обработка кликов по кнопке и её удаление, если открыты все фильмы
    // Отрезаем новый кусок фильмов, учитывая уже имеющиеся. this._renderedFilmCount находится в конструкторе, поэтому она помнит сколько фильмов уже отрисовано
    this._renderFilms(this._mainFilmsListComponent, this._renderedFilmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    // увеличиваем наш счётчик
    this._renderedFilmCount += FILM_COUNT_PER_STEP;
    // Проверяем, остались ли в списке ещё фильмы. Если нет, то удаляем кнопку showMore
    if (this._renderedFilmCount >= this._films.length) {
      this._showMoreComponent.getElement().remove(); // todo в демонстрации использован другой метод. Посмотреть
    }
  }

  _renderShowMore() {
    // Отрисовываем кнопку показа остальных фильмов
    renderElement(this._mainFilmsListComponent.getElement(), this._showMoreComponent.getElement());
    // Вешаем обработчик для кнопки
    this._showMoreComponent.setOnShowMoreClick(this._handleShowMoreClick);
  }

  _renderTopRated() {

  }

  _renderMostCommented() {

  }

  _renderFilmsBoard() {
    // Отрисовываем списки фильмов
    // Если фильмов нет, то делаем заглушку и выходим из отрисовки списков
    if (this._films.length === 0) {
      this._renderNoFilms; // todo Значение отображаемого текста зависит от выбранного фильтра
      return;
    }
    // Если фильмы есть, то рисуем основной список
    this._renderMainFilmsList();
    // если TOP есть, то рисуем TOP список
    this._renderTopRated();
    // если MOST COMMENT есть, то рисуем MOST COMMENT список
    this._renderMostCommented();
  }
}

export default FilmsBoard;
