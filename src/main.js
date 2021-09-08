import StatisticsView from './view/statistics.js';
// import ProfileView from './view/profile.js';
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
const siteMenuPresenter = new SiteMenuPresenter(siteMain, filterModel, filmsModel);
const filmBoardPresenter = new FilmBoardPresenter(siteMain, siteHeader, filmsModel, commentsModel, comments, filterModel);

render(footerStatistics, new StatisticsView(numberFilms));

profilePresenter.init();
siteMenuPresenter.init();
filmBoardPresenter.init();
