import dayjs from 'dayjs';

export const formattedDate = <T extends string>(date: T) => {
  return dayjs(date).format('YYYY-MM-DD').toString();
};
