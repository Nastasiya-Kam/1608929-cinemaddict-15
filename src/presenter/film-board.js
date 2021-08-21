import FilmsListView from '../view/films-list.js';
import NoFilmsView from '../view/no-films.js';
import ShowMoreView from '../view/show-more.js';
import FilmsView from '../view/films.js';
import {updateItem} from '../utils/common.js';
import {renderElement, remove} from '../utils/dom.js';
import {Title} from '../utils/films.js'; //getNumberFilms
import FilmPresenter from './film.js';

const FILM_COUNT_PER_STEP = 5;
const EXTRA_FILM_COUNT = 2;

class FilmsBoard {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._filmPresenter = new Map();
    // Т.к. основной список фильмов используется для отрисовки ShowMore кнопки, то сделаем её видимой для всего класса
    this._mainFilmsListComponent = null;

    this._filmsComponent = new FilmsView();
    this._noFilmsComponent = new NoFilmsView();
    this._showMoreComponent = new ShowMoreView();

    this._handleShowMoreClick = this._handleShowMoreClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    // this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(films) {
    this._films = films.slice();

    // Отрисовываем контейнер, в котором будут списки фильмов
    renderElement(this._filmsContainer, this._filmsComponent.getElement());
    // Переходим к отрисовке содержимого
    this._renderFilmsBoard();
  }

  _handleModeChange() {
    this._filmPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._filmPresenter.get(updatedFilm.id).init(updatedFilm);
  }

  _renderNoFilms() {
    // Отрисовываем заглушку для списка без фильмов
    renderElement(this._filmsComponent.getElement(), this._noFilmsComponent.getElement());
  }

  _renderFilm(container, film) {
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange, this._handleModeChange); //, this._handleModeChange
    filmPresenter.init(film);
    this._filmPresenter.set(film.id, filmPresenter); //?У меня три списка. Нужно ли создать ещё две переменные?
  }

  _clearFilmList() {
    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmPresenter.clear();
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this._showMoreComponent);
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
      remove(this._showMoreComponent);
    }
  }

  _renderShowMore() {
    // Отрисовываем кнопку показа остальных фильмов
    renderElement(this._mainFilmsListComponent.getElement(), this._showMoreComponent.getElement());
    // Вешаем обработчик для кнопки
    this._showMoreComponent.setOnShowMoreClick(this._handleShowMoreClick);
  }

  _renderTopRated() {
    this._topRatedComponent = new FilmsListView(Title.TOP.title, Title.TOP.isExtraList);
    renderElement(this._filmsComponent.getElement(), this._topRatedComponent.getElement());

    for (let i = 0; i < EXTRA_FILM_COUNT; i ++) {
      this._renderFilm(this._topRatedComponent.getContainer(), this._films[i]);
    }
  }

  // !ПРОБЛЕМА. Все клики обрабатываются "на поселднем" списке. Т.е. при клике на первый и второй кнопки в основном и Top списках, изменения происходят только в MostCommented
  _renderMostCommented() {
    this._mostCommentedComponent = new FilmsListView(Title.MOST_COMMENTED.title, Title.MOST_COMMENTED.isExtraList);
    renderElement(this._filmsComponent.getElement(), this._mostCommentedComponent.getElement());

    for (let i = 0; i < EXTRA_FILM_COUNT; i ++) {
      this._renderFilm(this._mostCommentedComponent.getContainer(), this._films[i]);
    }
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
