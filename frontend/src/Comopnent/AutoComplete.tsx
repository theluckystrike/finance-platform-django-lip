import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const AutoComplete = (props: any) => {
  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        border: '2px solid var(--very-dark-green)',
      },
      '&:hover fieldset': {
        borderColor: 'blue', // Optional: Change color on hover
      },
      '&.Mui-focused fieldset': {
        borderColor: 'green', // Optional: Change color on focus
      },
    },
  };

  return (
    <Autocomplete
      {...props}
      renderInput={(params) => (
        <TextField {...params} label={props.label} sx={inputStyles} />
      )}
    />
  );
};

export default AutoComplete;
