export const formatIsoDate = (isoString: string) => {
  // Format the date and time based on the locale
  const formattedDateTime = new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Use 24-hour format
  });

  return formattedDateTime;
};
