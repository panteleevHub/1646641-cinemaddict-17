import AbstractView from '../framework/view/abstract-view.js';
const body = document.body;

const createFilmPopupTemplate = () => '<section class="film-details"></section>';

export default class FilmPopupView extends AbstractView {
  get template() {
    return createFilmPopupTemplate();
  }

  openPopup = () => {
    body.classList.toggle('hide-overflow');
    body.appendChild(this.element);
  };

  closePopup = () => {
    body.classList.toggle('hide-overflow');
    body.removeChild(body.querySelector('.film-details'));
  };
}
