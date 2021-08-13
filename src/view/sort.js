import AbstractView from './abstract.js';

const createSortTemplate = () => (
  `<ul class="sort">
    <li><a href="#" class="sort__button">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button sort__button--active">Sort by rating</a></li>
  </ul>`
);

class Sort extends AbstractView {
  getTemplate() {
    return createSortTemplate();
  }
}

export default Sort;
