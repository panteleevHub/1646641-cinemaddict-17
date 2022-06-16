import AbstractView from '../framework/view/abstract-view.js';
import {convertReleaseYear, convertMinsToHours} from '../utils/date.js';

const createFilmTemplate = ({filmInfo, comments, userDetails}) => {
  const {title, poster, totalRating, genres, description, release, runtime} = filmInfo;
  const {isWatchlist, isAlreadyWatched, isFavorite} = userDetails;

  const releaseYear = convertReleaseYear(release.date);
  const filmRuntime = convertMinsToHours(runtime);

  const watchlistClassName = isWatchlist
    ? 'film-card__controls-item--add-to-watchlist film-card__controls-item--active'
    : 'film-card__controls-item--add-to-watchlist';

  const alreadyWatchedClassName = isAlreadyWatched
    ? 'film-card__controls-item--mark-as-watched film-card__controls-item--active'
    : 'film-card__controls-item--mark-as-watched';

  const favoriteClassName = isFavorite
    ? 'film-card__controls-item--favorite film-card__controls-item--active'
    : 'film-card__controls-item--favorite';

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

export default class FilmView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmTemplate(this.#film);
  }

  setFilmClickHandler = (callback) => {
    this._callback.cardClick = callback;

    this.element.querySelector('.film-card__link').addEventListener('click', this.#flmCardClickHandler);
  };

  setWatchlistButtonClickHandler = (callback) => {
    this._callback.watchlistClick = callback;

    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener(
      'click',
      this.#watchlistButtonClickHandler
    );
  };

  setHistoryButtonClickHandler = (callback) => {
    this._callback.historyClick = callback;

    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener(
      'click',
      this.#historyButtonClickHandler
    );
  };

  setFavoriteButtonClickHandler = (callback) => {
    this._callback.favoriteClick = callback;

    this.element.querySelector('.film-card__controls-item--favorite').addEventListener(
      'click',
      this.#favoriteButtonClickHandler
    );
  };

  #flmCardClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.cardClick();
  };

  #watchlistButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #historyButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.historyClick();
  };

  #favoriteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
