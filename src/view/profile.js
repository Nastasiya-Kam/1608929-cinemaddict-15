import AbstractView from './abstract.js';
import {getRating} from '../utils/users.js';

const createProfileTemplate = (rating) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${getRating(rating)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

class Profile extends AbstractView {
  constructor(rating) {
    super();

    this._rating = rating;
  }

  getTemplate() {
    return createProfileTemplate(this._rating);
  }
}

export default Profile;
