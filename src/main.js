import StatisticsView from './view/statistics.js';
import {generateFilm} from './mock/film.js';
import {getNumberFilms} from './utils/films.js';
import {render} from './utils/dom.js';
import FilmBoardPresenter from './presenter/film-board.js';
import FilmsModel from './model/films.js';

const FILM_DEVELOPER_COUNT = 22;

const films = new Array(FILM_DEVELOPER_COUNT).fill().map(() => generateFilm());
const numberFilms = getNumberFilms(films);

const filmModel = new FilmsModel();
filmModel.films = films;

const site = document.body;
const siteHeader = site.querySelector('.header');
const siteMain = site.querySelector('.main');
const footerStatistics = site.querySelector('.footer__statistics');

const filmBoardPresenter = new FilmBoardPresenter(siteMain, siteHeader, filmModel);

render(footerStatistics, new StatisticsView(numberFilms));

filmBoardPresenter.init();
