import {createElement} from '../render.js';
import {convertReleaseYear, convertMinsToHours} from '../util.js';

const createFilmCardTemplate = ({filmInfo, comments, userDetails}) => {
  const {title, poster, totalRating, genres, description, release, runtime} = filmInfo;
  const {isWatchlist, isAlreadyWatched, isFavorite} = userDetails;

  const releaseYear = convertReleaseYear(release.date);
  const filmRuntime = convertMinsToHours(runtime);

  const watchlistClassName = isWatchlist
    ? 'film-card__controls-item--add-to-watchlist'
    : 'film-card__controls-item--add-to-watchlist film-card__controls-item--active';

  const alreadyWatchedClassName = isAlreadyWatched
    ? 'film-card__controls-item--mark-as-watched'
    : 'film-card__controls-item--mark-as-watched film-card__controls-item--active';

  const favoriteClassName = isFavorite
    ? 'film-card__controls-item--favorite'
    : 'film-card__controls-item--favorite film-card__controls-item--active';

  return (
    `<article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${releaseYear}</span>
          <span class="film-card__duration">${filmRuntime}</span>
          <span class="film-card__genre">${genres[0]}</span>
        </p>
        <img src="${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${description}</p>
        <span class="film-card__comments">${comments.length} comments</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item ${watchlistClassName}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item ${alreadyWatchedClassName}" type="button">Mark as watched</button>
        <button class="film-card__controls-item ${favoriteClassName}" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class FilmCardView {
  constructor(film) {
    this.film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this.film);
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
