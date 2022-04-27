import {createElement} from '../render.js';

const getFilmsContainerTemplate = () => '<section class="films"></section>';

export default class FilmsContainerView {
  getTemplate() {
    return getFilmsContainerTemplate();
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
