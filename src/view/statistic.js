import SmartView from './smart.js';
import {getRating} from '../utils/users.js';
import {Statistics} from '../utils/statistics.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const sortGenre = (genreA, genreB) => {
  const genreCountA = genreA[1];
  const genreCountB = genreB[1];

  return genreCountB - genreCountA;
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
  const rating = watchedFilms.length;
  const filmsCount = watchedFilms.length;
  const duration = watchedFilms.reduce((accumulator, stat) => accumulator + stat.duration, 0);
  const genres = watchedFilms.reduce((accumulator, stat) => accumulator.concat(stat.genres), []);

  const genreType = genres.reduce((accumulator, genre) => {
    accumulator[genre] = (accumulator[genre] || 0) + 1;
    return accumulator;
  }, {});

  const topGenre = Object.entries(genreType).sort(sortGenre)[0];

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
          ${(topGenre === null)? '' : `<p class="statistic__item-text">${topGenre[0]}</p>`}
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};

class Statistic extends SmartView {
  constructor(films, currentRange) {
    super();

    this._films = films;
    this._currentRange = currentRange;
    this._onStatisticTypeChange = this._onStatisticTypeChange.bind(this);

    this._setOnStatisticTypeChange();
  }

  getTemplate() {
    return createStatisticTemplate(this._films, this._currentRange);
  }

  restoreHandlers() {
    this._setOnStatisticTypeChange(this._callback.filterTypeChange);
  }

  _onStatisticTypeChange(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  _setOnStatisticTypeChange(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().querySelector('.statistic__filters').addEventListener('change', this._onStatisticTypeChange);
  }

  _render() {
    const BAR_HEIGHT = 50;
    const statisticCtx = document.querySelector('.statistic__chart');

    // Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы
    statisticCtx.height = BAR_HEIGHT * 5;

    return new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels: ['Sci-Fi', 'Animation', 'Fantasy', 'Comedy', 'TV Series'], //Сюда нужно передать имеющиеся жанры
        datasets: [{
          data: [11, 8, 7, 4, 3], // Сюда нужно передать имеющиеся данные по кол-ву жанров, в соответствии с жанрами
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
  }
}

export default Statistic;
