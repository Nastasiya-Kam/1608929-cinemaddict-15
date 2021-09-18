import StatisticView from './view/statistic.js';
import MoviesInsideView from './view/movies-inside.js';
import {render, remove} from './utils/dom.js';
import {StatisticType} from './utils/statistics.js';
import ProfilePresenter from './presenter/profile.js';
import SiteMenuPresenter from './presenter/site-menu.js';
import FilmsBoardPresenter from './presenter/films-board.js';
import FilterModel from './model/filter.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import {UpdateType, AUTHORIZATION, END_POINT} from './const.js';
import Api from './api.js';

const site = document.body;
const siteHeader = site.querySelector('.header');
const siteMain = site.querySelector('.main');
const footerStatistics = site.querySelector('.footer__statistics');

const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();
const commentsModel = new CommentsModel();

const profilePresenter = new ProfilePresenter(siteHeader, filmsModel);
const filmBoardPresenter = new FilmsBoardPresenter(siteMain, siteHeader, filmsModel, commentsModel, filterModel, api);

let statisticComponent = null;

const onSiteMenuClick = (updateType) => {
  switch (updateType) {
    case UpdateType.FILTER_CHANGED:
      remove(statisticComponent);
      filmBoardPresenter.init();
      break;
    case UpdateType.STATISTICS_OPENED:
      filmBoardPresenter.destroy();
      statisticComponent = new StatisticView(filmsModel.getFilms(), StatisticType.ALL);
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
    const numberFilms = filmsModel.getFilms().length;
    render(footerStatistics, new MoviesInsideView(numberFilms));
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
    const numberFilms = filmsModel.getFilms().length;
    render(footerStatistics, new MoviesInsideView(numberFilms));
  });
