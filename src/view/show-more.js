import AbstractView from './abstract.js';

const createShowMoreTemplate = () => '<button class="films-list__show-more">Show more</button>';

class ShowMore extends AbstractView {
  constructor() {
    super();

    this._onShowMoreClick = this._onShowMoreClick.bind(this);
  }

  getTemplate() {
    return createShowMoreTemplate();
  }

  _onShowMoreClick(evt) {
    evt.preventDefault();
    this._callback.showMore();
  }

  setOnShowMoreClick(callback) {
    this._callback.showMore = callback;
    this.getElement().addEventListener('click', this._onShowMoreClick);
  }
}

export default ShowMore;
