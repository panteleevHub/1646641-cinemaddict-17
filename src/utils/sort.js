import dayjs from 'dayjs';

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

const sortFilmsByDate = (filmA, filmB) => (
  dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date))
);

const sortFilmsByRating = (filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;

export {
  SortType,
  sortFilmsByDate,
  sortFilmsByRating,
};
