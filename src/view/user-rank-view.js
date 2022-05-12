import AbstractView from '../framework/view/abstract-view.js';

const createUserRankTemplate = (filters) => {
  const filterHistory = filters.find((filter) => filter.name === 'History');

  let profileRating = '';

  if (filterHistory.count <= 10) {
    profileRating = 'Novice';
  }

  if (filterHistory.count > 10 && filterHistory.count <= 20) {
    profileRating = 'Fan';
  }

  if (filterHistory.count > 20) {
    profileRating = 'Movie Buff';
  }

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${profileRating}</p>
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
