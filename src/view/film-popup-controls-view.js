import AbstractView from '../framework/view/abstract-view';

const createFilmPopupControlsTemplate = ({userDetails}) => {
  const {isWatchlist, isAlreadyWatched, isFavorite} = userDetails;

  const watchlistClassName = isWatchlist
    ? 'film-details__control-button--watchlist film-details__control-button--active'
    : 'film-details__control-button--watchlist';

  const alreadyWatchedClassName = isAlreadyWatched
    ? 'film-details__control-button--watched film-details__control-button--active'
    : 'film-details__control-button--watched';

  const favoriteClassName = isFavorite
    ? 'film-details__control-button--favorite film-details__control-button--active'
    : 'film-details__control-button--favorite';

  return (
    `<section class="film-details__controls">
      <button type="button" class="film-details__control-button ${watchlistClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
      <button type="button" class="film-details__control-button ${alreadyWatchedClassName}" id="watched" name="watched">Already watched</button>
      <button type="button" class="film-details__control-button ${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
    </section>`
  );
};

export default class FilmPopupControlsView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmPopupControlsTemplate(this.#film);
  }

  setWatchlistButtonClickHandler = (callback) => {
    this._callback.watchlistPopupClick = callback;

    this.element.querySelector('.film-details__control-button--watchlist').addEventListener(
      'click',
      this.#watchlistButtonClickHandler
    );
  };

  setHistoryButtonClickHandler = (callback) => {
    this._callback.historyPopupClick = callback;

    this.element.querySelector('.film-details__control-button--watched').addEventListener(
      'click',
      this.#historyButtonClickHandler
    );
  };

  setFavoriteButtonClickHandler = (callback) => {
    this._callback.favoritePopupClick = callback;

    this.element.querySelector('.film-details__control-button--favorite').addEventListener(
      'click',
      this.#favoriteButtonClickHandler
    );
  };

  #watchlistButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistPopupClick();
  };

  #historyButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.historyPopupClick();
  };

  #favoriteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoritePopupClick();
  };
}
