import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../utils/const.js';

const EmptyFilmsListTitle = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createEmptyFilmsLIstTemplate = (filterType) => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${EmptyFilmsListTitle[filterType]}</h2>
    </section>
  </section>`
);

export default class EmptyFilmsListView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyFilmsLIstTemplate(this.#filterType);
  }
}
