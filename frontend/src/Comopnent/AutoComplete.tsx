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
  '&.MuiAutocomplete-paper': {
    maxHeight: '200px',
    overflowY: 'auto',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: '2px solid var(--very-dark-green)',
    },
    '&.Mui-focused fieldset': {
      boxShadow: '0 0 0 .25rem rgba(13,110,253,.25)',
      border: 'none',
    },
  },
};
