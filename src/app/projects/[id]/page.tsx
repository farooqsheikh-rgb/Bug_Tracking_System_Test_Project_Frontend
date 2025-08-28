"use client";
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Avatar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import ResponsiveAppBar from "../../navbar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useRouter, useParams } from "next/navigation";
import React from "react";
import PaginationBugs from "@/app/components/PaginationBugs/page";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import ViewModuleIcon from "@mui/icons-material/ViewModule";

export default function ProjectBugs() {
  const params = useParams();
  const router = useRouter();

  const [subtasksFilter, setSubtasksFilter] = React.useState("");
  const [meFilter, setMeFilter] = React.useState("");
  const [assigneesFilter, setAssigneesFilter] = React.useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState("5");

  const handleSubtasksChange = (event: SelectChangeEvent) => {
    setSubtasksFilter(event.target.value);
  };

  const handleMeChange = (event: SelectChangeEvent) => {
    setMeFilter(event.target.value);
  };

  const handleAssigneesChange = (event: SelectChangeEvent) => {
    setAssigneesFilter(event.target.value);
  };

  const handleRowsPerPageChange = (event: SelectChangeEvent) => {
    setRowsPerPage(event.target.value);
  };

  const bugsData = [
    {
      id: 1,
      description: "Convert the audio file received from Mobile app into text",
      status: "Pending",
      statusColor: "#f44336",
      chipColor: "#FDF2F2",
      dueDate: "2024-03-15",
      assignedTo: ["Hassan"],
      priority: "High",
    },
    {
      id: 2,
      description: "Fix the login authentication issue in the web application",
      status: "In progress",
      statusColor: "#2196f3",
      chipColor: "#EEF3FF",
      dueDate: "2024-03-20",
      assignedTo: ["Ali"],
      priority: "Medium",
    },
  ];

  return (
    <Box
      sx={{
        padding: "32px 70px",
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
      }}
    >
      <ResponsiveAppBar />

      <Box sx={{ maxWidth: "xl", margin: "20px auto" }}>
        <Box sx={{ marginBottom: "32px" }}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: "400",
              color: "#5B6871",
              lineHeight: "16px",
              marginBottom: "5px",
            }}
            onClick={() => router.push("/projects")}
          >
            Projects &gt;{" "}
            <span style={{ color: "#000000" }}>Android UI System</span>
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "36px",
                  lineHeight: "48px",
                  color: "#252C32",
                }}
              >
                All bugs listing
              </Typography>
              <Chip
                label="Bugs"
                sx={{
                  backgroundColor: "#FDF2F2",
                  color: "#EC5962",
                  fontWeight: "500",
                  fontSize: "12.72px",
                  height: "25.45px",
                  borderRadius: "4.24px",
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <IconButton
                sx={{
                  color: "#5B6871",
                  width: "40px",
                  height: "40px",
                  border: "1px solid #D0D5DD",
                  borderRadius: "6px",
                }}
              >
                <SettingsIcon sx={{ color: "#5B6871" }} />
              </IconButton>

              <IconButton
                sx={{
                  color: "#5B6871",
                  width: "40px",
                  height: "40px",
                  border: "1px solid #D0D5DD",
                  borderRadius: "6px",
                }}
              >
                <MoreVertIcon
                  sx={{ transform: "rotate(90deg)", color: "#5B6871" }}
                />
              </IconButton>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: "#007DFA",
                  color: "#F6F8F9",
                  textTransform: "none",
                  borderRadius: "6px",
                  padding: "12px 20px",
                  fontWeight: 600,
                  fontSize: "14px",
                  height: "40px",
                  width: "163px",
                  lineHeight: "24px",
                  letterSpacing: "-0.6%",
                }}
              >
                New Task bug
              </Button>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            width: "100%",
            borderTop: "1px solid #DDE2E4",
            borderBottom: "1px solid #DDE2E4",
            padding: "25px 0",
            margin: "25px 0",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <TextField
              placeholder="Search"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#FFFFFF",
                  borderRadius: "6px",
                  width: "236px",
                  height: "40px",
                  "& fieldset": {
                    borderColor: "#DDE2E4",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <SearchIcon
                    sx={{
                      color: "#B0BABF",
                      marginRight: "8px",
                      fontSize: "20px",
                    }}
                  />
                ),
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flex: 5,
            }}
          >
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel
                sx={{
                  color: "#252C32",
                  fontWeight: "400",
                  fontSize: "14px",
                  lineHeight: "24px",
                  letterSpacing: "-0.6%",
                }}
              >
                Subtasks
              </InputLabel>
              <Select
                value={subtasksFilter}
                label="Subtasks"
                onChange={handleSubtasksChange}
                sx={{
                  color: "#5B6871",
                  "& fieldset": { border: "none" },
                }}
              >
                <MenuItem value="all">All</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 100 }}>
              <InputLabel
                sx={{
                  color: "#252C32",
                  fontWeight: "400",
                  fontSize: "14px",
                  lineHeight: "24px",
                  letterSpacing: "-0.6%",
                }}
              >
                Me
              </InputLabel>
              <Select
                value={meFilter}
                label="Me"
                onChange={handleMeChange}
                sx={{
                  color: "#5B6871",
                  "& fieldset": { border: "none" },
                }}
              >
                <MenuItem value="all">All</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel
                sx={{
                  color: "#252C32",
                  fontWeight: "400",
                  fontSize: "14px",
                  lineHeight: "24px",
                  letterSpacing: "-0.6%",
                }}
              >
                Assignees
              </InputLabel>
              <Select
                value={assigneesFilter}
                label="Assignees"
                onChange={handleAssigneesChange}
                sx={{
                  color: "#5B6871",
                  "& fieldset": { border: "none" },
                }}
              >
                <MenuItem value="all">All Assignees</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <IconButton
              sx={{
                color: "#344054",
                border: "1px solid #D0D5DD",
                borderRadius: "8px",
                width: "32px",
                height: "32px",
              }}
            >
              <FilterListIcon
                sx={{ width: "16px", height: "16px", color: "#344054" }}
              />
            </IconButton>

            <IconButton
              sx={{
                color: "#344054",
                border: "1px solid #D0D5DD",
                borderRadius: "8px",
                width: "32px",
                height: "32px",
              }}
            >
              <ViewModuleIcon
                sx={{ width: "16px", height: "16px", color: "#344054" }}
              />
            </IconButton>

            <Box sx={{ display: "flex", gap: "0px" }}>
              <IconButton
                sx={{
                  backgroundColor: "#F6F8F9",
                  color: "#B0BABF",
                  border: "1px solid #D0D5DD",
                  borderRadius: "8px",
                  width: "32px",
                  height: "32px",
                }}
              >
                <ViewComfyIcon
                  sx={{ width: "16px", height: "16px", color: "#B0BABF" }}
                />
              </IconButton>

              <IconButton
                sx={{
                  backgroundColor: "#F6F8F9",
                  color: "#007DFA",
                  border: "1px solid #D0D5DD",
                  borderRadius: "8px",
                  width: "32px",
                  height: "32px",
                }}
              >
                <ViewListIcon
                  sx={{ width: "16px", height: "16px", color: "#007DFA" }}
                />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)", borderRadius: "12px" }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F9FAFC" }}>
                <TableCell>
                  <Checkbox sx={{ width: "18.54px", height: "18.54px" }} />
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#3A3541DE",
                    fontSize: "12.36px",
                    lineHeight: "24.72px",
                    letterSpacing: "0.18px",
                  }}
                >
                  BUG DETAILS
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#3A3541DE",
                    fontSize: "12.36px",
                    lineHeight: "24.72px",
                    letterSpacing: "0.18px",
                  }}
                >
                  STATUS
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#3A3541DE",
                    fontSize: "12.36px",
                    lineHeight: "24.72px",
                    letterSpacing: "0.18px",
                  }}
                >
                  DUE DATE
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#3A3541DE",
                    fontSize: "12.36px",
                    lineHeight: "24.72px",
                    letterSpacing: "0.18px",
                  }}
                >
                  ASSIGNED TO
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#3A3541DE",
                    fontSize: "12.36px",
                    lineHeight: "24.72px",
                    letterSpacing: "0.18px",
                  }}
                >
                  ACTION
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bugsData.map((bug) => (
                <TableRow
                  key={bug.id}
                  sx={{ "&:hover": { backgroundColor: "#f8f9fa" } }}
                >
                  <TableCell>
                    <Checkbox sx={{ width: "18.54px", height: "18.54px" }} />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <Box
                        sx={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "6px",
                          backgroundColor: bug.statusColor,
                        }}
                      />
                      <Typography
                        sx={{
                          fontWeight: "400",
                          fontSize: "14.36px",
                          color: "#3A3541AD",
                        }}
                      >
                        {bug.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={bug.status}
                      sx={{
                        backgroundColor: bug.chipColor,
                        color: bug.statusColor,
                        fontSize: "12.72px",
                        lineHeight: "25.45px",
                        fontWeight: 500,
                        borderRadius: "6.36px",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <CalendarTodayIcon
                      sx={{ color: "#D0D5DD", width: "21px", height: "21px" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {bug.assignedTo.map((user, index) => (
                        <Avatar
                          key={index}
                          sx={{
                            width: "25.45px",
                            height: "25.45px",
                            fontSize: "14px",
                            fontWeight: "bold",
                            backgroundColor: "#000000ff",
                          }}
                        >
                          {user.charAt(0)}
                        </Avatar>
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      sx={{
                        color: "#3A35418A",
                        width: "4.12px",
                        height: "16.48px",
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <PaginationBugs />
    </Box>
  );
}
