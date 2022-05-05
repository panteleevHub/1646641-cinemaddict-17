import SortView from '../view/sort-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import TopRatedFilmsView from '../view/top-rated-films-view.js';
import MostCommentedFilmsView from '../view/most-commented-films-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import {render} from '../render.js';

const FILMS_RANK_COUNT = 2;

const body = document.body;

export default class RenderComponentsPresenter {
  #mainContainer = null;
  #filmCardsModel = null;
  #filmCards = [];

  #filmsContainer = new FilmsContainerView();
  #filmsList = new FilmsListView();
  #filmsListContainer = new FilmsListContainerView();
  #topRatedFilms = new TopRatedFilmsView();
  #topRatedFilmsList = new FilmsListContainerView();
  #mostCommentedFilms = new MostCommentedFilmsView();
  #mostCommentedFilmsList = new FilmsListContainerView();

  init = (mainContainer, filmCardsModel) => {
    this.#mainContainer = mainContainer;
    this.#filmCardsModel = filmCardsModel;
    this.#filmCards = [...this.#filmCardsModel.filmCards];

    render(new SortView(), this.#mainContainer);
    render(this.#filmsContainer, this.#mainContainer);
    render(this.#filmsList, this.#filmsContainer.element);
    render(this.#filmsListContainer, this.#filmsList.element);

    for (let i = 0; i < this.#filmCards.length; i++) {
      this.#renderFilmCard(this.#filmCards[i]);
    }

    render(new ShowMoreButtonView, this.#filmsList.element);

    render(this.#topRatedFilms, this.#filmsContainer.element);
    render(this.#topRatedFilmsList, this.#topRatedFilms.element);
    render(this.#mostCommentedFilms, this.#filmsContainer.element);
    render(this.#mostCommentedFilmsList, this.#mostCommentedFilms.element);

    for (let i = 0; i < FILMS_RANK_COUNT; i++) {
      render(new FilmCardView(this.#filmCards[i]), this.#topRatedFilmsList.element);
      render(new FilmCardView(this.#filmCards[i]), this.#mostCommentedFilmsList.element);
    }
  };

  #renderFilmCard = (film) => {
    const filmCardComponent = new FilmCardView(film);
    const filmPopupComponent = new FilmPopupView(film);

    const filmCardLinkElement = filmCardComponent.element.querySelector('.film-card__link');
    const closeFilmPopupElement = filmPopupComponent.element.querySelector('.film-details__close-btn');

    const openFilmPopup = () => {
      body.classList.add('hide-overflow');
      body.appendChild(filmPopupComponent.element);
    };

    const closeFilmPopup = () => {
      body.classList.remove('hide-overflow');
      body.removeChild(filmPopupComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        closeFilmPopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    filmCardLinkElement.addEventListener('click', () => {
      openFilmPopup();
      document.addEventListener('keydown', onEscKeyDown);
    });

    closeFilmPopupElement.addEventListener('click', () => {
      closeFilmPopup();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(filmCardComponent, this.#filmsListContainer.element);
  };
}

