const EMOJI = ['smile', 'sleeping', 'puke', 'angry'];
const AUTHORIZATION = 'Basic dfaksdjlkjd4309SLDKflk';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

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
  CHANGE_FILTER: 'CHANGE_FILTER',
  OPEN_STATISTICS: 'OPEN_STATISTICS',
};

const UpdateType = {
  FAVORITE_WATCHLIST: 'FAVORITE_WATCHLIST',
  WATCHED: 'WATCHED',
  COMMENT_ADDED: 'COMMENT_ADDED',
  COMMENT_DELETED: 'COMMENT_DELETED',
  FILTER_CHANGED: 'FILTER_CHANGED',
  STATISTICS_OPENED: 'STATISTICS_OPENED',
  INIT: 'INIT',
};

export {EMOJI, Mode, SortType, UserAction, UpdateType, AUTHORIZATION, END_POINT};
