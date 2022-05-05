import {createElement} from '../render.js';
import CommentsModel from '../model/comments-model.js';
import {
  convertMinsToHours,
  convertReleaseDate,
  humanizeDate,
} from '../util.js';

const commentsModel = new CommentsModel();
const commentsData = [...commentsModel.comments];

const createFilmPopupTemplate = ({filmInfo, comments, userDetails}) => {
  const {
    title, poster, totalRating, genres, description,
    release, runtime, ageRating, originalTitle, director,
    writers, actors
  } = filmInfo;

  const {date, releaseCountry} = release;
  const {isWatchlist, isAlreadyWatched, isFavorite} = userDetails;

  const releaseDate = convertReleaseDate(date);
  const filmRuntime = convertMinsToHours(runtime);

  const watchlistClassName = isWatchlist
    ? 'film-details__control-button--watchlist'
    : 'film-details__control-button--watchlist film-details__control-button--active';

  const alreadyWatchedClassName = isAlreadyWatched
    ? 'film-details__control-button--watched'
    : 'film-details__control-button--watched film-details__control-button--active';

  const favoriteClassName = isFavorite
    ? 'film-details__control-button--favorite'
    : 'film-details__control-button--favorite film-details__control-button--active';

  const genresTerm = genres.length > 1 ? 'Genres' : 'Genre';

  const createListOfGenres = () => {
    const filmGenres = genres.map((genre) => `<span class="film-details__genre">${genre}</span>`);
    return filmGenres.join('\n');
  };

  const createListOfComments = () => {
    const filmComments = comments.map((comment) => {

      const userComment = commentsData.find((elem) => elem.id === comment);
      const humanizedDate = humanizeDate(userComment.date);

      return (
        `<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${userComment.emotion}.png" width="55" height="55" alt="emoji-${userComment.emotion}">
          </span>
          <div>
            <p class="film-details__comment-text">${userComment.comment}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${userComment.author}</span>
              <span class="film-details__comment-day">${humanizedDate}</span>
              <button class="film-details__comment-delete">Delete</button>
            </p>
          </div>
        </li>`
      );
    });

    return filmComments.join('\n');
  };

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
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

          <section class="film-details__controls">
            <button type="button" class="film-details__control-button ${watchlistClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button ${alreadyWatchedClassName}" id="watched" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button ${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

            <ul class="film-details__comments-list">${createListOfComments()}</ul>
            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmPopupView {
  #film = null;
  #element = null;

  constructor(film) {
    this.#film = film;
  }

  get template() {
    return createFilmPopupTemplate(this.#film);
  }

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
