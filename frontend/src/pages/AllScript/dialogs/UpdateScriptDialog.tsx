import react, { useState, useMemo } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AutoComplete from '../../../Comopnent/AutoComplete';

import { Category } from '../../../Redux/CategoryQuery';

interface Props {
  isOpen: boolean;
  data: any;
  onSubmit: (data: {}) => void; // Assuming onSubmit takes an email string
  onClose: () => void;
  categories: Category[];
}

interface FormData {
  name: string;
  category: Category | null; // Assuming category can be null
}

export default function UpdateScriptDialog({
  isOpen,
  onSubmit,
  onClose,
  data,
  categories,
}: Props) {
  const [formData, setFormData] = useState<FormData>({
    ...data,
  });

  const level2Categories = useMemo(
    () => categories.filter((cate: Category) => cate.level === 2),
    [categories],
  );

  const handleCategoryChange = (
    ev: React.SyntheticEvent,
    category: Category | null,
  ) => {
    setFormData({ ...formData, category: category ? category : null });
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
          onSubmit(formData);
        },
      }}
    >
      <DialogTitle>Update Script</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          id="name"
          name="name"
          label="Name"
          fullWidth
          variant="standard"
          value={formData.name}
          onChange={(ev) => setFormData({ ...formData, name: ev.target.value })}
          sx={{ mb: 8 }} // Adjust the value as needed
        />
        <AutoComplete
          disablePortal
          options={level2Categories}
          getOptionLabel={(option: Category) => option.name}
          label="Update category"
          value={formData.category}
          onChange={handleCategoryChange}
        />
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
