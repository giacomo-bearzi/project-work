import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Paper,
  Button,
  type SelectChangeEvent,
} from '@mui/material';
import {
  Delete,
  Edit as EditIcon,
  Save as SaveIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import type { ApiGetUser } from '../../users/types/usersTypes';

interface UsersTableProps {
  users: ApiGetUser[];
  selectedUser: ApiGetUser | null;
  editingUserId: string | null;
  editedUser: Partial<ApiGetUser>;
  searchTerm: string;
  onEditChange: (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<{ name?: string; value: unknown }>
  ) => void;
  onStartEditing: (user: ApiGetUser) => void;
  onCancelEditing: () => void;
  onSaveEdit: () => void;
  onSelectUser: (user: ApiGetUser) => void;
  onDeleteClick: (user: ApiGetUser) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  selectedUser,
  editingUserId,
  editedUser,
  searchTerm,
  onEditChange,
  onStartEditing,
  onCancelEditing,
  onSaveEdit,
  onSelectUser,
  onDeleteClick,
}) => {
  const filteredUsers = users.filter((u: ApiGetUser) => {    
    const term = searchTerm.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(term) ||
      u.username.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term)
    );
  });

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 8,
        background: 'rgba(255, 255, 255, 0.07)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        maxHeight: '75vh',
        overflowY: 'scroll',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Nome utente</TableCell>
            <TableCell>Ruolo</TableCell>
            <TableCell align="right">Azioni</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((u) => {
            const isEditing = editingUserId === u._id;

            return (
              <TableRow
                key={u._id}
                hover
                onClick={() => onSelectUser(u)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor:
                    selectedUser && selectedUser._id === u._id
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'transparent',
                  transition: 'background-color 0.3s',
                }}
              >
                <TableCell>
                  {isEditing ? (
                    <TextField
                      name="fullName"
                      value={editedUser.fullName || ''}
                      onChange={onEditChange}
                      size="small"
                      fullWidth
                    />
                  ) : (
                    u.fullName
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <TextField
                      name="username"
                      value={editedUser.username || ''}
                      onChange={onEditChange}
                      size="small"
                      fullWidth
                    />
                  ) : (
                    u.username
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Select
                      name="role"
                      value={editedUser.role || ''}
                      onChange={(e: SelectChangeEvent) => onEditChange(e)}
                      size="small"
                      fullWidth
                    >
                      <MenuItem value="admin">Amministratore</MenuItem>
                      <MenuItem value="manager">Manager</MenuItem>
                      <MenuItem value="operator">Operatore</MenuItem>
                    </Select>
                  ) : (
                    u.role
                  )}
                </TableCell>
                <TableCell align="right">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSaveEdit();
                        }}
                        variant="contained"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <SaveIcon />
                      </Button>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onCancelEditing();
                        }}
                        size="small"
                      >
                        <ClearIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartEditing(u);
                        }}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteClick(u);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
