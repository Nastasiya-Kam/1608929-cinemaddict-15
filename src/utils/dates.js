import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const getFormattedReleaseDate = (date) => dayjs(date).format('DD MMMM YYYY');
const getFormattedCommentDate = (date) => dayjs(date).fromNow();
const getFormattedCardDate = (date) => dayjs(date).format('YYYY');

export {getFormattedReleaseDate, getFormattedCommentDate, getFormattedCardDate};
