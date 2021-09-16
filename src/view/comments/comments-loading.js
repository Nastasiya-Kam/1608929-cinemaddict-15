import AbstractView from '../abstract.js';

const createCommentsLoadingTemplate = () => '<h3 class="film-details__comments-title">Loading...</h3>';

class CommentsLoading extends AbstractView {
  getTemplate() {
    return createCommentsLoadingTemplate();
  }
}

export default CommentsLoading;
