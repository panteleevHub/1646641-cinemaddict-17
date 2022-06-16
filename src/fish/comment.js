import {getRandomArrayElement} from '../utils/common.js';
import {nanoid} from 'nanoid';

const authors = [
  'Tim Macoveev',
  'John Doe',
  'Petr Petrov',
  'Jane Doe',
];

const comments = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
];

const dates = [
  '2022-05-03T08:03:00.000Z',
  '2022-05-02T00:00:00.000Z',
  '2020-01-01T13:00:00.000Z',
  '2021-08-12T10:50:35.000Z',
  '2022-05-03T08:05:05.000Z',
  '2022-05-03T08:07:34.000Z',
  '2022-05-03T08:12:32.554Z',
];

const emotions = ['smile', 'sleeping', 'puke', 'angry'];

const generateCommentData = () => (
  {
    id: nanoid(),
    author: getRandomArrayElement(authors),
    comment: getRandomArrayElement(comments),
    date: getRandomArrayElement(dates),
    emotion: getRandomArrayElement(emotions),
  }
);

export {generateCommentData};
