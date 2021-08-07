import {createElement} from '../utils/utils';

const createStatisticsTemplate = (number) => `<p>${number} movies inside</p>`;

class Statistics {
  constructor(number) {
    this._number = number;
    this._element = null;
  }

  getTemplate() {
    return createStatisticsTemplate(this._number);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default Statistics;
