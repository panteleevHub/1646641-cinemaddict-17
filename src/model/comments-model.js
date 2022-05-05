import {generateCommentData} from '../fish/comment.js';

const COMMENTS_COUNT = 1000;

export default class CommentsModel {
  #comments = Array.from({length: COMMENTS_COUNT}, generateCommentData);

  get comments() {
    return this.#comments;
  }
}
