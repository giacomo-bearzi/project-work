import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  newUser: {
    fullName: string;
    username: string;
    password: string;
    role: string;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => void;
}

export const AddUserDialog: React.FC<AddUserDialogProps> = ({
  open,
  onClose,
  onSave,
  newUser,
  onChange,
}) => (
  <Dialog open={open} onClose={onClose} fullWidth>
    <DialogTitle>Nuovo Utente</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        name="fullName"
        label="Nome"
        fullWidth
        value={newUser.fullName}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        name="username"
        label="Username"
        fullWidth
        value={newUser.username}
        onChange={onChange}
        autoComplete="off"
      />
      <TextField
        margin="dense"
        name="password"
        label="Password"
        type="password"
        fullWidth
        value={newUser.password}
        onChange={onChange}
        autoComplete="new-password"
      />
      <Select
        name="role"
        value={newUser.role}
        onChange={(e: SelectChangeEvent) => onChange(e)}
        fullWidth
        sx={{ mt: 2 }}
      >
        <MenuItem value="admin">admin</MenuItem>
        <MenuItem value="manager">manager</MenuItem>
        <MenuItem value="operator">operator</MenuItem>
      </Select>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Annulla</Button>
      <Button variant="contained" onClick={onSave}>
        Salva
      </Button>
    </DialogActions>
  </Dialog>
);
