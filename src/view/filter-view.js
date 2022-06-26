import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../utils/const.js';

const createFilterTemplate = (filters, currentFilterType) => {
  const filtersTemplate = filters.map(({type, name, count}) => (
    `<a href="#${type}" class="main-navigation__item
      ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-filter-type="${type}">
      ${name}
      ${type !== FilterType.ALL ? `<span class="main-navigation__item-count">${count}</span>` : ''}
    </a>`
  )).join('');

  return (
    `<nav class="main-navigation">
      ${filtersTemplate}
    </nav>`
  );
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilterType = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilterType);
  }

  setFilterTypeClickHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeClickHandler);
  };

  #filterTypeClickHandler = (evt) => {
    if (evt.target.closest('a')) {
      evt.preventDefault();

      const target = evt.target.tagName === 'SPAN' ? evt.target.parentElement : evt.target;
      this._callback.filterTypeChange(target.dataset.filterType);
    }
  };
}
