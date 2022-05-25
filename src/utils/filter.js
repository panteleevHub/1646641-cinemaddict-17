const FilterType = {
  ALL: 'All',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};

const filter = {
  [FilterType.WATCHLIST]: (films) => films.filter(({userDetails}) => userDetails.isWatchlist),
  [FilterType.HISTORY]: (films) => films.filter(({userDetails}) => userDetails.isAlreadyWatched),
  [FilterType.FAVORITES]: (films) => films.filter(({userDetails}) => userDetails.isFavorite),
};

export {FilterType, filter};
