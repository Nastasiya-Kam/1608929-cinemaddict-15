import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(relativeTime);
dayjs.extend(isToday);

const getFormattedReleaseDate = (date) => dayjs(date).format('DD MMMM YYYY');
const getFormattedCommentDate = (date) => dayjs(date).fromNow();
const getFormattedCardDate = (date) => dayjs(date).format('YYYY');

const isInDateRange = (date, range) => dayjs(date) >= dayjs().subtract(1, range);
const isDateToday = (date) => dayjs(date).isToday();

export {getFormattedReleaseDate, getFormattedCommentDate, getFormattedCardDate, isInDateRange, isDateToday};
