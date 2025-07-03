import { Typography, Divider, Box } from "@mui/material";

import type { User } from "../../../components/Login.tsx";
import type { Issue, Task } from "../pages/UsersPage.tsx";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";

interface UserDetailsProps {
  user: User;
  issues: Issue[];
  tasks: Task[];
  loading: boolean;
  onNavigateToIssues: () => void;
  onNavigateToPlanning: () => void;
  show: "issues" | "tasks";
}

export const UserDetails: React.FC<UserDetailsProps> = ({
  issues,
  tasks,
  loading,
  onNavigateToIssues,
  onNavigateToPlanning,
  show,
}) => {
  return (
    <>
      {show === "issues" && (
        <>
          <Box
            sx={{
              backgroundColor: "#E0E0E0",
              borderRadius: 11,
              padding: 1,
              color: "black ",
              width: "100%",
              position: "sticky",
              transform: "translateY(-10px)",
              top: 0,
              zIndex: 1000,
              cursor: "pointer",
              transition: "color 0.3s ease",
              "&:hover": {
                color: "secondary.main",
              },
              "&:hover svg": {
                transform: "translateX(5px)",
              },
              "& svg": {
                transition: "transform 0.3s ease",
              },
            }}
            onClick={onNavigateToIssues}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 1,

                zIndex: 2,
              }}
            >
              Issues segnalate <DoubleArrowIcon />
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />

          <Box
            sx={{
              maxHeight: 300,
              pr: 1,
              overflowY: "scroll",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {loading ? (
              <Typography variant="body2">Caricamento issues...</Typography>
            ) : issues.length > 0 ? (
              <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                {issues.map((issue, id) => (
                  <li key={issue._id}>
                    <Typography variant="body2">
                      <span>#{id + 1}</span>
                      <br />
                      <strong>Descrizione:</strong> {issue.description} <br />
                      <strong>Stato:</strong> {issue.status}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant="body2">
                Nessuna issue trovata per questo utente.
              </Typography>
            )}
          </Box>
        </>
      )}

      {show === "tasks" && (
        <>
          <Box
            sx={{
              backgroundColor: "#E0E0E0",
              borderRadius: 11,
              padding: 1,
              color: "black ",
              width: "100%",
              position: "sticky",
              transform: "translateY(-10px)",
              top: 0,
              zIndex: 1000,
              cursor: "pointer",
              transition: "color 0.3s ease",
              "&:hover": {
                color: "secondary.main",
              },
              "&:hover svg": {
                transform: "translateX(5px)",
              },
              "& svg": {
                transition: "transform 0.3s ease",
              },
            }}
            onClick={onNavigateToPlanning}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                transition: "color 0.3s ease",
                position: "sticky",
                top: 0,

                zIndex: 2,
                "&:hover": {
                  color: "secondary.main",
                },
                "&:hover svg": {
                  transform: "translateX(5px)",
                },
                "& svg": {
                  transition: "transform 0.3s ease",
                },
              }}
            >
              Tasks segnalate <DoubleArrowIcon />
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box
            sx={{
              maxHeight: 300,
              pr: 1,
              overflowY: "scroll",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {loading ? (
              <Typography variant="body2">Caricamento tasks...</Typography>
            ) : tasks.length > 0 ? (
              <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                {tasks.map((task, id) => (
                  <li key={task._id}>
                    <Typography variant="body2">
                      <span>#{id + 1}</span>
                      <br />
                      <strong>Data:</strong> {task.date} <br />
                      <strong>Linea:</strong> {task.lineId} <br />
                      <strong>Descrizione:</strong>{" "}
                      {task.description.length > 30
                        ? task.description.substring(0, 30) + "..."
                        : task.description}
                      <br />
                      <strong>Stima:</strong> {task.estimatedMinutes} minuti{" "}
                      <br />
                      <strong>Stato:</strong> {task.status}
                    </Typography>

                    {task.checklist?.length > 0 && (
                      <Box ml={2} mt={1}>
                        <Typography variant="subtitle2">Checklist:</Typography>
                        <ul style={{ marginTop: 0, paddingLeft: "1rem" }}>
                          {task.checklist.map((item, index) => (
                            <li key={index}>
                              <Typography variant="body2">
                                - {item.item}
                                {item.done
                                  ? " ✅ Completato"
                                  : " ⏳ In sospeso"}
                              </Typography>
                            </li>
                          ))}
                        </ul>
                      </Box>
                    )}
                    <Divider sx={{ my: 1 }} />
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant="body2">
                Nessuna task trovata per questo utente.
              </Typography>
            )}
          </Box>
        </>
      )}
    </>
  );
};
