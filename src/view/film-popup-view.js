import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {convertMinsToHours, convertReleaseDate} from '../utils/date.js';
import {humanizeDate} from '../utils/date.js';
import he from 'he';

const body = document.body;

const createFilmPopupTemplate = (
  {filmInfo, userDetails, comments, localComment, isDisabled, isDeleting}, commentsList) => {

  const {
    title, poster, totalRating, genres, description,
    release, runtime, ageRating, alternativeTitle, director,
    writers, actors
  } = filmInfo;

  const {date, releaseCountry} = release;
  const {isWatchlist, isAlreadyWatched, isFavorite} = userDetails;

  const releaseDate = convertReleaseDate(date);
  const filmRuntime = convertMinsToHours(runtime);

  const genresTerm = genres.length > 1 ? 'Genres' : 'Genre';

  const createListOfGenres = () => {
    const filmGenres = genres.map((genre) => `<span class="film-details__genre">${genre}</span>`);
    return filmGenres.join('');
  };

  const watchlistClassName = isWatchlist
    ? 'film-details__control-button--watchlist film-details__control-button--active'
    : 'film-details__control-button--watchlist';

  const alreadyWatchedClassName = isAlreadyWatched
    ? 'film-details__control-button--watched film-details__control-button--active'
    : 'film-details__control-button--watched';

  const favoriteClassName = isFavorite
    ? 'film-details__control-button--favorite film-details__control-button--active'
    : 'film-details__control-button--favorite';


  const emotionImage = localComment.emotion !== null
    ? `<img src="./images/emoji/${localComment.emotion}.png" width="55" height="55" alt="emoji">`
    : '';

  const commentValue = localComment.comment !== null ? `${he.encode(localComment.comment)}` : '';

  const createListOfComments = () => {
    const filmComments = commentsList.map((commentItem) => {
      const humanizedDate = humanizeDate(commentItem.date);

      return (
        `<li class="film-details__comment" data-comment-id="${commentItem.id}">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${commentItem.emotion}.png" width="55" height="55" alt="emoji-${commentItem.emotion}">
          </span>
          <div>
            <p class="film-details__comment-text">${he.encode(commentItem.comment)}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${commentItem.author}</span>
              <span class="film-details__comment-day">${humanizedDate}</span>
              <button class="film-details__comment-delete" ${isDeleting ? 'disabled' : ''}>
              ${isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </p>
          </div>
        </li>`
      );
    });

    return filmComments.join('');
  };

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get" ${isDisabled ? 'disabled' : ''}>
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
                  <p class="film-details__title-original">Original: ${alternativeTitle}</p>
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
              <div class="film-details__add-emoji-label">
                ${emotionImage}
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${commentValue}</textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${localComment.emotion === 'smile' ? 'checked' : ''}>
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${localComment.emotion === 'sleeping' ? 'checked' : ''}>
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${localComment.emotion === 'puke' ? 'checked' : ''}>
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${localComment.emotion === 'angry' ? 'checked' : ''}>
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

const createNewComment = ({localComment}) => ({
  comment: localComment.comment,
  emotion: localComment.emotion,
});

export default class FilmPopupView extends AbstractStatefulView {
  #comments = null;

  constructor(film, comments) {
    super();
    this.#comments = comments;

    this._state = this.#convertFilmToState(film);

    this.#setInnerHandlers();
  }

  get template() {
    return createFilmPopupTemplate(this._state, this.#comments);
  }

  resetState = () => {
    this.updateElement({
      localComment: {
        comment: null,
        emotion: null,
      }
    });
  };

  openPopup = () => {
    body.classList.add('hide-overflow');
    body.appendChild(this.element);
  };

  closePopup = () => {
    body.classList.remove('hide-overflow');
    this.element.remove();
  };

  setClosePopupClickHandler = (callback) => {
    this._callback.closePopupClick = callback;

    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closePopupClickHandler);
  };

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

  setDeleteCommentClickHandler = (callback) => {
    this._callback.deleteCommentClick = callback;
    this.element.querySelector('.film-details__comments-list')
      .addEventListener('click', this.#deleteCommentClickHandler);
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('keydown', this.#formSubmitHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setDeleteCommentClickHandler(this._callback.deleteCommentClick);
    this.setWatchlistButtonClickHandler(this._callback.watchlistPopupClick);
    this.setHistoryButtonClickHandler(this._callback.historyPopupClick);
    this.setFavoriteButtonClickHandler(this._callback.favoritePopupClick);
    this.setClosePopupClickHandler(this._callback.closePopupClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
  };

  #convertFilmToState = (film) => ({
    ...film,
    isDisabled: false,
    isDeleting: false,
  });

  #convertStateToFilm = (state) => {
    const film = {...state};

    delete film.isDisabled;
    delete film.isDeleting;

    return film;
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('click', this.#emotionClickHandler);
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentInputHandler);
  };

  #closePopupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closePopupClick();
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

  #emotionClickHandler = ({target}) => {
    if (target.tagName === 'INPUT') {
      const scrollPosition = this.element.scrollTop;

      this.updateElement({
        localComment: {
          ...this._state.localComment,
          emotion: target.value,
        },
      });

      this.element.scrollTop = scrollPosition;
    }
  };

  #commentInputHandler = ({target}) => {
    this._setState({
      localComment: {
        ...this._state.localComment,
        comment: target.value,
      },
    });
  };

  #deleteCommentClickHandler = (evt) => {
    if (evt.target.tagName === 'BUTTON') {
      evt.preventDefault();
      const selectedCommentId = evt.target.closest('.film-details__comment').dataset.commentId;

      const selectedComment = this.#comments
        .find((comment) => comment.id === selectedCommentId);

      this._callback.deleteCommentClick(
        this.#convertStateToFilm(this._state),
        selectedComment,
      );
    }
  };

  #formSubmitHandler = (evt) => {
    if (evt.key === 'Enter' && (evt.ctrlKey || evt.metaKey)) {
      evt.preventDefault();
      const newComment = createNewComment(this._state);

      this._callback.formSubmit(
        this.#convertStateToFilm(this._state),
        newComment
      );
    }
  };
}
