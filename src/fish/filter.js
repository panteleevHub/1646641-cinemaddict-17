import {filter} from '../utils/filter.js';

export const generateFilterData = (films) => (
  Object.entries(filter).map(([filterName, filmsCount]) => (
    {
      name: filterName,
      count: filmsCount(films).length,
    }
  ))
);
