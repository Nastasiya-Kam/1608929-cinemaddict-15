import dayjs from 'dayjs';
import {EMOJI} from '../const.js';

const createComments = (comments) => {
  let commentsList = '';

  for (const comment of comments) {
    const {text, emoji, author, date} = comment;

    commentsList += (
      `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${dayjs(date).format('YYYY/M/DD HH:mm')}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
    );
  }

  return commentsList;
};

const createEmojiList = (emoji) => {
  let emojiTemplate = '';

  for (const element of emoji) {
    emojiTemplate += `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
    <label class="film-details__emoji-label" for="emoji-${element}">
      <img src="./images/emoji/${element}.png" width="30" height="30" alt="emoji">
    </label>`;
  }

  return emojiTemplate;
};

const createFilmCommentsTemplate = (film) => {
  const {comments} = film;

  return (
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
};

export {createFilmCommentsTemplate};
