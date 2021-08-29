import AbstractView from './abstract.js';

const createFilmsListTemplate = (title, isExtraList) => {
  const classList = (isExtraList) ? 'films-list films-list--extra' : 'films-list';

  return (
    `<section class="${classList}">
      <h2 class="films-list__title ${(isExtraList) ? '' : 'visually-hidden'}">${title}</h2>
      <div class="films-list__container"></div>
    </section>`
  );
};

class FilmsList extends AbstractView {
  constructor(title, isExtraList = false) {
    super();

    this._title = title;
    this._isExtraList = isExtraList;

    this._containerElement = null;
  }

  getTemplate() {
    return createFilmsListTemplate(this._title, this._isExtraList);
  }

  getContainer() {
    return this.getElement().querySelector('.films-list__container');
  }
}

export default FilmsList;
