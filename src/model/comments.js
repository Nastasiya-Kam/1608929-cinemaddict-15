import AbstractObserver from '../utils/abstract-observer.js';

class Comments extends AbstractObserver {
  constructor() {
    super();
    this._comments = [];
  }

  setСomments(comments) {
    this._comments = comments.slice();
  }

  getСomments() {
    return this._comments;
  }

  addComment(updateType, update) {
    this._comments = [
      ...this._comments,
      update,
    ];

    this._notify(updateType, update);
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
