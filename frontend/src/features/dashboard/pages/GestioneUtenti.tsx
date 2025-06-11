import {
  Box,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Header } from "../components/Header.tsx";
import { useAuth } from "../../log-in/context/AuthContext.tsx";
import { useEffect, useState } from "react";
import type { User } from "../../../components/Login.tsx";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CancelIcon,
} from "@mui/icons-material";
import axios from "axios";

export const GestioneUtenti = () => {
  const { user, logout, token } = useAuth(); // assicurati che accessToken sia disponibile
  const [users, setUsers] = useState([]);
  // const [editingUserId, setEditingUserId] = useState<string | null>(null);

  //   const [editValues, setEditValues] = useState({
  //     fullName: "",
  //     username: "",
  //     role: "",
  //   });

  //   const handleShowUsers = async () => {
  //     try {
  //       const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       setUsers(res.data);
  //     } catch (err) {
  //       console.error("Errore nel recupero degli utenti:", err);
  //     }
  //   };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      setUsers(res.data);
    } catch (err) {
      console.error("Errore nel recupero degli utenti:", err);
    }
  };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <Box p={1} height={"100dvh"}>
            <Paper
                elevation={1}
                sx={{
                    borderRadius: 11,
                    p: 1,
                    background: "rgba(255, 255, 255, 0.07)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                    height: "100%",
                }}
            >
                <Stack direction="column" gap={1} sx={{ height: "100%" }}>
                    <Header />

         <Grid
      container
      spacing={1}
      gridRow={2}
      sx={{
        height: '100%',
      }}
    >
      <Grid size={3}>
        <Paper
          elevation={1}
          sx={{
            borderRadius: 11,
            p: 1,
            background: 'rgba(255, 255, 255, 0.07)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            height: '100%',
            display: 'flex',
          }}
        ></Paper>
      </Grid>
      <Grid size={9}>
        <Stack
          gap={1}
          sx={{ height: '100%', display: 'flex' }}
        >
          <Paper
            elevation={1}
            sx={{
              borderRadius: 11,
              p: 1,
              background: 'rgba(255, 255, 255, 0.07)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
              height: '100%',
              display: 'flex',
            }}
          > {users.length > 0 && (
            <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Ruolo</TableCell>
                    <TableCell align="right">Azioni</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u: User) => {
                    //   const isEditing = editingUserId === u._id;

                    return (
                      <TableRow
                        key={u._id}
                        //   sx={isEditing ? { backgroundColor: "#FFC7D6" } : {}}
                      >
                        <TableCell>{u.fullName}</TableCell>
                        <TableCell>{u.username}</TableCell>
                        <TableCell>{u.role}</TableCell>
                        {/* <TableCell align="right">
                        {isEditing ? (
                          <>
                            <IconButton
                              //   onClick={() => handleSaveEdit(u._id)}
                              className="no-focus-ring"
                            >
                              <SaveIcon />
                            </IconButton>
                            <IconButton
                              //   onClick={handleCancelEdit}
                              className="no-focus-ring"
                            >
                              <CancelIcon />
                            </IconButton>
                          </>
                        ) : (
                          <IconButton
                            // onClick={() => handleEditClick(u)}
                            className="no-focus-ring"
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                      </TableCell> */}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}</Paper>
          <Paper
            elevation={1}
            sx={{
              borderRadius: 11,
              p: 1,
              background: 'rgba(255, 255, 255, 0.07)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
              height: '100%',
              display: 'flex',
            }}
          ></Paper>
        </Stack>
      </Grid>
    </Grid>
        </Stack>
      </Paper>
    </Box>
  );
};
