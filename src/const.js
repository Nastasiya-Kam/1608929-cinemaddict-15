const EMOJI = ['smile', 'sleeping', 'puke', 'angry'];

const Mode = {
  DEFAULT: 'DEFAULT',
  OPENED: 'OPENED',
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const UserAction = {
  UPDATE_CONTROLS: 'UPDATE_CONTROLS',
  UPDATE_COMMENTS: 'UPDATE_COMMENTS',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  FAVORITE_WATCHLIST: 'FAVORITE_WATCHLIST',
  WATCHED: 'WATCHED',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export {EMOJI, Mode, SortType, UserAction, UpdateType};
