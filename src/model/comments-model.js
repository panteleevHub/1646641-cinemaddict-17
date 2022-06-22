import Observable from '../framework/observable.js';

export default class CommentsModel extends Observable {
  #commentsApiService = null;
  #comments = [];

  constructor(commentsApiService) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  get comments() {
    return this.#comments;
  }

  getComments = async (film) => {
    try {
      const comments = await this.#commentsApiService.getComments(film);
      this.#comments = [...comments];
    } catch (error) {
      this.#comments = [];
    }
  };

  addComment = async (updateType, comment, film) => {
    try {
      const response = await this.#commentsApiService.addComment(comment, film);
      const newComment = this.#adaptToClient(response);
      this.#comments = [newComment, ...this.#comments];
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#commentsApiService.deleteComment(update);

      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];

    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  };

  #adaptToClient = (comment) => {
    const adaptedComment = {...comment};

    delete adaptedComment.movie;
    delete adaptedComment.comments;
    return adaptedComment;
  };
}
