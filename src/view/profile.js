import {createElement} from '../utils/utils';

const createProfileTemplate = (rating) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${rating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

class Profile {
  constructor(rating) {
    this._rating = rating;
    this._element = null;
  }

  getTemplate() {
    return createProfileTemplate(this._rating);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default Profile;
