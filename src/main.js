import StatisticView from './view/statistic.js';
import MoviesInside from './view/movies-inside.js';
import {render, remove} from './utils/dom.js';
import {StatisticType} from './utils/statistics.js';
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

const site = document.body;
const siteHeader = site.querySelector('.header');
const siteMain = site.querySelector('.main');
const footerStatistics = site.querySelector('.footer__statistics');

const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();
const commentsModel = new CommentsModel();

const profilePresenter = new ProfilePresenter(siteHeader, filmsModel);
const filmBoardPresenter = new FilmBoardPresenter(siteMain, siteHeader, filmsModel, commentsModel, filterModel, api);

const numberFilms = filmsModel.getFilms().length;
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

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });
