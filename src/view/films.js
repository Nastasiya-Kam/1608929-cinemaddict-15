import AbstractView from './abstract.js';

const createFilmsTemplate = () => '<section class="films"></section>';

class Films extends AbstractView {
  getTemplate() {
    return createFilmsTemplate();
  }
}

export default Films;
