export function removeDateTimeZone(date: Date): Date {
  const offset = date.getTimezoneOffset();
  const dateWithoutTimezone = new Date(date.getTime() - offset * 60 * 1000);
  return dateWithoutTimezone;
}
