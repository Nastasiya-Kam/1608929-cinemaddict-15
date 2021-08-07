import {createElement} from '../utils/utils.js';

const createShowMoreTemplate = () => '<button class="films-list__show-more">Show more</button>';

class ShowMore {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createShowMoreTemplate();
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

export default ShowMore;
