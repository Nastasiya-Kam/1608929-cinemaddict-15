import StatisticView from './view/statistic.js';
import MoviesInside from './view/movies-inside.js';
import {generateFilm} from './mock/film.js';
import {generateComments} from './mock/comments.js';
import {getNumberFilms} from './utils/films.js';
import {render, remove} from './utils/dom.js';
import {StatisticType} from './utils/statistics.js';
import {getRandomInteger} from './utils/common.js';
import ProfilePresenter from './presenter/profile.js';
import SiteMenuPresenter from './presenter/site-menu.js';
import FilmBoardPresenter from './presenter/film-board.js';
import FilterModel from './model/filters.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import {UpdateType} from './const.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic dfaksdjlkjd4309SLDKflk';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

const MIN_COMMENTS_COUNT = 0;
const MAX_COMMENTS_COUNT = 7;

const FILM_DEVELOPER_COUNT = 22;

const films = new Array(FILM_DEVELOPER_COUNT).fill().map(() => generateFilm());
const api = new Api(END_POINT, AUTHORIZATION);

api.getFilms().then((elements) => {
  console.log(elements);
});

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

let statisticComponent = null;

const onSiteMenuClick = (updateType) => {
  switch (updateType) {
    case UpdateType.FILTER_CHANGED:
      remove(statisticComponent);
      filmBoardPresenter.init();
      break;
    case UpdateType.STATISTICS_OPENED:
      filmBoardPresenter.destroy();
      statisticComponent = new StatisticView(filmsModel.films, StatisticType.ALL);
      render(siteMain, statisticComponent);
      break;
  }
};

const siteMenuPresenter = new SiteMenuPresenter(onSiteMenuClick, siteMain, filterModel, filmsModel);

profilePresenter.init();
siteMenuPresenter.init();
filmBoardPresenter.init();
