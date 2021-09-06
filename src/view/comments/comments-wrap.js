import AbstractView from '../abstract.js';

const createCommentWrapTemplate = () => '<section class="film-details__comments-wrap"></section>';

class CommentsWrap extends AbstractView {
  getTemplate() {
    return createCommentWrapTemplate();
  }
}

export default CommentsWrap;
