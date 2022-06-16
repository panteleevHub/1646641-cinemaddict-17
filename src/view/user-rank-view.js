import AbstractView from '../framework/view/abstract-view.js';
import {
  UserRank,
  NumberOfViewedFilms,
  FilterType,
} from '../utils/const.js';

const createUserRankTemplate = (filters) => {
  const filterHistory = filters.find((filter) => filter.name === FilterType.HISTORY);

  let userRank = '';

  if (filterHistory.count > NumberOfViewedFilms.NONE && filterHistory.count <= NumberOfViewedFilms.AVERAGE) {
    userRank = UserRank.NOVICE;
  }

  if (filterHistory.count > NumberOfViewedFilms.AVERAGE && filterHistory.count <= NumberOfViewedFilms.MAX) {
    userRank = UserRank.FAN;
  }

  if (filterHistory.count > NumberOfViewedFilms.MAX) {
    userRank = UserRank.MOVIE_BUFF;
  }

  if (filterHistory.count === NumberOfViewedFilms.NONE) {
    return (
      `<section class="header__profile profile">
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      </section>`
    );
  }

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${userRank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class UserRankView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createUserRankTemplate(this.#filters);
  }
}
