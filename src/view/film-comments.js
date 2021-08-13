import {getCommentDate} from '../utils/dates.js';
import {EMOJI} from '../const.js';
import AbstractView from './abstract.js';

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
          <span class="film-details__comment-day">${getCommentDate(date)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`)
  .join('');

const createEmojiList = (emoji) => emoji.map((element) => (
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${element}" value="${element}">
  <label class="film-details__emoji-label" for="emoji-${element}">
    <img src="./images/emoji/${element}.png" width="30" height="30" alt="emoji">
  </label>`
));

const createFilmCommentsTemplate = (comments) => (
  `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

    <ul class="film-details__comments-list">${createComments(comments)}</ul>

    <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label"></div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
      </label>

      <div class="film-details__emoji-list">${createEmojiList(EMOJI)}</div>
    </div>
  </section>`
);

class FilmComments extends AbstractView {
  constructor(comments) {
    super();

    this._comments = comments;
  }

  getTemplate() {
    return createFilmCommentsTemplate(this._comments);
  }
}

export default FilmComments;
