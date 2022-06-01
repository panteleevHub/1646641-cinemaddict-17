import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizeDate} from '../utils/date.js';

const createFilmPopupCommentsTemplate = ({comments}, commentsList, {emotion}) => {
  const emotionImage = emotion !== null
    ? `<img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">`
    : '';

  const createListOfComments = () => {
    const filmComments = comments.map((commentId) => {

      const userComment = commentsList.find((elem) => elem.id === commentId);
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

    return filmComments.join('');
  };

  return (
    `<div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">${createListOfComments()}</ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
            ${emotionImage}
          </div>

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
    </div>`
  );
};

export default class FilmPopupCommentsView extends AbstractStatefulView {
  #film = null;
  #comments = null;
  #localComment = null;

  constructor(film, comments, localComment) {
    super();
    this.#film = film;
    this.#comments = comments;
    this.#localComment = localComment;

    this._state = {...this.#localComment};

    this.#setInnerHandlers();
  }

  get template() {
    return createFilmPopupCommentsTemplate(this.#film, this.#comments, this._state);
  }

  resetState = () => {
    this.updateElement({
      ...this.#localComment
    });
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('click', this.#emotionClickHandler);
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentInputHandler);
  };

  #emotionClickHandler = ({target}) => {
    if (target.tagName === 'INPUT') {
      const commentValue = this.element.querySelector('.film-details__comment-input').value;

      this.updateElement({
        emotion: target.value,
      });

      this.element.querySelector(`#${target.id}`).checked = true;
      this.element.querySelector('.film-details__comment-input').value = commentValue;
    }
  };

  #commentInputHandler = ({target}) => {
    this._setState({
      comment: target.value,
    });
  };
}
