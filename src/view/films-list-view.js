import AbstractView from '../framework/view/abstract-view.js';

const createFilmsLIstTemplate = () => '<div class="films-list__container"></div>';

export default class FilmsListView extends AbstractView {
  get template() {
    return createFilmsLIstTemplate();
  }
}
