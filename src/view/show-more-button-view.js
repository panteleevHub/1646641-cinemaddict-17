import AbstractView from '../framework/view/abstract-view.js';

const createShowMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ShowMoreButtonView extends AbstractView {
  get template() {
    return createShowMoreButtonTemplate();
  }

  setShowMoreButtonClickHandler = (callback) => {
    this._callback.showMoreButtonclick = callback;

    this.element.addEventListener('click', this.#showMoreButtonClickHandler);
  };

  #showMoreButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.showMoreButtonclick();
  };
}
