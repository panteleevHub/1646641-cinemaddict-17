import AbstractView from '../framework/view/abstract-view.js';

const createStatisticsTemplate = (films) => {
  const filmsCount = String(films.length).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');

  return `<p>${filmsCount} movies inside</p>`;
};

export default class StatisticsView extends AbstractView {
  #filmCards = null;

  constructor(films) {
    super();
    this.#filmCards = films;
  }

  get template() {
    return createStatisticsTemplate(this.#filmCards);
  }
}
