const Mode = {
  DEFAULT: 'default',
  POPUP: 'popup',
};

const FilterType = {
  ALL: 'All',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};

const UserRank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

const NumberOfViewedFilms = {
  NONE: 0,
  AVERAGE: 10,
  MAX: 20,
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export {
  UserRank,
  NumberOfViewedFilms,
  FilterType,
  UserAction,
  UpdateType,
  Mode,
};
