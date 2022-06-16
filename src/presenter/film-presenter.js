import {render, replace, remove} from '../framework/render.js';
import FilmView from '../view/film-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import {UserAction, UpdateType} from '../utils/const.js';
import {Mode} from '../utils/const.js';

export default class FilmPresenter {
  #filmComponent = null;
  #filmPopupComponent = null;
  #filmContainer = null;
  #film = null;
  #changeData = null;
  #changeMode = null;
  #comments = null;

  #mode = Mode.DEFAULT;

  constructor(container, changeData, changeMode) {
    this.#filmContainer = container;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film, comments) => {
    const prevFilmComponent = this.#filmComponent;
    const prevPopupComponent = this.#filmPopupComponent;

    this.#film = film;
    this.#comments = comments;

    this.#filmComponent = new FilmView(this.#film);
    this.#filmPopupComponent = new FilmPopupView(
      this.#film,
      this.#comments,
    );

    this.#filmComponent.setFilmClickHandler(this.#openFilmPopup);
    this.#filmComponent.setWatchlistButtonClickHandler(this.#watchlistButtonClickHandler);
    this.#filmComponent.setHistoryButtonClickHandler(this.#historyButtonClickHandler);
    this.#filmComponent.setFavoriteButtonClickHandler(this.#favoriteButtonClickHandler);

    this.#filmPopupComponent.setClosePopupClickHandler(this.#closeFilmPopup);
    this.#filmPopupComponent.setWatchlistButtonClickHandler(this.#watchlistButtonClickHandler);
    this.#filmPopupComponent.setHistoryButtonClickHandler(this.#historyButtonClickHandler);
    this.#filmPopupComponent.setFavoriteButtonClickHandler(this.#favoriteButtonClickHandler);
    this.#filmPopupComponent.setDeleteCommentClickHandler(this.#deleteCommentClickHandler);
    this.#filmPopupComponent.setFormSubmitHandler(this.#formSubmitHandler);

    if (prevFilmComponent === null) {
      return render(this.#filmComponent, this.#filmContainer);
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (this.#mode === Mode.POPUP) {
      replace(this.#filmComponent, prevFilmComponent);
      replace(this.#filmPopupComponent, prevPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  };

  destroy = () => {
    remove(this.#filmComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closeFilmPopup();
    }
  };

  #openFilmPopup = () => {
    this.#changeMode();
    this.#filmPopupComponent.openPopup();

    document.addEventListener('keydown', this.#escKeyDownHandler);

    this.#mode = Mode.POPUP;
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
      UpdateType.PATCH,
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
      UpdateType.PATCH,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          isAlreadyWatched: !this.#film.userDetails.isAlreadyWatched,
        },
      }
    );
  };

  #favoriteButtonClickHandler = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {
        ...this.#film,
        userDetails: {
          ...this.#film.userDetails,
          isFavorite: !this.#film.userDetails.isFavorite,
        },
      }
    );
  };

  #deleteCommentClickHandler = (film, comment) => {
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      film,
      comment
    );
  };

  #formSubmitHandler = (film, comment) => {
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      film,
      comment
    );
  };
}
