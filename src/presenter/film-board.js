import FilmsListView from '../view/films-list.js';
import NoFilmsView from '../view/no-films.js';
import ShowMoreView from '../view/show-more.js';
import FilmsView from '../view/films.js';
import SortView from '../view/sort.js';
import {updateItem} from '../utils/common.js';
import {renderElement, remove, RenderPosition} from '../utils/dom.js';
import {Title} from '../utils/films.js'; //getNumberFilms
import FilmPresenter from './film.js';
import {SortType} from '../const.js';
import {sortDate, compareRating, compareCommentsAmount} from '../utils/filter.js';

const FILM_COUNT_PER_STEP = 5;
const EXTRA_FILM_COUNT = 2;

class FilmsBoard {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._filmPresenter = new Map();
    // Т.к. основной список фильмов используется для отрисовки ShowMore кнопки, то сделаем её видимой для всего класса
    this._currentSortType = SortType.DEFAULT;
    this._mainFilmsListComponent = null;

    this._sortComponent = new SortView();
    this._filmsComponent = new FilmsView();
    this._noFilmsComponent = new NoFilmsView();
    this._showMoreComponent = new ShowMoreView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreClick = this._handleShowMoreClick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(films) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();

    this._renderSort();
    // Отрисовываем контейнер, в котором будут списки фильмов
    renderElement(this._filmsContainer, this._filmsComponent.getElement());
    // Переходим к отрисовке содержимого
    this._renderFilmsBoard();
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._films.sort(sortDate);
        break;
      case SortType.RATING:
        this._films.sort(compareRating);
        break;
      default:
        this._films = this._sourcedFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmList();
    this._renderMainFilmsList();
  }

  _renderSort() {
    renderElement(this._filmsContainer, this._sortComponent.getElement());
    this._sortComponent.setOnSortTypeChange(this._handleSortTypeChange);
  }

  _handleModeChange() {
    this._filmPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);
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
    if (this._mainFilmsListComponent === null) {
      this._mainFilmsListComponent = new FilmsListView(Title.MAIN.title, Title.MAIN.isExtraList);
    }

    renderElement(this._filmsComponent.getElement(), this._mainFilmsListComponent.getElement(), RenderPosition.AFTERBEGIN);

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

  _checkZeroRating(film) {
    return film.rating === 0;
  }

  _checkZeroComments(film) {
    return film.comments.length === 0;
  }

  _renderTopRated() {
    if (this._films.every(this._checkZeroRating)) {
      return;
    }

    this._topRatedComponent = new FilmsListView(Title.TOP.title, Title.TOP.isExtraList);
    renderElement(this._filmsComponent.getElement(), this._topRatedComponent.getElement());

    const topRatedFilms = this._films.slice().sort(compareRating).slice(0, EXTRA_FILM_COUNT);
    // !ПРОБЛЕМА не "видит", что в основном списке тот же фильм, которому также необходимо изменить значения кнопок
    for (let i = 0; i < EXTRA_FILM_COUNT; i ++) {
      this._renderFilm(this._topRatedComponent.getContainer(), topRatedFilms[i]);
    }
  }

  // !ПРОБЛЕМА. Все клики обрабатываются "на последнем" списке. Т.е. при клике на первый и второй кнопки в основном и Top списках, изменения происходят только в MostCommented
  _renderMostCommented() {
    if (this._films.every(this._checkZeroComments)) {
      return;
    }

    this._mostCommentedComponent = new FilmsListView(Title.MOST_COMMENTED.title, Title.MOST_COMMENTED.isExtraList);
    renderElement(this._filmsComponent.getElement(), this._mostCommentedComponent.getElement());

    const topRatedFilms = this._films.slice().sort(compareCommentsAmount).slice(0, EXTRA_FILM_COUNT);

    for (let i = 0; i < EXTRA_FILM_COUNT; i ++) {
      this._renderFilm(this._mostCommentedComponent.getContainer(), topRatedFilms[i]);
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
