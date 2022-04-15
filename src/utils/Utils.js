export const parseTimeDMY = (datetime) => {
  const date = new Date(datetime);
  const formatedDate =
    date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  return formatedDate;
};
