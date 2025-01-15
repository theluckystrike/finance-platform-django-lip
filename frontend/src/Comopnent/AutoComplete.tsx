import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const AutoComplete = (props: any) => {
  const { label, defaultStyles, ...muiProps } = props;

  return (
    <Autocomplete
      {...muiProps}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          sx={defaultStyles ? {} : inputStyles}
        />
      )}
    />
  );
};

export default AutoComplete;

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
