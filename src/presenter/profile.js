import ProfileView from '../view/profile.js';
import {render, replace, remove} from '../utils/dom.js';
import {FilterType, filter} from '../utils/filter.js';
import {getRating} from '../utils/users.js';

class Profile {
  constructor(profileContainer, filmsModel) {
    this._profileContainer = profileContainer;
    this._filmsModel = filmsModel;

    this._profileComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const films = this._filmsModel.getFilms();
    const rating = filter[FilterType.WATCHED](films).length;

    const prevProfileComponent = this._profileComponent;

    this._profileComponent = new ProfileView(getRating(rating));

    if (prevProfileComponent === null) {
      render(this._profileContainer, this._profileComponent);
      return;
    }

    replace(this._profileComponent, prevProfileComponent);
    remove(prevProfileComponent);
  }

  _handleModelEvent() {
    this.init();
  }

}

export default Profile;
