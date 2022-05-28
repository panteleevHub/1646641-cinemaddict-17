import AbstractView from '../framework/view/abstract-view';

const createFilmPopupFormTemplate = () => (
  '<form class="film-details__inner" action="" method="get"></form>'
);


export default class FilmPopupFormView extends AbstractView {
  get template() {
    return createFilmPopupFormTemplate();
  }
}