import {generateFilmCardData} from '../fish/film-card.js';

const FILMS_COUNT = 5;

export default class FilmCardsModel {
  filmCards = Array.from({length: FILMS_COUNT}, generateFilmCardData);

  getFilmCards = () => this.filmCards;
}
