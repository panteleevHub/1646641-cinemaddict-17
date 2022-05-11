import SortView from '../view/sort-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import TopRatedFilmsView from '../view/top-rated-films-view.js';
import MostCommentedFilmsView from '../view/most-commented-films-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import EmptyFilmsListView from '../view/films-list-empty-view.js';
import {render, remove} from '../framework/render.js';

const FILMS_RANK_COUNT = 2;
const FILMS_COUNT_PER_STEP = 5;

export default class RenderComponentsPresenter {
  #mainContainer = null;
  #filmCardsModel = null;

  #filmsContainerComponent = new FilmsContainerView();
  #filmsListComponent = new FilmsListView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #topRatedFilmsComponent = new TopRatedFilmsView();
  #topRatedFilmsListComponent = new FilmsListContainerView();
  #mostCommentedFilmsComponent = new MostCommentedFilmsView();
  #mostCommentedFilmsListComponent = new FilmsListContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #filmCards = [];
  #renderedFilmsCount = FILMS_COUNT_PER_STEP;

  constructor(mainContainer, filmCardsModel) {
    this.#mainContainer = mainContainer;
    this.#filmCardsModel = filmCardsModel;
  }

  init = () => {
    this.#filmCards = [...this.#filmCardsModel.filmCards];
    this.#renderComponents();
  };

  #renderComponents = () => {
    if (this.#filmCards.length === 0) {
      return render(new EmptyFilmsListView(), this.#mainContainer);
    }

    render(new SortView(), this.#mainContainer);
    render(this.#filmsContainerComponent, this.#mainContainer);
    render(this.#filmsListComponent, this.#filmsContainerComponent.element);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    for (let i = 0; i < Math.min(this.#filmCards.length, FILMS_COUNT_PER_STEP); i++) {
      this.#renderFilmCard(this.#filmCards[i]);
    }

    if (this.#filmCards.length > FILMS_COUNT_PER_STEP) {
      render(this.#showMoreButtonComponent, this.#filmsListComponent.element);

      this.#showMoreButtonComponent.setClickHandler(this.#onShowMoreButtonClick);
    }

    render(this.#topRatedFilmsComponent, this.#filmsContainerComponent.element);
    render(this.#topRatedFilmsListComponent, this.#topRatedFilmsComponent.element);
    render(this.#mostCommentedFilmsComponent, this.#filmsContainerComponent.element);
    render(this.#mostCommentedFilmsListComponent, this.#mostCommentedFilmsComponent.element);

    for (let i = 0; i < FILMS_RANK_COUNT; i++) {
      render(new FilmCardView(this.#filmCards[i]), this.#topRatedFilmsListComponent.element);
      render(new FilmCardView(this.#filmCards[i]), this.#mostCommentedFilmsListComponent.element);
    }
  };

  #onShowMoreButtonClick = () => {
    this.#filmCards
      .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilmCard(film));

    this.#renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this.#filmCards.length <= this.#renderedFilmsCount) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #renderFilmCard = (film) => {
    const filmCardComponent = new FilmCardView(film);
    const filmPopupComponent = new FilmPopupView(film);

    filmCardComponent.setClickHandler( () => {
      filmPopupComponent.openFilmPopup();
      document.addEventListener('keydown', this.#onEscKeyDown);
    });

    filmPopupComponent.setClickHandler( () => {
      filmPopupComponent.closeFilmPopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    });

    render(filmCardComponent, this.#filmsListContainerComponent.element);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();

      const filmPopupComponent = new FilmPopupView();
      filmPopupComponent.closeFilmPopup();

      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };
}

