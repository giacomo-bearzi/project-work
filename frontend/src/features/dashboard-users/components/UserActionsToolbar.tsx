// components/UserActionsToolbar.tsx
import { TextField, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export const UserActionsToolbar = ({
  searchTerm,
  onSearchChange,
  onAddUser,
}: {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddUser: () => void;
}) => (
  <div className="flex justify-between mb-2 mt-2">
    <TextField
      label="Cerca utente"
      variant="outlined"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      size="small"
      sx={{ width: 300 }}
    />
    <Button variant="contained" onClick={onAddUser} startIcon={<AddIcon />}>
      Aggiungi Utente
    </Button>
  </div>
);
