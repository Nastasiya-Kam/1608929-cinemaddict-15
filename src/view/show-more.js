import AbstractView from './abstract.js';

const createShowMoreTemplate = () => '<button class="films-list__show-more">Show more</button>';

class ShowMore extends AbstractView {
  getTemplate() {
    return createShowMoreTemplate();
  }
}

export default ShowMore;
