export default function dateRangeToParts(
  from: string,
  to: string,
  interval: number, // in hours
) {
  const year = new Set<number>();
  const month = new Set<number>();
  const day = new Set<number>();
  const hour = new Set<number>();

  const intervalInMilliseconds = interval * 3600 * 1000;
  const startDate = new Date(from);
  let endDate = new Date(to);

  while (endDate >= startDate) {
    year.add(endDate.getUTCFullYear());
    month.add(endDate.getUTCMonth() + 1);
    day.add(endDate.getUTCDate());
    hour.add(endDate.getUTCHours());

    const endDateMilliseconds = endDate.getTime();

    const newEndDateMilliseconds = endDateMilliseconds - intervalInMilliseconds;

    endDate = new Date(newEndDateMilliseconds);
  }

  return {
    year: Array.from(year),
    month: Array.from(month),
    day: Array.from(day),
    hour: Array.from(hour),
  };
}
