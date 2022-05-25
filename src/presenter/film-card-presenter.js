import {render, replace, remove} from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import FilmPopupControlsView from '../view/film-popup-controls-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import FilmPopupFormView from '../view/film-popup-form-view.js';
import CommentsModel from '../model/comments-model.js';
import FilmPopupInfoView from '../view/film-popup-info-view.js';
import FilmPopupCommentsView from '../view/film-popup-comments.js';

const Mode = {
  DEFAULT: 'default',
  POPUP: 'popup',
};

export default class FilmCardPresenter {
  #filmCardComponent = null;
  #filmPopupComponent = null;
  #filmPopupFormComponent = null;
  #filmPopupInfoComponent = null;
  #filmPopupCommentsComponent = null;
  #filmPopupControlsComponent = null;
  #filmCardContainer = null;
  #filmCard = null;
  #changeData = null;
  #changeMode = null;

  #mode = Mode.DEFAULT;

  #commentsModel = new CommentsModel();
  #comments = [...this.#commentsModel.comments];

  constructor(container, changeData, changeMode) {
    this.#filmCardContainer = container;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film) => {
    const prevFilmCardComponent = this.#filmCardComponent;
    const prevPopupControlsComponent = this.#filmPopupControlsComponent;

    this.#filmCard = film;
    this.#filmCardComponent = new FilmCardView(this.#filmCard);
    this.#filmPopupComponent = new FilmPopupView();
    this.#filmPopupFormComponent = new FilmPopupFormView();
    this.#filmPopupInfoComponent = new FilmPopupInfoView(this.#filmCard);
    this.#filmPopupControlsComponent = new FilmPopupControlsView(this.#filmCard);
    this.#filmPopupCommentsComponent = new FilmPopupCommentsView(this.#filmCard, this.#comments);

    this.#filmCardComponent.setFilmCardClickHandler(this.#openFilmPopup);
    this.#filmCardComponent.setWatchlistClickHandler(this.#onWatchlistButtonClick);
    this.#filmCardComponent.setHistoryClickHandler(this.#onHistoryButtonClick);
    this.#filmCardComponent.setFavoriteClickHandler(this.#onFavoriteButtonClick);

    this.#filmPopupControlsComponent.setWatchlistClickHandler(this.#onWatchlistButtonClick);
    this.#filmPopupControlsComponent.setHistoryClickHandler(this.#onHistoryButtonClick);
    this.#filmPopupControlsComponent.setFavoriteClickHandler(this.#onFavoriteButtonClick);

    this.#filmPopupInfoComponent.setPopupClickHandler(this.#closeFilmPopup);

    if (prevFilmCardComponent === null) {
      return render(this.#filmCardComponent, this.#filmCardContainer);
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    if (this.#mode === Mode.POPUP) {
      replace(this.#filmPopupControlsComponent, prevPopupControlsComponent);
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
    remove(prevPopupControlsComponent);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closeFilmPopup();
    }
  };

  #renderFilmPopupForm = ()  => {
    render(this.#filmPopupFormComponent, this.#filmPopupComponent.element);

    this.#renderFilmPopupInfo();
    this.#renderFilmPopupComments();
  };

  #renderFilmPopupInfo = () => {
    render(this.#filmPopupInfoComponent, this.#filmPopupFormComponent.element);

    this.#renderFilmPopupControls();
  };

  #renderFilmPopupControls = () => {
    render(this.#filmPopupControlsComponent, this.#filmPopupInfoComponent.element);
  };

  #renderFilmPopupComments = () => {
    render(this.#filmPopupCommentsComponent, this.#filmPopupFormComponent.element);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closeFilmPopup();
    }
  };

  #openFilmPopup = () => {
    this.#changeMode();
    this.#renderFilmPopupForm();
    this.#filmPopupComponent.openPopup();

    document.addEventListener('keydown', this.#onEscKeyDown);

    this.#mode = Mode.POPUP;
  };

  #closeFilmPopup = () => {
    this.#filmPopupComponent.closePopup();
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  };

  #onWatchlistButtonClick = () => {
    this.#changeData({
      ...this.#filmCard,
      userDetails: {
        isWatchlist: !this.#filmCard.userDetails.isWatchlist,
        isAlreadyWatched: this.#filmCard.userDetails.isAlreadyWatched,
        isFavorite: this.#filmCard.userDetails.isFavorite,
      }
    });
  };

  #onHistoryButtonClick = () => {
    this.#changeData({
      ...this.#filmCard,
      userDetails: {
        isWatchlist: this.#filmCard.userDetails.isWatchlist,
        isAlreadyWatched: !this.#filmCard.userDetails.isAlreadyWatched,
        isFavorite: this.#filmCard.userDetails.isFavorite,
      }
    });
  };

  #onFavoriteButtonClick = () => {
    this.#changeData({
      ...this.#filmCard,
      userDetails: {
        isWatchlist: this.#filmCard.userDetails.isWatchlist,
        isAlreadyWatched: this.#filmCard.userDetails.isAlreadyWatched,
        isFavorite: !this.#filmCard.userDetails.isFavorite,
      }
    });
  };
}
