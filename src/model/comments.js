import AbstractObserver from '../utils/abstract-observer.js';

// Временная замена сервера по генерации случайной даты и случайного id
import {nanoid} from 'nanoid';
import {getRandomInteger} from '../utils/common.js';
const generateDate = () => `${getRandomInteger(1950, 2021)}-${getRandomInteger(1, 12)}-${getRandomInteger(1, 28)}`;

class Comments extends AbstractObserver {
  constructor() {
    super();
    this._comments = [];
  }

  set comments(comments) {
    this._comments = comments.slice();
  }

  get comments() {
    return this._comments;
  }

  _getComment(newComment) {
    return {
      id: nanoid(),
      author: 'Ilya O\'Reilly',
      text: newComment.comment,
      date: generateDate(),
      emoji: newComment.emotion,
    };
  }

  addComment(updateType, update) {
    const comment = this._getComment(update);

    this._comments = [
      ...this._comments,
      comment,
    ];

    // ?ВОПРОС: мы же можем на входе принять одно изменение, а вернуть другое?
    this._notify(updateType, this._comments);
  }

  deleteComment(updateType, update) {
    const index = this._comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];

    // ?ВОПРОС: мы же можем на входе принять одно изменение, а вернуть другое?
    this._notify(updateType, this._comments);
  }
}

export default Comments;
