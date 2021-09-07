import StatisticsView from './view/statistics.js';
// import ProfileView from './view/profile.js';
import {generateFilm} from './mock/film.js';
import {generateComments} from './mock/comments.js';
import {getNumberFilms} from './utils/films.js';
import {render} from './utils/dom.js';
import FilmBoardPresenter from './presenter/film-board.js';
import FilterPresenter from './presenter/filter.js';
import FilterModel from './model/filters.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import {getRandomInteger} from './utils/common.js';

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

const filmModel = new FilmsModel();
filmModel.films = films;

const filterModel = new FilterModel();

// !!!Сломан подсчёт количества просмотренных фильмов для звания пользователя
// const rating = filter.watched;

const commentsModel = new CommentsModel();

const site = document.body;
const siteHeader = site.querySelector('.header');
const siteMain = site.querySelector('.main');
const footerStatistics = site.querySelector('.footer__statistics');

// const profileComponent = new ProfileView(rating);
// render(siteHeader, profileComponent);
const filterPresenter = new FilterPresenter(siteMain, filterModel, filmModel);
const filmBoardPresenter = new FilmBoardPresenter(siteMain, siteHeader, filmModel, commentsModel, comments, filterModel);

render(footerStatistics, new StatisticsView(numberFilms));

filterPresenter.init();
filmBoardPresenter.init();
