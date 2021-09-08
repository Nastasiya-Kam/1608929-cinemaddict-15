import StatisticView from './view/statistic.js';
import MoviesInside from './view/movies-inside.js';
import {generateFilm} from './mock/film.js';
import {generateComments} from './mock/comments.js';
import {getNumberFilms} from './utils/films.js';
import {render} from './utils/dom.js';
import FilmBoardPresenter from './presenter/film-board.js';
import SiteMenuPresenter from './presenter/site-menu.js';
import FilterModel from './model/filters.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import {getRandomInteger} from './utils/common.js';
import ProfilePresenter from './presenter/profile.js';
import {UpdateType} from './const.js';

const MIN_COMMENTS_COUNT = 0;
const MAX_COMMENTS_COUNT = 7;

const FILM_DEVELOPER_COUNT = 22;

const films = new Array(FILM_DEVELOPER_COUNT).fill().map(() => generateFilm());
let comments = [];

films.forEach((film) => {
  const currenComments = generateComments(getRandomInteger(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT), film.id);

  currenComments.forEach((comment) => {
    if (comment.filmId === film.id) {
      film.comments.push(comment.id);
    }
  });

  comments = comments.concat(currenComments);
});

const numberFilms = getNumberFilms(films);

const filmsModel = new FilmsModel();
filmsModel.films = films;
const filterModel = new FilterModel();
const commentsModel = new CommentsModel();

const site = document.body;
const siteHeader = site.querySelector('.header');
const siteMain = site.querySelector('.main');
const footerStatistics = site.querySelector('.footer__statistics');

const profilePresenter = new ProfilePresenter(siteHeader, filmsModel);
const filmBoardPresenter = new FilmBoardPresenter(siteMain, siteHeader, filmsModel, commentsModel, comments, filterModel);

render(footerStatistics, new MoviesInside(numberFilms));

const onSiteMenuClick = (updateType) => {
  switch (updateType) {
    case UpdateType.FILTER_CHANGED:
      //удаляем статистику
      // remove(statistic);
      // рисуем фильмы FilmsBoardPresenter
      filmBoardPresenter.init();
      // siteMenuPresenter.init();
      break;
    case UpdateType.STATISTICS_OPENED:
      // удаляем фильмы FilmsBoardPresenter.clear()...
      filmBoardPresenter.destroy();
      // отрисовываем статистику
      // активный пункт меню
      break;
  }
};

const siteMenuPresenter = new SiteMenuPresenter(onSiteMenuClick, siteMain, filterModel, filmsModel);

profilePresenter.init();
siteMenuPresenter.init();
// filmBoardPresenter.init();
render(siteMain, new StatisticView(filmsModel.films, 'all-time'));
