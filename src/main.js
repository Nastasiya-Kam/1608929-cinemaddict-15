import ProfileView from './view/profile.js';
import SiteMenuView from './view/site-menu.js';
import StatisticsView from './view/statistics.js';
import {generateFilm} from './mock/film.js';
import {generateFilter} from './utils/filter.js';
import {getRating} from './utils/users.js';
import {getNumberFilms} from './utils/films.js';
import {renderElement} from './utils/dom.js';
import FilmBoardPresenter from './presenter/film-board.js';

const FILM_DEVELOPER_COUNT = 22;

const films = new Array(FILM_DEVELOPER_COUNT).fill().map(() => generateFilm());
const filter = generateFilter(films);
const numberFilms = getNumberFilms(films);
const rating = getRating(films);

//? А работа с DOM остаётся здесь? "большие объекты"
const site = document.body;
const siteHeader = site.querySelector('.header');
const siteMain = site.querySelector('.main');
const footerStatistics = site.querySelector('.footer__statistics');

renderElement(siteHeader, new ProfileView(rating).getElement());
renderElement(siteMain, new SiteMenuView(filter).getElement());

renderElement(footerStatistics, new StatisticsView(numberFilms).getElement());

const filmBoardPresenter = new FilmBoardPresenter(siteMain);

filmBoardPresenter.init(films);
