import {getFormattedCommentDate} from '../utils/dates.js';
import {isCtrlEnterEvent} from '../utils/dom.js';
import {EMOJI} from '../const.js';
import SmartView from './smart.js';

const createComments = (comments) => comments
  .map(({text, emoji, author, date}) =>
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${getFormattedCommentDate(date)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`)
  .join('');

const createEmojiList = (emoji) => emoji
  .map((element) => (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${element}" value="${element}">
    <label class="film-details__emoji-label" for="emoji-${element}">
      <img src="./images/emoji/${element}.png" width="30" height="30" alt="emoji">
    </label>`
  ))
  .join('');

const createFilmCommentsTemplate = (comments, data) => (
  `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

    <ul class="film-details__comments-list">${createComments(comments)}</ul>

    <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">${(!data.emotion === null) ? `<img src="${data.emotion}" width="55" height="55" alt="emoji"></img>` : ''}</div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${data.comment}</textarea>
      </label>

      <div class="film-details__emoji-list">${createEmojiList(EMOJI)}</div>
    </div>
  </section>`
);

class FilmComments extends SmartView {
  constructor(comments) {
    super();

    this._comments = comments;
    this._data = {
      comment: '',
      emotion: null,
    };

    this._onDescriptionTextareaChange = this._onDescriptionTextareaChange.bind(this);
    this._onEmojiClick = this._onEmojiClick.bind(this);
    this._onCommentSubmit = this._onCommentSubmit.bind(this);
    this._onCommentDelete = this._onCommentDelete.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmCommentsTemplate(this._comments, this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.film-details__emoji-list').addEventListener('click', this._onEmojiClick);
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._onDescriptionTextareaChange);
  }

  _onDescriptionTextareaChange(evt) {
    evt.preventDefault();
    this.updateData({
      comment: evt.target.value,
    }, true);
  }

  _onEmojiClick(evt) {
    if (evt.target.src === this._data.emotion) {
      return;
    }

    if (evt.target.tagName === 'IMG') {
      this.updateData({
        emotion: evt.target.src,
      });
    }
  }

  _onCommentSubmit(evt) {
    if(isCtrlEnterEvent(evt)){
      evt.preventDefault();
      this._callback.commentSubmit(this._data);
    }
  }

  setOnCommentSubmit(callback) {
    this._callback.commentSubmit = callback;
    this.getElement().querySelector('textarea').addEventListener('keydown', this._onCommentSubmit);
  }

  _onCommentDelete(evt) {
    if (evt.target.tagName === 'BUTTON') {
      evt.preventDefault();
      this._callback.commentDelete(this._data);
    }
  }

  setOnCommentDelete(callback) {
    this._callback.commentDelete = callback;
    this.getElement().querySelector('.film-details__comments-list').addEventListener('click', this._onCommentDelete);
  }
}

export default FilmComments;
