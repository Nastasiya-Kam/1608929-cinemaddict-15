import SmartView from './smart.js';
import {getRating} from '../utils/users.js';
import {MINUTES_IN_HOUR} from '../utils/films.js';
import {statistics, makeItemsUnique, StatisticType, getCountWatchedFilms, getFilmGenres, getGenresData} from '../utils/statistics.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 50;

const renderGenresChart = (statisticCtx, films) => {
  const filmGenres = getFilmGenres(films);
  const uniqueGenres = makeItemsUnique(filmGenres);
  const genresData = getGenresData(uniqueGenres, filmGenres);

  statisticCtx.height = BAR_HEIGHT * uniqueGenres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genresData.labels,
      datasets: [{
        data: genresData.data,
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

const createRatingTemplate = (rating) => (
  `${(rating === 0)
    ? ''
    : `<p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${getRating(rating)}</span>`}
    </p>`
);

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

const createStatisticTemplate = (data) => {
  const {films, period} = data;

  const statisticFiltersTemplate = statistics
    .map((type) => createStatisticFilters(type, period))
    .join('');

  const watchedFilms = getCountWatchedFilms(films, period);

  let rating = 0;
  let filmsCount = 0;
  let duration = 0;
  let genresData = null;
  let isEmptyLabels = true;

  if (watchedFilms.length !== 0) {
    rating = films.filter((film) => film.isWatched).length;
    filmsCount = watchedFilms.length;
    duration = watchedFilms.reduce((accumulator, stat) => accumulator + stat.duration, 0);
    const genres = getFilmGenres(watchedFilms);
    const uniqueGenres = makeItemsUnique(genres);

    genresData = getGenresData(uniqueGenres, genres);
    isEmptyLabels = false;
  }

  return (
    `<section class="statistic">
      ${createRatingTemplate(rating)}

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
          <p class="statistic__item-text">${Math.trunc(duration/MINUTES_IN_HOUR)} <span class="statistic__item-description">h</span> ${duration - Math.trunc(duration/MINUTES_IN_HOUR)*MINUTES_IN_HOUR} <span class="statistic__item-description">m</span></p>
        </li>
        ${(isEmptyLabels) ? '' : `<li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${genresData.labels[0]}</p>`}
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};

class Statistic extends SmartView {
  constructor(films) {
    super();

    this._data = {
      films,
      period: StatisticType.ALL,
    };

    this._onStatisticTypeChange = this._onStatisticTypeChange.bind(this);

    this._genresChart = null;
    this._activePeriod = StatisticType.ALL;

    this._setOnStatisticTypeChange();
    this._setChart();
  }

  getTemplate() {
    return createStatisticTemplate(this._data);
  }

  removeElement() {
    super.removeElement();

    if (this._genresChart !== null) {
      this._genresChart = null;
    }
  }

  restoreHandlers() {
    this._setOnStatisticTypeChange(this._callback.filterTypeChange);
  }

  _setChart() {
    if (this._genresChart !== null) {
      this._genresChart = null;
    }

    const {films, period} = this._data;
    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    const watchedFilms = getCountWatchedFilms(films, period);

    this._genresChart = renderGenresChart(statisticCtx, watchedFilms);
  }

  _setOnStatisticTypeChange() {
    this.getElement().querySelector('.statistic__filters').addEventListener('change', this._onStatisticTypeChange);
  }

  _onStatisticTypeChange(evt) {
    evt.preventDefault();
    const currentPeriod = evt.target.value;

    this.updateData({
      period: currentPeriod,
    });

    this._setChart();
  }
}

export default Statistic;
