import AbstractView from '../abstract.js';

const createCommentsListTitle = (length) => (
  `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${length}</span></h3>`
);

class CommentsListTitle extends AbstractView {
  constructor(length) {
    super();

    this._length = length;
  }

  getTemplate() {
    return createCommentsListTitle(this._length);
  }
}

export default CommentsListTitle;
