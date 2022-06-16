import SortView from '../view/sort-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import TopRatedFilmsView from '../view/top-rated-films-view.js';
import MostCommentedFilmsView from '../view/most-commented-films-view.js';
import EmptyFilmsListView from '../view/films-list-empty-view.js';
import {render, remove} from '../framework/render.js';
import FilmPresenter from './film-presenter.js';
import {
  SortType,
  sortFilmsByDate,
  sortFilmsByRating,
  sortFilmsByComments
} from '../utils/sort.js';
import {UserAction, UpdateType} from '../utils/const.js';

const FILMS_RANK_COUNT = 2;
const FILMS_COUNT_PER_STEP = 5;

export default class BoardPresenter {
  #mainContainer = null;
  #filmsModel = null;
  #commentsModel = null;

  #emptyFilmsListComponent = new EmptyFilmsListView();
  #filmsContainerComponent = new FilmsContainerView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #filmsListComponent = new FilmsListView();
  #topRatedFilmsComponent = new TopRatedFilmsView();
  #topRatedFilmsListComponent = new FilmsListView();
  #mostCommentedFilmsComponent = new MostCommentedFilmsView();
  #mostCommentedFilmsListComponent = new FilmsListView();
  #showMoreButtonComponent = null;
  #sortComponent = null;

  #renderedFilmsCount = FILMS_COUNT_PER_STEP;
  #filmsPresenters = new Map();
  #topRatedFilmsPresenters = new Map();
  #mostCommentedFilmsPresenters = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor(mainContainer, filmsModel, commentsModel) {
    this.#mainContainer = mainContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...this.#filmsModel.films].sort(sortFilmsByDate);
      case SortType.RATING:
        return [...this.#filmsModel.films].sort(sortFilmsByRating);
    }

    return this.#filmsModel.films;
  }

  init = () => {
    this.#renderBoard();
  };

  #renderBoard = () => {
    if (this.films.length === 0) {
      return this.#renderEmptyFilmsList();
    }

    this.#renderSort();
    this.#renderFilmsContainer();
  };

  #clearBoard = ({resetRenderedFilmsCount = false, resetSortType = false} = {}) => {
    const filmsCount = this.films.length;

    this.#filmsPresenters.forEach((presenter) => presenter.destroy());
    this.#filmsPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#emptyFilmsListComponent);
    remove(this.#showMoreButtonComponent);

    if (resetRenderedFilmsCount) {
      this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
    } else {
      this.#renderedFilmsCount = Math.min(filmsCount, this.#renderedFilmsCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderFilmsContainer = () => {
    render(this.#filmsContainerComponent, this.#mainContainer);
    render(this.#filmsListContainerComponent, this.#filmsContainerComponent.element);
    this.#renderFilmsList();

    /*if (this.films.some(({filmInfo}) => filmInfo.totalRating !== 0)) {
      this.#renderTopRatedFilms();
    }

    if (this.films.some(({comments}) => comments.length > 0)) {
      this.#renderMostCommentedFilms();
    }*/
  };

  #renderEmptyFilmsList = () => {
    render(this.#emptyFilmsListComponent, this.#mainContainer);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeClickHandler(this.#sortTypeClickHandler);

    render(this.#sortComponent, this.#mainContainer);
  };

  #sortTypeClickHandler = (sortType) => {
    if (this.#currentSortType !== sortType) {
      this.#currentSortType = sortType;
      this.#clearBoard({resetRenderedFilmsCount: true});
      this.#renderBoard();
    }
  };

  #renderFilmsList = () => {
    const filmsCount = this.films.length;
    const films = this.films.slice(0, Math.min(filmsCount, this.#renderedFilmsCount));

    render(this.#filmsListComponent, this.#filmsListContainerComponent.element);

    this.#renderFilms(films, this.#filmsListComponent.element);

    if (filmsCount >  this.#renderedFilmsCount) {
      this.#renderShowMoreButton();
    }
  };

  #renderFilm = (film, container) => {
    const filmPresenter = new FilmPresenter(
      container,
      this.#handleViewAction,
      this.#modeChangeHandler,
    );

    filmPresenter.init(film, this.#currentFilmComments(film));

    if (container === this.#topRatedFilmsListComponent.element) {
      return this.#topRatedFilmsPresenters.set(film.id, filmPresenter);
    }

    if (container === this.#mostCommentedFilmsListComponent.element) {
      return this.#mostCommentedFilmsPresenters.set(film.id, filmPresenter);
    }

    this.#filmsPresenters.set(film.id, filmPresenter);
  };

  #renderFilms = (films, container) => {
    films.forEach((film) => this.#renderFilm(film, container));
  };

  #renderTopRatedFilms = () => {
    render(this.#topRatedFilmsComponent, this.#filmsContainerComponent.element);
    render(this.#topRatedFilmsListComponent, this.#topRatedFilmsComponent.element);

    const topRatedFilms = [...this.films]
      .sort(sortFilmsByRating)
      .slice(0, Math.min(this.films.length, FILMS_RANK_COUNT));

    this.#renderFilms(topRatedFilms, this.#topRatedFilmsListComponent.element);
  };

  #renderMostCommentedFilms = () => {
    render(this.#mostCommentedFilmsComponent, this.#filmsContainerComponent.element);
    render(this.#mostCommentedFilmsListComponent, this.#mostCommentedFilmsComponent.element);

    const mostCommentedFilms = [...this.films]
      .sort(sortFilmsByComments)
      .slice(0, Math.min(this.films.length, FILMS_RANK_COUNT));

    this.#renderFilms(mostCommentedFilms, this.#mostCommentedFilmsListComponent.element);
  };

  #currentFilmComments = (film) => {
    const filmComments = film.comments.map((commentId) => (
      this.#commentsModel.comments.find((comment) => commentId === comment.id)
    ));

    return filmComments;
  };

  #handleViewAction = (actionType, updateType, film, comment) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, film);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, comment);
        this.#filmsModel.updateFilm(updateType, film);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, comment);
        this.#filmsModel.updateFilm(updateType, film);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmsPresenters.get(data.id).init(data, this.#currentFilmComments(data));
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedFilmsCount: true, resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #modeChangeHandler = () => {
    this.#filmsPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setShowMoreButtonClickHandler(this.#showMoreButtonClickHandler);

    render(this.#showMoreButtonComponent, this.#filmsListContainerComponent.element);
  };

  #showMoreButtonClickHandler = () => {
    const filmsCount = this.films.length;
    const newRenderedFilmsCount = Math.min(filmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmsCount, newRenderedFilmsCount);

    this.#renderFilms(films, this.#filmsListComponent.element);
    this.#renderedFilmsCount = newRenderedFilmsCount;

    if (this.#renderedFilmsCount >= filmsCount) {
      remove(this.#showMoreButtonComponent);
    }
  };
}
