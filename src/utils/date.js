import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const NUMBER_OF_MINS_IN_HOUR = 60;

const convertReleaseYear = (date) => dayjs(date).format('YYYY');
const convertReleaseDate = (date) => dayjs(date).format('D MMMM YYYY');

const humanizeDate = (date) => {
  dayjs.extend(relativeTime);
  return dayjs(date).fromNow();
};

const convertMinsToHours = (mins) => {
  const hours = Math.trunc(mins / NUMBER_OF_MINS_IN_HOUR);
  const minutes = mins % NUMBER_OF_MINS_IN_HOUR;

  if (mins < NUMBER_OF_MINS_IN_HOUR) {
    return `${minutes}m`;
  }

  if (mins % NUMBER_OF_MINS_IN_HOUR === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
};

export {
  convertReleaseYear,
  convertReleaseDate,
  convertMinsToHours,
  humanizeDate,
};
