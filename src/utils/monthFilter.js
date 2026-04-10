export const monthFilter = (item, year, month) => {
  const startTotal = item.start_year * 12 + item.start_month;
  const endTotal = startTotal + item.duration_months - 1;
  const targetTotal = year * 12 + month;
  return startTotal <= targetTotal && endTotal >= targetTotal;
};
