import React from 'react';

const DateFormatter = ({ isoString }) => {
  // Format the date and time based on the locale
  const formattedDateTime = new Date(isoString).toLocaleString();

  return (
    <>
      {formattedDateTime}
    </>
  );
};

export default DateFormatter;
