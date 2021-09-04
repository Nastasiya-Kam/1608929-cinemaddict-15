import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const getReleaseDate = (date) => dayjs(date).format('DD MMMM YYYY');
const getCommentDate = (date) => dayjs(date).fromNow();
const getCardDate = (date) => dayjs(date).format('YYYY');
const getDuration = (minutes) => `${Math.trunc(minutes/60)}h ${minutes - Math.trunc(minutes/60)*60}m`;

export {getReleaseDate, getCommentDate, getCardDate, getDuration};
