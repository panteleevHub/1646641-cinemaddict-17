import {generateCommentData} from '../fish/comment.js';

const COMMENTS_COUNT = 100;

export default class CommentsModel {
  comments = Array.from({length: COMMENTS_COUNT}, generateCommentData);

  getComments = () => this.comments;
}
