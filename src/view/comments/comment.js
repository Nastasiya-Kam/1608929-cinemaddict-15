import {getFormattedCommentDate} from '../../utils/dates.js';
import {remove} from '../../utils/dom.js';
import SmartView from '../smart.js';
import he from 'he';

const createComment = (element) => {
  const {comment, emotion, author, date, isDeleting} = element;

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
      ${(emotion !== null)
      ? `<img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">`
      : ''}
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(comment)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${getFormattedCommentDate(date)}</span>
          <button
          class="film-details__comment-delete"
          ${isDeleting ? 'disabled' : ''}
          >
            ${isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </p>
      </div>
    </li>`
  );
};

class Comment extends SmartView {
  constructor(comment) {
    super();

    this._data = Comment.parseCommentToData(comment);
    this._onCommentDelete = this._onCommentDelete.bind(this);
  }

  getTemplate() {
    return createComment(this._data);
  }

  destroy() {
    remove(this);
  }

  restoreHandlers() {
    this.setOnCommentDelete(this._callback.commentDelete);
  }

  setIsDeleting(flag) {
    this.updateData({
      isDeleting: flag,
    });
  }

  _onCommentDelete(evt) {
    evt.preventDefault();
    this._callback.commentDelete(Comment.parseDataToComment(this._data));
  }

  setOnCommentDelete(callback) {
    this._callback.commentDelete = callback;
    this.getElement().querySelector('.film-details__comment-delete').addEventListener('click', this._onCommentDelete);
  }

  static parseCommentToData(comment) {
    return Object.assign(
      {},
      comment,
      {
        isDeleting: false,
      },
    );
  }

  static parseDataToComment(data) {
    data = Object.assign({}, data);

    delete data.isDeleting;

    return data;
  }
}

export default Comment;
