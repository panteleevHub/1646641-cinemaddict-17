import AbstractView from '../framework/view/abstract-view';
import {
  convertMinsToHours,
  convertReleaseDate,
} from '../utils/date.js';

const createFilmPopupInfoTemplate = ({filmInfo}) => {
  const {
    title, poster, totalRating, genres, description,
    release, runtime, ageRating, originalTitle, director,
    writers, actors
  } = filmInfo;

  const {date, releaseCountry} = release;

  const releaseDate = convertReleaseDate(date);
  const filmRuntime = convertMinsToHours(runtime);

  const genresTerm = genres.length > 1 ? 'Genres' : 'Genre';

  const createListOfGenres = () => {
    const filmGenres = genres.map((genre) => `<span class="film-details__genre">${genre}</span>`);
    return filmGenres.join('');
  };

  return (
    `<div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${originalTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${releaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${filmRuntime}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genresTerm}</td>
              <td class="film-details__cell">${createListOfGenres()}</tr>
          </table>

          <p class="film-details__film-description">${description}</p>
        </div>
      </div>

    </div>`
  );
};


export default class FilmPopupInfoView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmPopupInfoTemplate(this.#film);
  }

  setPopupClickHandler = (callback) => {
    this._callback.closePopupClick = callback;

    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closePopupClickHandler);
  };

  #closePopupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closePopupClick();
  };
}
