import SiteMenuView from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
import ProfileView from './view/profile.js';
import {generateFilm} from './mock/film.js';
import {getNumberFilms} from './utils/films.js';
import {render} from './utils/dom.js';
import FilmBoardPresenter from './presenter/film-board.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import {generateFilter} from './utils/filter.js';

const FILM_DEVELOPER_COUNT = 22;

const films = new Array(FILM_DEVELOPER_COUNT).fill().map(() => generateFilm());
const numberFilms = getNumberFilms(films);

const filmModel = new FilmsModel();
filmModel.films = films;

const filter = generateFilter(filmModel.films);
const rating = filter.watched;

const commentsModel = new CommentsModel();

const site = document.body;
const siteHeader = site.querySelector('.header');
const siteMain = site.querySelector('.main');
const footerStatistics = site.querySelector('.footer__statistics');

const siteMenuComponent = new SiteMenuView(filter);
render(siteMain, siteMenuComponent);

const profileComponent = new ProfileView(rating);
render(siteHeader, profileComponent);

const filmBoardPresenter = new FilmBoardPresenter(siteMain, siteHeader, filmModel, commentsModel);

render(footerStatistics, new StatisticsView(numberFilms));

filmBoardPresenter.init();
