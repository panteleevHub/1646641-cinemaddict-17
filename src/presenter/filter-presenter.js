import {render, replace, remove} from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import {filter} from '../utils/filter.js';
import {FilterType, FilterName, UpdateType} from '../utils/const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, filmsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const films = this.#filmsModel.films;

    return [
      {
        type: FilterType.ALL,
        name: FilterName.ALL,
        count: films.length,
      },
      {
        type: FilterType.WATCHLIST,
        name: FilterName.WATCHLIST,
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: FilterName.HISTORY,
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: FilterName.FAVORITES,
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeClickHandler(this.#filterTypeClickHandler);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #filterTypeClickHandler = (filterType) => {
    if (this.#filterModel.filter !== filterType) {
      this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
    }
  };
}
