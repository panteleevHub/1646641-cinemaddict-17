import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../utils/sort.js';

const createSortTemplate = () => (
  `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
  </ul>`
);

export default class SortView extends AbstractView {
  get template() {
    return createSortTemplate();
  }

  setSortTypeClickHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeClickHandler);
  };

  #sortTypeClickHandler = (evt) => {
    if (evt.target.tagName === 'A') {
      evt.preventDefault();
      this.#toggleSortTypes(evt);
      this._callback.sortTypeChange(evt.target.dataset.sortType);
    }
  };

  #toggleSortTypes = ({target}) => {
    const sortButtons = this.element.querySelectorAll('.sort__button');

    for (const sortButton of sortButtons) {
      if (sortButton.classList.contains('sort__button--active')) {
        sortButton.classList.remove('sort__button--active');
      }
    }
    target.classList.add('sort__button--active');
  };
}
