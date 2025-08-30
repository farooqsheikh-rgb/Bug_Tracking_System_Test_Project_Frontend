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
import React, { useEffect, useState } from "react";
import PaginationBugs from "@/app/components/PaginationBugs/page";
import BugActionsDialog from "@/app/components/BugActionsDialog/page";
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

  const [userRole, setUserRole] = React.useState<"manager" | "QA" | "developer">("developer");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAnchorEl, setDialogAnchorEl] = React.useState<HTMLElement | null>(null);
  const [selectedBugId, setSelectedBugId] = React.useState<number | null>(null);
  const [subtasksFilter, setSubtasksFilter] = React.useState("");
  const [meFilter, setMeFilter] = React.useState("");
  const [assigneesFilter, setAssigneesFilter] = useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState("5");
  const [bugsData, setBugsData] = useState<any[]>([]);
  const [projectData, setProjectData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingBugId, setUpdatingBugId] = useState<number | null>(null);
  const [deletingBugId, setDeletingBugId] = useState<number | null>(null);

  // Debug effect to log user role changes
  useEffect(() => {
    console.log('User role state changed to:', userRole);
    console.log('Current user role for dialog:', userRole);
  }, [userRole]);

  // Debug effect to log project data changes
  useEffect(() => {
    console.log('Project data state changed to:', projectData);
    console.log('Project name from state:', projectData?.name);
  }, [projectData]);

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

  // Function to get user type from cookies
  const getUserTypeFromCookies = () => {
    try {
      const cookies = document.cookie.split(';');
      console.log('All cookies:', cookies);
      
      // First try to get user type from the dedicated cookie
      const userTypeCookie = cookies.find(cookie => cookie.trim().startsWith('userType='));
      if (userTypeCookie) {
        const userType = userTypeCookie.split('=')[1];
        console.log('User type from cookie:', userType);
        return userType;
      }
      
      // Fallback: try to get from accessToken if available
      const accessTokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='));
      if (accessTokenCookie) {
        try {
          const token = accessTokenCookie.split('=')[1];
          console.log('Raw token:', token);
          
          // Decode the JWT payload
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('Decoded payload:', payload);
          
          // Check for different possible field names
          const userType = payload.user_type || payload.userType || payload.role || payload.type || 'developer';
          console.log('Extracted user type from token:', userType);
          
          return userType;
        } catch (tokenError) {
          console.error('Error parsing token:', tokenError);
        }
      }
      
      console.log('No user type cookie or valid token found');
      return 'developer';
    } catch (error) {
      console.error('Error getting user type from cookies:', error);
      return 'developer';
    }
  };

  // Fetch project and bugs data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const projectId = params.id;

        // Set user role from cookies
        const userType = getUserTypeFromCookies();
        console.log('User type from cookies:', userType);
        console.log('Setting user role to:', userType);
        setUserRole(userType as "manager" | "QA" | "developer");

        // Fetch project details
        const projectResponse = await fetch(`/api/projects/${projectId}`, {
          credentials: "include",
        });
        const projectResult = await projectResponse.json();

        console.log('Project response:', projectResult);
        console.log('Project response success:', projectResult.success);
        console.log('Project data:', projectResult.data);
        console.log('Project name:', projectResult.data?.name);

        if (projectResult.success) {
          setProjectData(projectResult.data);
          console.log('Project data set to state:', projectResult.data);
        } else {
          setError("Failed to fetch project details");
          return;
        }

        // Fetch bugs for the project
        const bugsResponse = await fetch(`/api/bugs/project/${projectId}`, {
          credentials: "include",
        });
        const bugsResult = await bugsResponse.json();

        console.log('Bugs response:', bugsResult);

        if (bugsResult.success) {
          setBugsData(bugsResult.data || []);
        } else {
          setError("Failed to fetch bugs");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  // Helper functions for status colors
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "new":
        return "#f44336"; // Red
      case "started":
        return "#2196f3"; // Blue
      case "resolved":
        return "#4caf50"; // Green
      case "completed":
        return "#4caf50"; // Green
      default:
        return "#6E6F72";
    }
  };

  const getStatusChipColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "new":
        return "#FDF2F2"; // Light red
      case "started":
        return "#EEF3FF"; // Light blue
      case "resolved":
        return "#F0F9F0"; // Light green
      case "completed":
        return "#F0F9F0"; // Light green
      default:
        return "#F5F5F5";
    }
  };

  // Dialog handlers
  const handleActionsClick = (event: React.MouseEvent<HTMLElement>, bugId: number) => {
    const bug = bugsData.find(b => b.id === bugId);
    console.log('Opening dialog for bug:', bug);
    console.log('Bug type:', bug?.type);
    console.log('Bug status:', bug?.status);
    setDialogAnchorEl(event.currentTarget);
    setSelectedBugId(bugId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogAnchorEl(null);
    setSelectedBugId(null);
  };

  // API handlers for bug operations
  const handleStatusChange = async (bugId: number, newStatus: string) => {
    try {
      setUpdatingBugId(bugId);
      
      // Call backend API to update bug status
      const response = await fetch(`/api/bugs/${bugId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update bug status');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setBugsData(prevBugs => 
          prevBugs.map(bug => 
            bug.id === bugId 
              ? { 
                  ...bug, 
                  status: newStatus,
                  statusColor: getStatusColor(newStatus),
                  chipColor: getStatusChipColor(newStatus)
                }
              : bug
          )
        );
        console.log('Bug status updated successfully');
      } else {
        throw new Error(result.message || 'Failed to update bug status');
      }
      
    } catch (error) {
      console.error('Error updating bug status:', error);
      alert('Failed to update bug status. Please try again.');
    } finally {
      setUpdatingBugId(null);
    }
  };

  const handleDeleteBug = async (bugId: number) => {
    try {
      setDeletingBugId(bugId);
      
      // Call backend API to delete bug
      const response = await fetch(`/api/bugs/${bugId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete bug');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setBugsData(prevBugs => prevBugs.filter(bug => bug.id !== bugId));
        console.log('Bug deleted successfully');
      } else {
        throw new Error(result.message || 'Failed to delete bug');
      }
      
    } catch (error) {
      console.error('Error deleting bug:', error);
      alert('Failed to delete bug. Please try again.');
    } finally {
      setDeletingBugId(null);
    }
  };

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
              cursor: "pointer",
            }}
            onClick={() => router.push("/projects")}
          >
            Projects &gt;{" "}
            <span style={{ color: "#000000" }}>
              {projectData ? projectData.name : "Loading..."}
            </span>
            {projectData && <span style={{ fontSize: "10px", color: "#666" }}> (Debug: {JSON.stringify(projectData)})</span>}
            {!projectData && <span style={{ fontSize: "10px", color: "#666" }}> (No project data)</span>}
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
              <Typography variant="caption" sx={{ color: "#666", ml: 1 }}>
                (Role: {userRole})
              </Typography>
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
                  STATE
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
                    <Typography>Loading bugs...</Typography>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
                    <Typography color="error">{error}</Typography>
                  </TableCell>
                </TableRow>
              ) : bugsData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
                    <Typography>No bugs found for this project</Typography>
                    {bugsData && <Typography variant="caption" sx={{ display: "block", mt: 1 }}>Debug: {JSON.stringify(bugsData)}</Typography>}
                  </TableCell>
                </TableRow>
              ) : (
                bugsData.map((bug) => (
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
                            backgroundColor: getStatusColor(bug.status),
                          }}
                        />
                        <Typography
                          sx={{
                            fontWeight: "400",
                            fontSize: "14.36px",
                            color: "#3A3541AD",
                          }}
                        >
                          {bug.title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: "400",
                            fontSize: "14.36px",
                            color: "#3A3541AD",
                          }}
                        >
                          {bug.type}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={bug.status}
                        sx={{
                          backgroundColor: getStatusChipColor(bug.status),
                          color: getStatusColor(bug.status),
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
                                                {bug.assignedDevelopers && bug.assignedDevelopers.length > 0 ? (
                          bug.assignedDevelopers.map((user: any, index: number) => (
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
                              {user.name.charAt(0)}
                            </Avatar>
                          ))
                        ) : (
                          <Typography sx={{ fontSize: "12px", color: "#6E6F72" }}>
                            Unassigned
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(event) => handleActionsClick(event, bug.id)}
                        disabled={updatingBugId === bug.id || deletingBugId === bug.id}
                        sx={{
                          color: "#3A35418A",
                          width: "4.12px",
                          height: "16.48px",
                          opacity: (updatingBugId === bug.id || deletingBugId === bug.id) ? 0.5 : 1,
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      
      {/* Bug Actions Dialog */}
      <BugActionsDialog
        open={dialogOpen}
        anchorEl={dialogAnchorEl}
        onClose={handleDialogClose}
        userRole={userRole}
        bugId={selectedBugId || 0}
        bugType={bugsData.find(bug => bug.id === selectedBugId)?.type || "bug"}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteBug}
        isUpdating={updatingBugId === selectedBugId}
        isDeleting={deletingBugId === selectedBugId}
      />
      {/* Debug info */}
      {selectedBugId && (
        <div style={{ position: 'fixed', bottom: '10px', right: '10px', background: '#f0f0f0', padding: '10px', fontSize: '12px', zIndex: 9999 }}>
          <div>Selected Bug ID: {selectedBugId}</div>
          <div>Bug Type: {bugsData.find(bug => bug.id === selectedBugId)?.type || "unknown"}</div>
          <div>User Role: {userRole}</div>
        </div>
      )}
      
      <PaginationBugs />
    </Box>
  );
}
     