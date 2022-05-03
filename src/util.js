import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomPositiveFloat = (a, b, digits = 1) => {
  const minNum = Math.min(Math.abs(a), Math.abs(b));
  const maxNum = Math.max(Math.abs(a), Math.abs(b));
  const result = Math.random() * (maxNum - minNum) + minNum;

  return Number(result.toFixed(digits));
};

const getRandomArrayElement = (array) => array[getRandomInteger(0, array.length - 1)];

const shuffleArray = (array) => {
  const copiedArray = array.slice();

  for (let i = copiedArray.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const temp = copiedArray[i];
    copiedArray[i] = copiedArray[randomIndex];
    copiedArray[randomIndex] = temp;
  }

  return copiedArray;
};

const getRandomLengthArray = (array) => {
  const randomElementIndex = getRandomInteger(1, array.length - 1);
  const shuffledArray = shuffleArray(array);
  return shuffledArray.slice(0, randomElementIndex);
};

const convertReleaseYear = (date) => dayjs(date).format('YYYY');
const convertReleaseDate = (date) => dayjs(date).format('D MMMM YYYY');

const humanizeDate = (date) => {
  dayjs.extend(relativeTime);
  return dayjs(date).fromNow();
};

const convertMinsToHours = (mins) => {
  const hours = Math.trunc(mins / 60);
  const minutes = mins % 60;

  if (mins < 60) {
    return `${minutes}m`;
  }

  if (mins % 60 === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
};

export {
  getRandomInteger,
  getRandomPositiveFloat,
  getRandomLengthArray,
  getRandomArrayElement,
  convertReleaseYear,
  convertReleaseDate,
  convertMinsToHours,
  humanizeDate,
};
