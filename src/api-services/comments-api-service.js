import ApiService from '../framework/api-service';
import {Method} from '../utils/const.js';

export default class CommentsApiService extends ApiService {
  getComments = (film) => this._load({url: `comments/${film.id}`}).then(ApiService.parseResponse);

  addComment = async (comment, film) => {
    const response = await this._load({
      url: `comments/${film.id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  deleteComment = async (comment) => {
    const response = await this._load({
      url: `comments/${comment.id}`,
      method: Method.DELETE,
    });

    return response;
  };
}
