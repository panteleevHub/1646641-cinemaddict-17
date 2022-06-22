import ApiService from '../framework/api-service.js';
import {Method} from '../utils/const.js';

export default class FilmsApiServise extends ApiService {
  get films() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (film) => {
    const adaptedFilm = {
      ...film,
      'film_info': {
        ...film.filmInfo,
        'alternative_title': film.filmInfo.alternativeTitle,
        'total_rating': film.filmInfo.totalRating,
        'age_rating': film.filmInfo.ageRating,
        'release': {
          ...film.filmInfo.release,
          'release_country': film.filmInfo.release.releaseCountry,
        },
        'genre': film.filmInfo.genres,
      },
      'user_details': {
        'watchlist': film.userDetails.isWatchlist,
        'already_watched': film.userDetails.isAlreadyWatched,
        'watching_date': film.userDetails.watchingDate,
        'favorite': film.userDetails.isFavorite,
      },
    };

    delete adaptedFilm.filmInfo;
    delete adaptedFilm['film_info'].alternativeTitle;
    delete adaptedFilm['film_info'].totalRating;
    delete adaptedFilm['film_info'].ageRating;
    delete adaptedFilm['film_info'].release.releaseCountry;
    delete adaptedFilm['film_info'].genres;
    delete adaptedFilm.userDetails;
    delete adaptedFilm['user_details'].isWatchlist;
    delete adaptedFilm['user_details'].iAalreadyWatched;
    delete adaptedFilm['user_details'].watchingDate;
    delete adaptedFilm['user_details'].isFavorite;
    delete adaptedFilm.localComment;

    return adaptedFilm;
  };
}
