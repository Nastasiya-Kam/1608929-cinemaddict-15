import FilmsListView from '../view/films-list.js';
import NoFilmsView from '../view/no-films.js';
import CardFilmView from '../view/card-film.js';
import ShowMoreView from '../view/show-more.js';
import FilmsView from '../view/films.js';
import {renderElement, isEscEvent} from '../utils/dom.js';
import {Title} from '../utils/films.js'; //getNumberFilms
import FilmDetailsView from '../view/film-details.js';

const FILM_COUNT_PER_STEP = 5;

class FilmsBoard {
  constructor(filmContainer) {
    this._filmContainer = filmContainer;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    // Т.к. основной список фильмов используется для отрисовки ShowMore кнопки, то сделаем её видимой для всего класса
    this._mainFilmsListComponent = null;

    this._filmsComponent = new FilmsView();
    this._noFilmsComponent = new NoFilmsView();
    this._showMoreComponent = new ShowMoreView();

    // нужно связать обработчики кликов по:
    // названию фильма
    // постеру
    // комментариям
    // Обработчик клика по "нравится, смотрел, буду смотреть"
    this._handleShowMoreClick = this._handleShowMoreClick.bind(this);
  }

  init(films) {
    this._films = films.slice();

    // Отрисовываем контейнер, в котором будут списки фильмов
    renderElement(this._filmContainer, this._filmsComponent.getElement());
    // Переходим к отрисовке содержимого
    this._renderFilmsBoard();
  }

  _renderFilmDetails(film) {
    const filmDetailsComponent = new FilmDetailsView(film);

    this._filmContainer.appendChild(filmDetailsComponent.getElement());
    this._filmContainer.classList.add('hide-overflow');

    filmDetailsComponent.setOnFilmDetailsClick((evt) => {
      if (evt.target.tagName === 'BUTTON') {
        evt.target.classList.toggle('film-details__control-button--active');
      }
    });

    const onFilmDetailsEscKeydown = (evt) => {
      if (isEscEvent(evt)) {
        evt.preventDefault();
        document.removeEventListener('keydown', onFilmDetailsEscKeydown);
        this._filmContainer.classList.remove('hide-overflow');
        this._filmContainer.removeChild(filmDetailsComponent.getElement());
      }
    };

    document.addEventListener('keydown', onFilmDetailsEscKeydown);

    filmDetailsComponent.setOnCloseButtonClick(() => {
      document.removeEventListener('keydown', onFilmDetailsEscKeydown);
      this._filmContainer.classList.remove('hide-overflow');
      this._filmContainer.removeChild(filmDetailsComponent.getElement());
    });

    // !Одновременно может быть открыт только один попап.
    // todo При открытии нового попапа прежний закрывается, например при клике на другую карточку при открытом попапе.
    // !Несохранённые изменения (неотправленный комментарий) пропадают.
  }

  _checkClass(item) {
    return item === 'film-card__controls-item';
  }

  _renderFilm(filmsListElement, film) {
    // Отрисовываем карточку фильма (мини)
    // Т.к. нам нужно много разных карточек, то мы не выносим new CardFilmView в конструктор, а создаём "на месте"
    const filmComponent = new CardFilmView(film);
    // Обработчики кликов по названию, картинке и комментариям
    filmComponent.setOnPosterClick(() => this._renderFilmDetails(film));
    filmComponent.setOnTitleClick(() => this._renderFilmDetails(film));
    filmComponent.setOnCommentsClick(() => this._renderFilmDetails(film));

    // Обработчик клика по "нравится, смотрел, буду смотреть"
    filmComponent.setOnControlsClick((evt) => {
      const buttonClasses = Array.from(evt.target.classList);

      if (buttonClasses.some(this._checkClass)) {
        evt.target.classList.toggle('film-card__controls-item--active');
      }
    });
    // Когда вся картчка отрисована, вставляем её в разметку
    // ?На подумать. Зачем вставлять каждую карточку в разметку, когда можно отрисовать сразу 5 (или меньше, если их меньше) и вставить "блок"?
    // ?Можно использовать document.createDocumentFragment()
    // ??или вообще возвращать template, который потом отрисовывать на лист
    renderElement(filmsListElement, filmComponent.getElement());
  }

  _renderNoFilms() {
    // Отрисовываем заглушку для списка без фильмов
    renderElement(this._filmsComponent.getElement(), this._noFilmsComponent.getElement());
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

//   const topRatedComponent = new FilmsListView(Title.TOP.title, Title.TOP.isExtraList);
//   renderElement(filmsComponent.getElement(), topRatedComponent.getElement());

//   for (let i = 0; i < EXTRA_FILM_COUNT; i ++) {
//     renderFilm(topRatedComponent.getContainer(), films[i]);
//   }

//   const mostCommentedComponent = new FilmsListView(Title.MOST_COMMENTED.title, Title.MOST_COMMENTED.isExtraList);
//   renderElement(filmsComponent.getElement(), mostCommentedComponent.getElement());

//   for (let i = 0; i < EXTRA_FILM_COUNT; i ++) {
//     renderFilm(mostCommentedComponent.getContainer(), films[i]);
//   }
// };
