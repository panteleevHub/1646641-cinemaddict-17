const FilterTypes = {
  ALL: 'All',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};

const filter = {
  [FilterTypes.WATCHLIST]: (films) => films.filter(({userDetails}) => userDetails.isWatchlist),
  [FilterTypes.HISTORY]: (films) => films.filter(({userDetails}) => userDetails.isAlreadyWatched),
  [FilterTypes.FAVORITES]: (films) => films.filter(({userDetails}) => userDetails.isFavorite),
};

const generateFilterData = (films) => (
  Object.entries(filter).map(([filterName, filmsCount]) => (
    {
      name: filterName,
      count: filmsCount(films).length,
    }
  ))
);

export {generateFilterData};
