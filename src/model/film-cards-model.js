import {generateFilmCardData} from '../fish/film-card.js';

const FILMS_COUNT = 250;

export default class FilmCardsModel {
  #filmCards = Array.from({length: FILMS_COUNT}, generateFilmCardData);

  get filmCards() {
    return this.#filmCards;
  }
}
