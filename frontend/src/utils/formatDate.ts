export const formatIsoDate = (isoString: string, timeZone: string = 'UTC') => {
  // Format the date and time based on the locale
  const formattedDateTime = new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Use 24-hour format
    timeZone,
  });

  return timeZone !== 'UTC'
    ? `${formattedDateTime} (${timeZone})`
    : formattedDateTime;
};
