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
} from "@mui/material";
import ResponsiveAppBar from "../../navbar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useRouter, useParams } from "next/navigation";
import React from "react";
import PaginationBugs from "@/app/components/PaginationBugs/page";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";

export default function ProjectBugs() {
  const params = useParams();
  const router = useRouter();
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
