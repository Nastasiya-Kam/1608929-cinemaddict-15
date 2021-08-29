import ProfileView from './view/profile.js';
import SiteMenuView from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
import {generateFilm} from './mock/film.js';
import {generateFilter} from './utils/filter.js';
import {getRating} from './utils/users.js';
import {getNumberFilms} from './utils/films.js';
import {render} from './utils/dom.js';
import FilmBoardPresenter from './presenter/film-board.js';

const FILM_DEVELOPER_COUNT = 22;

const films = new Array(FILM_DEVELOPER_COUNT).fill().map(() => generateFilm());
const filter = generateFilter(films);
const numberFilms = getNumberFilms(films);
const rating = getRating(films);

const site = document.body;
const siteHeader = site.querySelector('.header');
const siteMain = site.querySelector('.main');
const footerStatistics = site.querySelector('.footer__statistics');

render(siteHeader, new ProfileView(rating));
render(siteMain, new SiteMenuView(filter));

render(footerStatistics, new StatisticsView(numberFilms));

const filmBoardPresenter = new FilmBoardPresenter(siteMain);

filmBoardPresenter.init(films);
