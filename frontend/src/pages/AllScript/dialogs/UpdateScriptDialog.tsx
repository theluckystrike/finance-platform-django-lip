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
  onSubmit: (id: number, data: object) => void; // Assuming onSubmit takes an email string
  onClose: () => void;
  categories: Category[];
}

interface FormData {
  name: string;
  category: number | null; // Number - because we need to pass category id, also assuming that category can be null
}

export default function UpdateScriptDialog({
  isOpen,
  onSubmit,
  onClose,
  data,
  categories,
}: Props) {
  const [formData, setFormData] = useState<FormData>({name: data.name, category: data.category.id});

  const level2Categories = useMemo(
    () => categories.filter((cate: Category) => cate.level === 2),
    [categories],
  );

  const handleCategoryChange = (
    ev: React.SyntheticEvent,
    category: Category | null,
  ) => {
    if (category !== null) {
      setFormData({ ...formData, category: category.id ? category.id : null });
    }
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
          value={data.category}
          onChange={handleCategoryChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={!(formData.name || formData.category)}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
