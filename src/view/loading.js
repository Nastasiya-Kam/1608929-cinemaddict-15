import AbstractView from './abstract.js';

const createNoFilmTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">Loading...</h2>
    </section>
  </section>`
);

class Loading extends AbstractView {
  getTemplate() {
    return createNoFilmTemplate();
  }
}

export default Loading;
