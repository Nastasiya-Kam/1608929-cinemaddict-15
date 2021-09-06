import {getFormattedCommentDate} from '../../utils/dates.js';
import {remove} from '../../utils/dom.js';
import AbstractView from '../abstract.js';

const createComment = (comment) => {
  const {text, emoji, author, date} = comment;

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
      ${(emoji !== null)
      ? `<img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">`
      : ''}
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${getFormattedCommentDate(date)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

class Comment extends AbstractView {
  constructor(comment) {
    super();

    this._comment = comment;
    this._onCommentDelete = this._onCommentDelete.bind(this);
  }

  getTemplate() {
    return createComment(this._comment);
  }

  destroy() {
    remove(this);
  }

  _onCommentDelete(evt) {
    evt.preventDefault();
    this._callback.commentDelete(this._comment);
  }

  setOnCommentDelete(callback) {
    this._callback.commentDelete = callback;
    this.getElement().querySelector('.film-details__comment-delete').addEventListener('click', this._onCommentDelete);
  }
}

export default Comment;
