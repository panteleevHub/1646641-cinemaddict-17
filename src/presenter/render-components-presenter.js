import SortView from '../view/sort-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import TopRatedFilmsView from '../view/top-rated-films-view.js';
import MostCommentedFilmsView from '../view/most-commented-films-view.js';
import EmptyFilmsListView from '../view/films-list-empty-view.js';
import {render, remove} from '../framework/render.js';
import FilmCardPresenter from './film-card-presenter.js';
import {updateItem} from '../utils/common.js';
import {
  SortType,
  sortFilmsByDate,
  sortFilmsByRating,
  sortFilmsByComments
} from '../utils/sort.js';

const FILMS_RANK_COUNT = 2;
const FILMS_COUNT_PER_STEP = 5;

export default class RenderComponentsPresenter {
  #mainContainer = null;
  #filmCardsModel = null;

  #emptyFilmsListComponent = new EmptyFilmsListView();
  #sortComponent = new SortView();
  #filmsContainerComponent = new FilmsContainerView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #filmsListComponent = new FilmsListView();
  #topRatedFilmsComponent = new TopRatedFilmsView();
  #topRatedFilmsListComponent = new FilmsListView();
  #mostCommentedFilmsComponent = new MostCommentedFilmsView();
  #mostCommentedFilmsListComponent = new FilmsListView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #filmCards = [];
  #topRatedFilms = [];
  #mostCommentedFilms = [];
  #renderedFilmsCount = FILMS_COUNT_PER_STEP;
  #filmsPresenters = new Map();
  #topRatedFilmsPresenters = new Map();
  #mostCommentedFilmsPresenters = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedFilmCards = [];

  constructor(mainContainer, filmCardsModel) {
    this.#mainContainer = mainContainer;
    this.#filmCardsModel = filmCardsModel;
  }

  init = () => {
    this.#filmCards = [...this.#filmCardsModel.filmCards];
    this.#sourcedFilmCards = [...this.#filmCardsModel.filmCards];
    this.#topRatedFilms = [...this.#filmCardsModel.filmCards];
    this.#mostCommentedFilms = [...this.#filmCardsModel.filmCards];
    this.#renderComponents();
  };

  #renderComponents = () => {
    if (this.#filmCards.length === 0) {
      return this.#renderEmptyFilmsList();
    }

    this.#renderSort();
    this.#renderFilmsContainer();
  };

  #renderFilmsContainer = () => {
    render(this.#filmsContainerComponent, this.#mainContainer);

    this.#renderFilmsListContainer();

    if (this.#topRatedFilms.some(({filmInfo}) => filmInfo.totalRating !== 0)) {
      this.#renderTopRatedFilms();
    }

    if (this.#topRatedFilms.some(({comments}) => comments.length > 0)) {
      this.#renderMostCommentedFilms();
    }
  };

  #renderEmptyFilmsList = () => {
    render(this.#emptyFilmsListComponent, this.#mainContainer);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#mainContainer);
    this.#sortComponent.setSortTypeClickHandler(this.#sortTypeClickHandler);
  };

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#filmCards.sort(sortFilmsByDate);
        break;
      case SortType.RATING:
        this.#filmCards.sort(sortFilmsByRating);
        break;
      default:
        this.#filmCards = [...this.#sourcedFilmCards];
    }

    this.#currentSortType = SortType;
  };

  #sortTypeClickHandler = (sortType) => {
    if (this.#currentSortType !== sortType) {
      this.#sortFilms(sortType);
      this.#clearFilmsCards();
      this.#renderFilmsList();
    }
  };

  #renderFilmsListContainer = () => {
    render(this.#filmsListContainerComponent, this.#filmsContainerComponent.element);
    this.#renderFilmsList();
  };

  #renderFilmsList = () => {
    render(this.#filmsListComponent, this.#filmsListContainerComponent.element);

    this.#renderFilmCards(0, Math.min(this.#filmCards.length, FILMS_COUNT_PER_STEP), this.#filmCards, this.#filmsListComponent.element);

    if (this.#filmCards.length > FILMS_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  };

  #renderFilmCard = (film, container) => {
    const filmCardPresenter = new FilmCardPresenter(container, this.#filmCardChangeHandler, this.#modeChangeHandler);
    filmCardPresenter.init(film);

    if (container === this.#topRatedFilmsListComponent.element) {
      return this.#topRatedFilmsPresenters.set(film.id, filmCardPresenter);
    }

    if (container === this.#mostCommentedFilmsListComponent.element) {
      return this.#mostCommentedFilmsPresenters.set(film.id, filmCardPresenter);
    }

    this.#filmsPresenters.set(film.id, filmCardPresenter);
  };

  #renderFilmCards = (from, to, films, container) => {
    films
      .slice(from, to)
      .forEach((film) => this.#renderFilmCard(film, container));
  };

  #renderTopRatedFilms = () => {
    render(this.#topRatedFilmsComponent, this.#filmsContainerComponent.element);
    render(this.#topRatedFilmsListComponent, this.#topRatedFilmsComponent.element);

    this.#topRatedFilms.sort(sortFilmsByRating);

    this.#renderFilmCards(0, FILMS_RANK_COUNT, this.#topRatedFilms, this.#topRatedFilmsListComponent.element);
  };

  #renderMostCommentedFilms = () => {
    render(this.#mostCommentedFilmsComponent, this.#filmsContainerComponent.element);
    render(this.#mostCommentedFilmsListComponent, this.#mostCommentedFilmsComponent.element);

    this.#mostCommentedFilms.sort(sortFilmsByComments);

    this.#renderFilmCards(0, FILMS_RANK_COUNT, this.#mostCommentedFilms, this.#mostCommentedFilmsListComponent.element);
  };

  #clearFilmsCards = () => {
    this.#filmsPresenters.forEach((presenter) => presenter.destroy());
    this.#filmsPresenters.clear();
    this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  };

  #filmCardChangeHandler = (updatedFilm) => {
    this.#filmCards = updateItem(this.#filmCards, updatedFilm);
    this.#filmsPresenters.get(updatedFilm.id).init(updatedFilm);
  };

  #modeChangeHandler = () => {
    this.#filmsPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#filmsListContainerComponent.element);

    this.#showMoreButtonComponent.setShowMoreButtonClickHandler(this.#showMoreButtonClickHandler);
  };

  #showMoreButtonClickHandler = () => {
    this.#renderFilmCards(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP, this.#filmCards, this.#filmsListComponent.element);

    this.#renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this.#filmCards.length <= this.#renderedFilmsCount) {
      remove(this.#showMoreButtonComponent);
    }
  };
}
