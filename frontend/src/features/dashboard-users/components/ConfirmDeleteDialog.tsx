import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import type { User } from "../../../components/Login.tsx";

interface ConfirmDeleteDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  user,
  onClose,
  onConfirm,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Conferma Eliminazione</DialogTitle>
    <DialogContent>
      Sei sicuro di voler eliminare l’utente{" "}
      <strong>{user?.fullName}</strong>?
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Annulla</Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        Elimina
      </Button>
    </DialogActions>
  </Dialog>
);
