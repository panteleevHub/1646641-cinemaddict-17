import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import SortView from '../view/sort-view.js';
import UserRankView from '../view/user-rank-view.js';
import StatisticsView from '../view/statistics-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import EmptyFilmsListView from '../view/empty-films-list-view.js';
import LoadingView from '../view/loading-view.js';
import {render, remove} from '../framework/render.js';
import FilmPresenter from './film-presenter.js';
import {
  SortType,
  sortFilmsByDate,
  sortFilmsByRating,
} from '../utils/sort.js';
import {UserAction, UpdateType, FilterType} from '../utils/const.js';
import {filter} from '../utils/filter.js';

const FILMS_COUNT_PER_STEP = 5;

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class BoardPresenter {
  #userRankContainer = null;
  #mainContainer = null;
  #statisticsContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;
  #filterPresenter = null;
  #filterType = null;
  #prevPresenter = null;

  #filmsContainerComponent = new FilmsContainerView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #filmsListComponent = new FilmsListView();
  #loadingComponent = new LoadingView();
  #userRankComponent = null;
  #showMoreButtonComponent = null;
  #sortComponent = null;
  #emptyFilmsListComponent = null;

  #renderedFilmsCount = FILMS_COUNT_PER_STEP;
  #filmsPresenters = new Map();
  #currentSortType = SortType.DEFAULT;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(
    mainContainer,
    filmsModel,
    commentsModel,
    filterModel,
    statisticsContainer,
    userRankContainer,
    filterPresenter,
  ) {

    this.#userRankContainer = userRankContainer;
    this.#mainContainer = mainContainer;
    this.#statisticsContainer = statisticsContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
    this.#filterPresenter = filterPresenter;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = this.#filterType === FilterType.ALL ? films : filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmsByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmsByRating);
    }

    return filteredFilms;
  }

  init = () => {
    this.#renderBoard();
  };

  #renderUserRank = () => {
    this.#userRankComponent = new UserRankView(this.#filterPresenter.filters);
    render(this.#userRankComponent, this.#userRankContainer);
  };

  #renderStatistics = () => {
    render(new StatisticsView(this.films), this.#statisticsContainer);
  };

  #renderBoard = () => {
    if (this.#isLoading) {
      return this.#renderLoading();
    }

    if (this.films.length === 0) {
      return this.#renderEmptyFilmsList();
    }

    this.#renderUserRank();
    this.#renderSort();
    this.#renderFilmsContainer();
  };

  #clearBoard = ({resetRenderedFilmsCount = false, resetSortType = false} = {}) => {
    const filmsCount = this.films.length;

    this.#filmsPresenters.forEach((presenter) => presenter.destroy());
    this.#filmsPresenters.clear();

    remove(this.#userRankComponent);
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

  #handleViewAction = async (actionType, updateType, film, comment) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        try {
          await this.#filmsModel.updateFilm(updateType, film);
        } catch (error) {
          this.#filmsPresenters.get(film.id).setAborting();
        }
        break;
      case UserAction.ADD_COMMENT:
        this.#uiBlocker.block();
        this.#filmsPresenters.get(film.id).setFormDisable();
        try {
          await this.#commentsModel.addComment(updateType, comment, film);
          await this.#filmsModel.updateFilm(updateType, film);
        } catch (error) {
          this.#filmsPresenters.get(film.id).setAborting();
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmsPresenters.get(film.id).setDeleting();
        try {
          await this.#commentsModel.deleteComment(updateType, comment);
          await this.#filmsModel.updateFilm(updateType, film);
        } catch (error) {
          this.#filmsPresenters.get(film.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = async (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmsPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.UPDATE_POPUP:
        this.#prevPresenter = this.#filmsPresenters.get(data.id);
        this.#clearBoard();
        this.#renderBoard();
        if (this.#filmsPresenters.has(data.id)) {
          await this.#filmsPresenters.get(data.id).openFilmPopup();
        } else {
          this.#filmsPresenters.set(data.id, this.#prevPresenter);
          this.#filmsPresenters.get(data.id).init(data);
          await this.#prevPresenter.openFilmPopup();
        }
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedFilmsCount: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        this.#renderStatistics();
        break;
    }
  };

  #renderFilmsContainer = () => {
    render(this.#filmsContainerComponent, this.#mainContainer);
    render(this.#filmsListContainerComponent, this.#filmsContainerComponent.element);
    this.#renderFilmsList();
  };

  #renderEmptyFilmsList = () => {
    this.#emptyFilmsListComponent = new EmptyFilmsListView(this.#filterType);
    render(this.#emptyFilmsListComponent, this.#mainContainer);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#mainContainer);
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

    this.#renderFilms(films);

    if (filmsCount >  this.#renderedFilmsCount) {
      this.#renderShowMoreButton();
    }
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(
      this.#filmsListComponent.element,
      this.#handleViewAction,
      this.#modeChangeHandler,
      this.#commentsModel,
    );

    filmPresenter.init(film);

    this.#filmsPresenters.set(film.id, filmPresenter);
  };

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(film));
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
