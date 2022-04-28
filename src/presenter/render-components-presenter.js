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

const FILMS_COUNT = 5;
const FILMS_RANK_COUNT = 2;

const body = document.body;

export default class RenderComponentsPresenter {
  filmsContainer = new FilmsContainerView();
  filmsList = new FilmsListView();
  filmsListContainer = new FilmsListContainerView();
  topRatedFilms = new TopRatedFilmsView();
  topRatedFilmsList = new FilmsListContainerView();
  mostCommentedFilms = new MostCommentedFilmsView();
  mostCommentedFilmsList = new FilmsListContainerView();

  init = (mainContainer) => {
    this.mainContainer = mainContainer;

    render(new SortView(), this.mainContainer);
    render(this.filmsContainer, this.mainContainer);
    render(this.filmsList, this.filmsContainer.getElement());
    render(this.filmsListContainer, this.filmsList.getElement());

    for (let i = 0; i < FILMS_COUNT; i++) {
      render(new FilmCardView(), this.filmsListContainer.getElement());
    }

    render(new ShowMoreButtonView, this.filmsList.getElement());

    render(this.topRatedFilms, this.filmsContainer.getElement());
    render(this.topRatedFilmsList, this.topRatedFilms.getElement());
    render(this.mostCommentedFilms, this.filmsContainer.getElement());
    render(this.mostCommentedFilmsList, this.mostCommentedFilms.getElement());

    for (let i = 0; i < FILMS_RANK_COUNT; i++) {
      render(new FilmCardView(), this.topRatedFilmsList.getElement());
      render(new FilmCardView(), this.mostCommentedFilmsList.getElement());
    }

    render(new FilmPopupView(), body);
  };
}

