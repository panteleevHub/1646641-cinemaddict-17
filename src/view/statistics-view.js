import {createElement} from '../render.js';

const getStatisticsTemplate = () => '<p>130 291 movies inside</p>';

export default class StatisticsView {
  getTemplate() {
    return getStatisticsTemplate();
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
