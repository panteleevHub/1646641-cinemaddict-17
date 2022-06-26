import {render, replace, remove} from '../framework/render.js';
import FilmView from '../view/film-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import {UserAction, UpdateType} from '../utils/const.js';
import {Mode} from '../utils/const.js';
import {isInPage} from '../utils/common.js';

export default class FilmPresenter {
  #filmComponent = null;
  #filmPopupComponent = null;
  #filmContainer = null;
  #film = null;
  #changeData = null;
  #changeMode = null;
  #commentsModel = null;

  #mode = Mode.DEFAULT;

  constructor(container, changeData, changeMode, commentsModel) {
    this.#filmContainer = container;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#commentsModel = commentsModel;
  }

  init = (film) => {
    const prevFilmComponent = this.#filmComponent;

    this.#film = film;
    this.#filmComponent = new FilmView(this.#film);

    this.#filmComponent.setFilmClickHandler(this.openFilmPopup);
    this.#filmComponent.setWatchlistButtonClickHandler(this.#watchlistButtonClickHandler);
    this.#filmComponent.setHistoryButtonClickHandler(this.#historyButtonClickHandler);
    this.#filmComponent.setFavoriteButtonClickHandler(this.#favoriteButtonClickHandler);

    if (prevFilmComponent === null) {
      return render(this.#filmComponent, this.#filmContainer);
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  };

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#filmPopupComponent);
  };

  resetView = () => {
    if (this.#mode === Mode.POPUP) {
      this.#closeFilmPopup();
    }
  };

  openFilmPopup = async () => {
    if (this.#filmPopupComponent !== null && isInPage(this.#filmPopupComponent.element)) {
      return;
    }

    await this.#commentsModel.getComments(this.#film);

    this.#filmPopupComponent = new FilmPopupView(
      this.#film,
      this.#commentsModel.comments,
    );

    this.#filmPopupComponent.setClosePopupClickHandler(this.#closeFilmPopup);
    this.#filmPopupComponent.setWatchlistButtonClickHandler(this.#watchlistButtonClickHandler);
    this.#filmPopupComponent.setHistoryButtonClickHandler(this.#historyButtonClickHandler);
    this.#filmPopupComponent.setFavoriteButtonClickHandler(this.#favoriteButtonClickHandler);
    this.#filmPopupComponent.setDeleteCommentClickHandler(this.#deleteCommentClickHandler);
    this.#filmPopupComponent.setFormSubmitHandler(this.#formSubmitHandler);

    this.#changeMode();
    this.#filmPopupComponent.openPopup();

    document.addEventListener('keydown', this.#escKeyDownHandler);

    this.#mode = Mode.POPUP;
  };

  setDeleting = (comment) => {
    this.#filmPopupComponent.updateElement({
      isDeleting: true,
      selectedComment: comment.id
    });
  };

  setFormDisable = () => {
    this.#filmPopupComponent.updateElement({
      isDisabled: true,
    });
  };

  setAborting = () => {
    if (this.#mode === Mode.POPUP) {
      const resetFormState = () => {
        this.#filmPopupComponent.updateElement({
          isDisabled: false,
          isDeleting: false,
        });
      };

      this.#filmPopupComponent.shake(resetFormState);
    }
  };

  #closeFilmPopup = () => {
    this.#filmPopupComponent.resetState(this.#film);

    this.#filmPopupComponent.closePopup();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closeFilmPopup();
    }
  };

  #watchlistButtonClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      this.#mode === Mode.POPUP ? UpdateType.UPDATE_POPUP : UpdateType.MINOR,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          isWatchlist: !this.#film.userDetails.isWatchlist,
        },
      }
    );
  };

  #historyButtonClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      this.#mode === Mode.POPUP ? UpdateType.UPDATE_POPUP : UpdateType.MINOR,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          isAlreadyWatched: !this.#film.userDetails.isAlreadyWatched,
        },
      },
    );
  };

  #favoriteButtonClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      this.#mode === Mode.POPUP ? UpdateType.UPDATE_POPUP : UpdateType.MINOR,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          isFavorite: !this.#film.userDetails.isFavorite,
        },
      },
    );
  };

  #deleteCommentClickHandler = (film, comment) => {
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.UPDATE_POPUP,
      film,
      comment
    );
  };

  #formSubmitHandler = (film, comment) => {
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.UPDATE_POPUP,
      film,
      comment
    );
  };
}
