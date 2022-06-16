import AbstractView from '../framework/view/abstract-view.js';

const createStatisticsTemplate = (films) => {
  const filmsCount = String(films.length).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');

  return `<p>${filmsCount} movies inside</p>`;
};

export default class StatisticsView extends AbstractView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createStatisticsTemplate(this.#films);
  }
}
