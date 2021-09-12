import AbstractView from './abstract.js';
import {getRating} from '../utils/users.js';
import {Statistics, makeItemsUniq, countFilmsByGenre, StatisticType, sortGenre, getCountWatchedFilms, getFilmGenres} from '../utils/statistics.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 50;

const renderGenresChart = (statisticCtx, films) => {
  const filmGenres = getFilmGenres(films);
  const uniqGenres = makeItemsUniq(filmGenres);
  const filmsByGenresCounts = uniqGenres.map((genre) => countFilmsByGenre(filmGenres, genre));

  statisticCtx.height = BAR_HEIGHT * uniqGenres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqGenres,
      datasets: [{
        data: filmsByGenresCounts,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticFilters = (typeStatistic, currentRange) => {
  const {type, text} = typeStatistic;

  return (
    `<input
    type="radio"
    class="statistic__filters-input visually-hidden"
    name="statistic-filter"
    id="statistic-${type}"
    value="${type}"
    ${(type === currentRange)
      ? ' checked'
      : ''}>
    <label for="statistic-${type}" class="statistic__filters-label">${text}</label>`
  );
};

const createStatisticTemplate = (statistics, currentRange) => {
  const statisticFiltersTemplate = Statistics
    .map((type) => createStatisticFilters(type, currentRange))
    .join('');

  const watchedFilms = statistics.filter((stat) => stat.isWatched);

  let rating = 0;
  let filmsCount = 0;
  let duration = 0;
  let topGenre = '';

  if (watchedFilms.length !== 0) {
    rating = watchedFilms.length;
    filmsCount = watchedFilms.length;
    duration = watchedFilms.reduce((accumulator, stat) => accumulator + stat.duration, 0);
    const genres = watchedFilms.reduce((accumulator, stat) => accumulator.concat(stat.genres), []);

    const genreType = genres.reduce((accumulator, genre) => {
      accumulator[genre] = (accumulator[genre] || 0) + 1;
      return accumulator;
    }, {});

    topGenre = Object.entries(genreType).sort(sortGenre)[0];
  }

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${getRating(rating)}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${statisticFiltersTemplate}
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${filmsCount} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${Math.trunc(duration/60)} <span class="statistic__item-description">h</span> ${duration - Math.trunc(duration/60)*60} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          ${(topGenre === '')? '' : `<p class="statistic__item-text">${topGenre[0]}</p>`}
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};

class Statistic extends AbstractView {
  constructor(films, currentRange) {
    super();

    this._films = films;
    this._currentRange = currentRange;
    this._onStatisticTypeChange = this._onStatisticTypeChange.bind(this);

    this._genresChart = null;
    this._activePeriod = StatisticType.ALL;

    this._setOnStatisticTypeChange();
    this._setChart(this._activePeriod);
  }

  getTemplate() {
    return createStatisticTemplate(this._films, this._currentRange);
  }

  removeElement() {
    super.removeElement();

    if (this._genresChart !== null) {
      this._genresChart = null;
    }
  }

  restoreHandlers() {
    this._setOnStatisticTypeChange(this._callback.filterTypeChange);
    this._setChart(this._activePeriod);
  }

  _onStatisticTypeChange(evt) {
    evt.preventDefault();
    const period = evt.target.value;
    // перерисовываем статистику, учитывая выбранный период
    this._setChart(period);
  }

  _setOnStatisticTypeChange() {
    this.getElement().querySelector('.statistic__filters').addEventListener('change', this._onStatisticTypeChange);
  }

  _setChart(period) {
    if (this._genresChart !== null) {
      this._genresChart = null;
    }

    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    const watchedFilms = getCountWatchedFilms(this._films, period);

    // if (watchedFilms.length === 0) {
    //   this._genresChart = null;
    //   return;
    // }

    this._genresChart = renderGenresChart(statisticCtx, watchedFilms);
  }
}

export default Statistic;
