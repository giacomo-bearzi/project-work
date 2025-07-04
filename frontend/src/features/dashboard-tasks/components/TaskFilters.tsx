import {
  Box,
  Stack,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  Checkbox,
  ListItemText,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';

interface ProductionLine {
  _id: string;
  name: string;
  description?: string;
  lineId: string;
}

interface AutocompleteUser {
  _id: string;
  fullName: string;
  username: string;
  role: string;
}

interface TaskFiltersProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  selectedStatus: string[];
  setSelectedStatus: React.Dispatch<React.SetStateAction<string[]>>;
  selectedLine: string[];
  setSelectedLine: React.Dispatch<React.SetStateAction<string[]>>;
  operatorSearchQuery: string;
  setOperatorSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  productionLines: ProductionLine[];
  users: AutocompleteUser[];
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedLine,
  setSelectedLine,
  operatorSearchQuery,
  setOperatorSearchQuery,
  selectedDate,
  setSelectedDate,
  productionLines,
  users,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const statusOptions = ['in_attesa', 'in_corso', 'completata'];

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{ mb: 2, mt: 2, p: 2 }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          placeholder="Cerca la descrizione"
          size="small"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{
            minWidth: 160,
            '& .MuiInputBase-input::placeholder': {
              color: isDark ? '#B0B3B8' : '#888',
              opacity: 1,
            },
          }}
        />
        <Select
          multiple
          displayEmpty
          value={selectedStatus}
          onChange={(e) =>
            setSelectedStatus(
              typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value
            )
          }
          renderValue={() => 'Stato'}
          size="small"
          sx={{ minWidth: 120 }}
        >
          {statusOptions.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={selectedStatus.indexOf(option) > -1} />
              <ListItemText
                primary={
                  option === 'in_attesa'
                    ? 'In attesa'
                    : option === 'in_corso'
                      ? 'In corso'
                      : 'Completata'
                }
              />
            </MenuItem>
          ))}
        </Select>
        <Select
          multiple
          displayEmpty
          value={selectedLine}
          onChange={(e) =>
            setSelectedLine(
              typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value
            )
          }
          renderValue={() => 'Linea'}
          size="small"
          sx={{ minWidth: 120 }}
        >
          {productionLines.map((line) => (
            <MenuItem key={line.lineId} value={line.lineId}>
              <Checkbox checked={selectedLine.indexOf(line.lineId) > -1} />
              <ListItemText primary={line.name} />
            </MenuItem>
          ))}
        </Select>
        <TextField
          placeholder="Cerca operatore"
          size="small"
          variant="outlined"
          value={operatorSearchQuery}
          onChange={(e) => setOperatorSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{
            minWidth: 160,
            '& .MuiInputBase-input::placeholder': {
              color: isDark ? '#B0B3B8' : '#888',
              opacity: 1,
            },
          }}
        />
        <TextField
          type="date"
          size="small"
          variant="outlined"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          sx={{ minWidth: 140 }}
          InputLabelProps={{ shrink: true }}
        />
        {/* Il bottone AGGIUNGI ATTIVITÁ verrà gestito a livello superiore, non qui */}
      </Stack>
    </Stack>
  );
};
