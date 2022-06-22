const Mode = {
  DEFAULT: 'default',
  POPUP: 'popup',
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const FilterType = {
  ALL: 'ALL',
  WATCHLIST: 'WATCHLIST',
  HISTORY: 'HISTORY',
  FAVORITES: 'FAVORITES',
};

const FilterName = {
  ALL: 'All movies',
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
  UPDATE_POPUP: 'UPDATE_POPUP',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export {
  UserRank,
  NumberOfViewedFilms,
  FilterType,
  FilterName,
  UserAction,
  UpdateType,
  Mode,
  Method,
};
