import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

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
  convertReleaseYear,
  convertReleaseDate,
  convertMinsToHours,
  humanizeDate,
};
