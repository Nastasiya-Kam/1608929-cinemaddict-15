import {createElement} from '../utils/utils.js';

const createTopRatedTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>

    <div class="films-list__container">
    </div>
  </section>`
);

class TopRated {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTopRatedTemplate();
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

export default TopRated;
