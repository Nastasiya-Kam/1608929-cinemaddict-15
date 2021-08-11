import AbstractView from './abstract.js';

const createStatisticsTemplate = (number) => `<p>${number} movies inside</p>`;

class Statistics extends AbstractView {
  constructor(number) {
    super();

    this._number = number;
  }

  getTemplate() {
    return createStatisticsTemplate(this._number);
  }
}

export default Statistics;
