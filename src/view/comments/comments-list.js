import AbstractView from '../abstract.js';

const createCommentsList = () => '<ul class="film-details__comments-list"></ul>';

class CommentsList extends AbstractView {
  getTemplate() {
    return createCommentsList();
  }
}

export default CommentsList;
