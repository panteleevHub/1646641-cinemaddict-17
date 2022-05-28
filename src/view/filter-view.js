import AbstractView from '../framework/view/abstract-view.js';

const createFilterTemplate = (filters) => {
  const filtersTemplate = filters.map(({name, count}) => (
    `<a href="#${name.toLowerCase()}" class="main-navigation__item">
      ${name}
      <span class="main-navigation__item-count">${count}</span>
    </a>`
  )).join('');

  return (
    `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${filtersTemplate}
    </nav>`
  );
};

export default class FilterView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
