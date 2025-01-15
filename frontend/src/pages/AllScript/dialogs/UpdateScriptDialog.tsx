import react, { useState, useMemo } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import AutoComplete from '../../../Comopnent/AutoComplete';
import { Category } from '../../../Redux/CategoryQuery';

interface Props {
  isOpen: boolean;
  data: any;
  onSubmit: (id: number, data: object) => void; // Assuming onSubmit takes an email string
  onClose: () => void;
  categories: Category[];
}

interface FormData {
  name: string;
  category: number | null; // Number - because we need to pass category id, also assuming that category can be null
  for_summary: boolean;
}

export default function UpdateScriptDialog({
  isOpen,
  onSubmit,
  onClose,
  data,
  categories,
}: Props) {
  const [formData, setFormData] = useState<FormData>({
    name: data.name,
    category: data.category?.id || null,
    for_summary: data.for_summary,
  });

  const level2Categories = useMemo(
    () => categories.filter((cate: Category) => cate.level === 2),
    [categories],
  );

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    data.category || null,
  );

  const handleCategoryChange = (
    ev: React.SyntheticEvent,
    category: Category | null,
  ) => {
    setFormData({ ...formData, category: category?.id || null });
    console.log(
      'selectedCateogry',
      level2Categories.find((cate) => cate.id === category?.id) || null,
    );
    setSelectedCategory(
      level2Categories.find((cate) => cate.id === category?.id) || null,
    );
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          onSubmit(data.id, formData);
        },
      }}
    >
      <DialogTitle>Update Script</DialogTitle>
      <DialogContent>
        <FormGroup>
          <FormControl>
            <FormLabel id="name-label">Name</FormLabel>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              fullWidth
              variant="standard"
              value={formData.name}
              onChange={(ev) =>
                setFormData({ ...formData, name: ev.target.value })
              }
              sx={{ mb: 4 }} // Adjust the value as needed
            />
          </FormControl>
          <FormControl>
            <FormLabel id="category-label" sx={{ mb: 1 }}>
              Category
            </FormLabel>
            <AutoComplete
              disablePortal
              options={level2Categories}
              getOptionLabel={(option: Category) => option.name}
              value={selectedCategory}
              onChange={handleCategoryChange}
              sx={{ mb: 4 }} // Adjust the value as needed
              defaultStyles
            />
          </FormControl>
          <FormControl>
            <FormLabel id="for-summary-label">For Summary</FormLabel>
            <RadioGroup
              row
              aria-labelledby="for-summary-label"
              value={formData.for_summary} // Bind the value to Formik
              onChange={(ev, v) =>
                setFormData({ ...formData, for_summary: v !== 'false' })
              }
              name="radio-buttons-group"
            >
              <FormControlLabel value={false} control={<Radio />} label="No" />
              <FormControlLabel value={true} control={<Radio />} label="Yes" />
            </RadioGroup>
          </FormControl>
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={!(formData.name && formData.category)}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
