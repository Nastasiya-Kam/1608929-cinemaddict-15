import SiteMenuView from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
// import ProfileView from './view/profile.js';
import {generateFilm} from './mock/film.js';
import {generateComments} from './mock/comments.js';
import {getNumberFilms} from './utils/films.js';
import {render} from './utils/dom.js';
import FilmBoardPresenter from './presenter/film-board.js';
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

const filterModel = new FilterModel(); // eslint-disable-line no-unused-vars

const filters = [
  {
    typeFilter: 'all',
    href: '#all',
    title: 'ALL',
    hasCount: false,
  },
];

// !!!Сломан подсчёт количества просмотренных фильмов для звания пользователя
// const rating = filter.watched;

const commentsModel = new CommentsModel();

const site = document.body;
const siteHeader = site.querySelector('.header');
const siteMain = site.querySelector('.main');
const footerStatistics = site.querySelector('.footer__statistics');

const siteMenuComponent = new SiteMenuView(filters, 'all');
render(siteMain, siteMenuComponent);

// const profileComponent = new ProfileView(rating);
// render(siteHeader, profileComponent);

const filmBoardPresenter = new FilmBoardPresenter(siteMain, siteHeader, filmModel, commentsModel, comments);

render(footerStatistics, new StatisticsView(numberFilms));

filmBoardPresenter.init();
