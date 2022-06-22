import Observable from '../framework/observable.js';
import {UpdateType} from '../utils/const.js';

export default class FilmsModel extends Observable {
  #filmsApiService = null;
  #films = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get films() {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch (error) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  };

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#filmsApiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);

      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];

      this._notify(updateType, update);

    } catch (error) {
      throw new Error('Can\'t update film');
    }
  };

  #adaptToClient = (film) => {
    const adaptedFilm = {
      ...film,
      filmInfo: {
        ...film.film_info,
        alternativeTitle: film.film_info.alternative_title,
        totalRating: film.film_info.total_rating,
        ageRating: film.film_info.age_rating,
        release: {
          ...film.film_info.release,
          releaseCountry: film.film_info.release.release_country,
        },
        genres: film.film_info.genre,
      },
      userDetails: {
        isWatchlist: film.user_details.watchlist,
        isAlreadyWatched: film.user_details.already_watched,
        watchingDate: film.user_details.watching_date,
        isFavorite: film.user_details.favorite,
      },
      localComment: {
        comment: null,
        emotion: null,
      },
    };

    delete adaptedFilm.film_info;
    delete adaptedFilm.filmInfo.alternative_title;
    delete adaptedFilm.filmInfo.total_rating;
    delete adaptedFilm.filmInfo.age_rating;
    delete adaptedFilm.filmInfo.release.release_country;
    delete adaptedFilm.filmInfo.genre;
    delete adaptedFilm.user_details;
    delete adaptedFilm.userDetails.watchlist;
    delete adaptedFilm.userDetails.already_watched;
    delete adaptedFilm.userDetails.watching_date;
    delete adaptedFilm.userDetails.favorite;

    return adaptedFilm;
  };
}
