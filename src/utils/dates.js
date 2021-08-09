import dayjs from 'dayjs';

const getReleaseDate = (date) => dayjs(date).format('DD MMMM YYYY');
const getCommentDate = (date) => dayjs(date).format('YYYY/M/DD HH:mm');
const getCardDate = (date) => dayjs(date).format('YYYY');

export {getReleaseDate, getCommentDate, getCardDate};
