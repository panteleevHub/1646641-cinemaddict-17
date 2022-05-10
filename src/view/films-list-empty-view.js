import AbstractView from '../framework/view/abstract-view.js';

const createEmptyFilmsLIstTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>
  </section>`
);

export default class EmptyFilmsListView extends AbstractView {
  get template() {
    return createEmptyFilmsLIstTemplate();
  }
}
