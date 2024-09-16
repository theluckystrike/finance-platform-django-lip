import React from 'react';


const DateFormatter = ({ isoString }) => {
  const formattedDate = new Date(isoString).toLocaleDateString();

  return (
<>

      {formattedDate}
</>
    )
  
};

export default DateFormatter