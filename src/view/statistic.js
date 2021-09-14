import SmartView from './smart.js';
import {getRating} from '../utils/users.js';
import {Statistics, makeItemsUnique, StatisticType, sortGenre, getCountWatchedFilms, getFilmGenres} from '../utils/statistics.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 50;

const renderGenresChart = (statisticCtx, films) => {
  const filmGenres = getFilmGenres(films);
  const uniqueGenres = makeItemsUnique(filmGenres);

  // todo<< Вынести функцией в utils/statistic.js
  // const genresData = getGenresData(uniqueGenres, filmGenres);
  // >> Возвращаемый объект? genresData = {labels: [], data: []};
  const genresData = [];

  for (let i = 0; i < uniqueGenres.length; i++) {
    const genreObject = {
      genre: uniqueGenres[i],
      count: 0,
    };

    for (let j = 0; j < filmGenres.length; j++) {
      if (filmGenres[j] === genreObject.genre) {
        genreObject.count += 1;
      }
    }

    genresData.push(genreObject);
  }

  genresData.sort(sortGenre);

  const labels = genresData.map((element) => element.genre);
  const data = genresData.map((element) => element.count);
  // todo>> Вынести функцией в utils/statistic.js

  statisticCtx.height = BAR_HEIGHT * uniqueGenres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: labels, //genresData.labels
      datasets: [{
        data: data, //genresData.data
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

const createStatisticTemplate = (statistics) => {
  const {films, period} = statistics;

  const statisticFiltersTemplate = Statistics
    .map((type) => createStatisticFilters(type, period))
    .join('');

  const watchedFilms = getCountWatchedFilms(films, period);

  let rating = 0;
  let filmsCount = 0;
  let duration = 0;
  let labels = '';

  if (watchedFilms.length !== 0) {
    rating = films.filter((film) => film.isWatched).length;
    filmsCount = watchedFilms.length;
    duration = watchedFilms.reduce((accumulator, stat) => accumulator + stat.duration, 0);
    const genres = getFilmGenres(watchedFilms);
    const uniqueGenres = makeItemsUnique(genres);

    // todo<< Вынести функцией в utils/statistic.js
    const genresData = [];

    for (let i = 0; i < uniqueGenres.length; i++) {
      const genreObject = {
        genre: uniqueGenres[i],
        count: 0,
      };

      for (let j = 0; j < genres.length; j++) {
        if (genres[j] === genreObject.genre) {
          genreObject.count += 1;
        }
      }

      genresData.push(genreObject);
    }

    genresData.sort(sortGenre);

    labels = genresData.map((element) => element.genre);
    // todo>> Вынести функцией в utils/statistic.js
    // В строку отразить: genresData.labels[0]
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
          ${(labels === '')? '' : `<p class="statistic__item-text">${labels[0]}</p>`}
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
    this._setChart();
  }

  _onStatisticTypeChange(evt) {
    evt.preventDefault();
    const currentPeriod = evt.target.value;

    this.updateData({
      period: currentPeriod,
    });
    this._setChart();
  }

  _setOnStatisticTypeChange() {
    this.getElement().querySelector('.statistic__filters').addEventListener('change', this._onStatisticTypeChange);
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
}

export default Statistic;
