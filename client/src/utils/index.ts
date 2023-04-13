import dayjs from 'dayjs';

export const formattedDate = <T extends string>(date: T) => {
  return dayjs(date).format('YYYY-MM-DD').toString();
};

export const postTitleEllipsis = (title: string) => {
  return title.length > 30
    ? title.substring(0, 30).concat(' ...' + '더보기')
    : title;
};

export const postDescEllipsis = (title: string) => {
  return title.length > 30
    ? title.substring(0, 50).concat(' ...' + '더보기')
    : title;
};
