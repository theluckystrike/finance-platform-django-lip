const DateFormatter = ({ isoString }) => {
  // Format the date and time based on the locale
  const date = new Date(isoString);
  
  // Array of abbreviated month names
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const month = monthNames[date.getMonth()]; // Get month as a 3-character string
  const day = date.getDate(); // Get day as a number
  const year = date.getFullYear(); // Get year as a number
  const hours = date.getHours(); // Get hours as a number
  const minutes = date.getMinutes(); // Get minutes as a number
  // const formattedDateTime = new Date(isoString).toLocaleString();

  return (
    <>
      {`${month} ${day} ${year}, ${hours}:${minutes < 10 ? "0" + minutes : minutes}`}
    </>
  );
};

export default DateFormatter;
