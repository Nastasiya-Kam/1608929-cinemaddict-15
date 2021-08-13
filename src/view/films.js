import AbstractView from './abstract.js';

const createFilmsTemplate = () => '<section class="films"></section>';

class Films extends AbstractView {
  constructor() {
    super();

    this._onShowMoreClick = this._onShowMoreClick.bind(this);
  }

  getTemplate() {
    return createFilmsTemplate();
  }

  _onShowMoreClick(evt) {
    evt.preventDefault();
    this._callback.showMore();
  }

  setOnShowMoreClick(callback) {
    this._callback.showMore = callback;
    this.getElement().querySelector('.films-list__show-more').addEventListener('click', this._onShowMoreClick);
  }
}

export default Films;
