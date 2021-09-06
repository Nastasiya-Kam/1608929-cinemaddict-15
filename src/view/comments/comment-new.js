import {isCtrlEnterEvent} from '../../utils/dom.js';
import {EMOJI} from '../../const.js';
import SmartView from '../smart.js';

const createEmojiList = (emoji) => emoji
  .map((element) => (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${element}" value="${element}">
    <label class="film-details__emoji-label" for="emoji-${element}">
      <img src="./images/emoji/${element}.png" width="30" height="30" alt="emoji">
    </label>`
  ))
  .join('');

const createCommentNewTemplate = (commentNew) => (
  `<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">${(commentNew.emotion !== null) ? `<img src="./images/emoji/${commentNew.emotion}.png" width="55" height="55" alt="emoji"></img>` : ''}</div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${commentNew.comment}</textarea>
    </label>

    <div class="film-details__emoji-list">${createEmojiList(EMOJI)}</div>
  </div>`
);

class CommentNew extends SmartView {
  constructor() {
    super();

    this._commentNew = {
      comment: '',
      emotion: null,
    };

    this._onDescriptionTextareaChange = this._onDescriptionTextareaChange.bind(this);
    this._onEmojiClick = this._onEmojiClick.bind(this);
    this._onCommentSubmit = this._onCommentSubmit.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    return createCommentNewTemplate(this._commentNew);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setOnCommentSubmit(this._callback.commentSubmit);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.film-details__emoji-list').addEventListener('change', this._onEmojiClick);
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._onDescriptionTextareaChange);
  }

  _onDescriptionTextareaChange(evt) {
    evt.preventDefault();
    this.updateData({
      comment: evt.target.value,
    }, true);
  }

  _onEmojiClick(evt) {
    if (evt.target.value === this._commentNew.emotion) {
      return;
    }

    this.updateData({
      emotion: evt.target.value,
    });
  }

  _onCommentSubmit(evt) {
    if(isCtrlEnterEvent(evt)){
      evt.preventDefault();
      this._callback.commentSubmit(this._commentNew);
    }
  }

  setOnCommentSubmit(callback) {
    this._callback.commentSubmit = callback;
    this.getElement().querySelector('textarea').addEventListener('keydown', this._onCommentSubmit);
  }
}

export default CommentNew;
