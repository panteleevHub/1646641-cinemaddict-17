import {
  getRandomInteger,
  getRandomPositiveFloat,
  getRandomArrayElement,
  getRandomLengthArray,
} from '../utils/common.js';

import {nanoid} from 'nanoid';
import CommentsModel from '../model/comments-model.js';

const TotalRaiting = {
  MIN: 0,
  MAX: 10,
  FLOAT_NUMBER: 1,
};

const AgeRaiting = {
  MIN: 0,
  MAX: 18,
};

const RunTime = {
  MIN: 20,
  MAX: 180,
};

const titles = [
  'The Dance of Life',
  'The Man with the Golden Arm',
  'Santa Claus Conquers the Martians',
  'Laziness Who Sold Themselves',
];

const descriptions = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget. Aliquam id orci ut lectus varius viverra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
];

const posters = [
  'images/posters/made-for-each-other.png',
  'images/posters/the-dance-of-life.jpg',
  'images/posters/santa-claus-conquers-the-martians.jpg',
  'images/posters/sagebrush-trail.jpg',
  'images/posters/the-great-flamarion.jpg',
];

const directors = [
  'Tom Ford',
  'Anthony Mann',
  'David Lynch',
  'Clint Eastwood',
];

const writers = [
  'Takeshi Kitano',
  'Anne Wigton',
  'Heinz Herald',
  'Richard Weil',
];

const actors = [
  'Morgan Freeman',
  'Erich von Stroheim',
  'Mary Beth Hughes',
  'Dan Duryea',
  'Leonardo Dicaprio',
  'Meryl Streep',
];

const countries = [
  'Finland',
  'USA',
  'England',
];

const genres = [
  'Comedy',
  'Drama',
  'Film-Noir',
  'Mystery',
  'Adventure',
];

const dates = [
  '2019-05-11T00:00:00.000Z',
  '1976-01-01T13:00:00.000Z',
  '1980-08-12T10:50:35.000Z',
  '2000-12-31T18:33:05.000Z',
  '1930-03-08T00:07:34.000Z',
  '2019-05-11T16:12:32.554Z',
];

const commentsModel = new CommentsModel();
const comments = [...commentsModel.comments];

const getIdOfRandomComments = () => {
  const randomComments = comments.splice(0, getRandomInteger(0, comments.length - 1));
  const idOfRandomComments = randomComments.map((comment) => comment.id);

  return idOfRandomComments;
};

const generateFilmData = () => (
  {
    id: nanoid(),
    comments: getIdOfRandomComments(),
    filmInfo: {
      title: getRandomArrayElement(titles),
      originalTitle: getRandomArrayElement(titles),
      totalRating: getRandomPositiveFloat(TotalRaiting.MIN, TotalRaiting.MAX, TotalRaiting.FLOAT_NUMBER),
      poster: getRandomArrayElement(posters),
      ageRating:  getRandomInteger(AgeRaiting.MIN, AgeRaiting.MAX),
      director: getRandomArrayElement(directors),
      writers: getRandomLengthArray(writers),
      actors: getRandomLengthArray(actors),
      release: {
        date: getRandomArrayElement(dates),
        releaseCountry: getRandomArrayElement(countries),
      },
      runtime: getRandomInteger(RunTime.MIN, RunTime.MAX),
      genres: getRandomLengthArray(genres),
      description: getRandomArrayElement(descriptions)
    },
    userDetails: {
      isWatchlist: Boolean(getRandomInteger(0, 1)),
      isAlreadyWatched: Boolean(getRandomInteger(0, 1)),
      watchingDate: getRandomArrayElement(dates),
      isFavorite: Boolean(getRandomInteger(0, 1)),
    },
    localComment: {
      comment: null,
      emotion: null,
    },
  }
);

export {generateFilmData, commentsModel};
