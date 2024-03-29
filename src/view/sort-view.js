import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../utils/sort.js';

const createSortTemplate = (currentSortType) => (
  `<ul class="sort">
    <li>
      <a href="#" class="sort__button ${currentSortType === SortType.DEFAULT ? 'sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a>
    </li>
    <li>
      <a href="#" class="sort__button ${currentSortType === SortType.DATE ? 'sort__button--active' : ''}" data-sort-type="${SortType.DATE}">Sort by date</a>
    </li>
    <li>
      <a href="#" class="sort__button ${currentSortType === SortType.RATING ? 'sort__button--active' : ''}" data-sort-type="${SortType.RATING}">Sort by rating</a>
    </li>
  </ul>`
);

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  setSortTypeClickHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeClickHandler);
  };

  #sortTypeClickHandler = (evt) => {
    if (evt.target.tagName === 'A') {
      evt.preventDefault();
      this._callback.sortTypeChange(evt.target.dataset.sortType);
    }
  };
}
