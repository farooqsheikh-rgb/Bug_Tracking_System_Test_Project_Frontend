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
  Tooltip,
} from "@mui/material";
import ResponsiveAppBar from "../../navbar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import PaginationBugs from "@/app/components/PaginationBugs";
import BugActionsDialog from "@/app/components/BugActionsDialog";
import AddBugDialog from "@/app/components/AddBugDialog";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import ViewModuleIcon from "@mui/icons-material/ViewModule";

interface Bug {
  id: number;
  title: string;
  description: string;
  status: string;
  type: string;
  deadline: string;
  screenshot?: string;
  assignedDevelopers?: User[];
}

interface User {
  id: number;
  name: string;
  email: string;
  user_type: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
}

export default function ProjectBugs() {
  const params = useParams();
  const router = useRouter();

  const [projectName, setProjectName] = useState('');
  const [userRole, setUserRole] = React.useState<
    "manager" | "QA" | "developer"
  >("developer");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAnchorEl, setDialogAnchorEl] =
    React.useState<HTMLElement | null>(null);
  const [selectedBugId, setSelectedBugId] = React.useState<number | null>(null);
  const [addBugDialogOpen, setAddBugDialogOpen] = useState(false);
  const [deadlineToggles, setDeadlineToggles] = useState<{
    [key: number]: boolean;
  }>({});
  const [subtasksFilter, setSubtasksFilter] = React.useState("");
  const [meFilter, setMeFilter] = React.useState("");
  const [assigneesFilter, setAssigneesFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [bugsData, setBugsData] = useState<Bug[]>([]);
  const [projectData, setProjectData] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingBugId, setUpdatingBugId] = useState<number | null>(null);
  const [deletingBugId, setDeletingBugId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const userType = getUserTypeFromCookies();
    setUserRole(userType as "manager" | "QA" | "developer");
    const hash = window.location.hash;
    if (hash) {
      setProjectName(decodeURIComponent(hash.substring(1)));
    }
  }, []);

  const handleSubtasksChange = (event: SelectChangeEvent) => {
    setSubtasksFilter(event.target.value);
  };

  const handleMeChange = (event: SelectChangeEvent) => {
    setMeFilter(event.target.value);
  };

  const handleAssigneesChange = (event: SelectChangeEvent) => {
    setAssigneesFilter(event.target.value);
  };

  const getUserTypeFromCookies = () => {
    try {
      const cookies = document.cookie.split(";");
      console.log("All cookies:", cookies);

      const userTypeCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("userType=")
      );
      if (userTypeCookie) {
        const userType = userTypeCookie.split("=")[1];
        console.log("User type from cookie:", userType);
        return userType;
      }

      const accessTokenCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("accessToken=")
      );
      if (accessTokenCookie) {
        try {
          const token = accessTokenCookie.split("=")[1];
          console.log("Raw token:", token);

          const payload = JSON.parse(atob(token.split(".")[1]));
          console.log("Decoded payload:", payload);

          const userType =
            payload.user_type ||
            payload.userType ||
            payload.role ||
            payload.type ||
            "developer";
          console.log("Extracted user type from token:", userType);

          return userType;
        } catch (tokenError) {
          console.error("Error parsing token:", tokenError);
        }
      }

      console.log("No user type cookie or valid token found");
      return "developer";
    } catch (error) {
      console.error("Error getting user type from cookies:", error);
      return "developer";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const projectId = params.id;

        const userType = getUserTypeFromCookies();
        console.log("User type from cookies:", userType);
        console.log("Setting user role to:", userType);
        setUserRole(userType as "manager" | "QA" | "developer");

        const projectResponse = await fetch(`/api/projects/${projectId}`, {
          credentials: "include",
        });
        const projectResult = await projectResponse.json();

        console.log("Project response:", projectResult);
        console.log("Project response success:", projectResult.success);
        console.log("Project data:", projectResult.data);
        console.log("Project name:", projectResult.data?.name);

        if (projectResult.success) {
          setProjectData(projectResult.data);
          console.log("Project data set to state:", projectResult.data);
        } else {
          setError("Failed to fetch project details");
          return;
        }

        await fetchBugs("", 1, 10);
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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "new":
        return "#EC5962";
      case "started":
        return "#3069FE";
      case "resolved":
        return "#00B894";
      case "completed":
        return "#00B894";
      default:
        return "#EC5962";
    }
  };

  const getStatusChipColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "new":
        return "#FDF2F2";
      case "started":
        return "#EEF3FF";
      case "resolved":
        return "#00B89414";
      case "completed":
        return "#00B89414";
      case "pending":
        return "#FDF2F2";
      default:
        return "#FDF2F2";
    }
  };

  const handleActionsClick = (
    event: React.MouseEvent<HTMLElement>,
    bugId: number
  ) => {
    const bug = bugsData.find((b) => b.id === bugId);
    console.log("Opening dialog for bug:", bug);
    console.log("Bug type:", bug?.type);
    console.log("Bug status:", bug?.status);
    setDialogAnchorEl(event.currentTarget);
    setSelectedBugId(bugId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogAnchorEl(null);
    setSelectedBugId(null);
  };

  const handleAddBugDialogOpen = () => {
    setAddBugDialogOpen(true);
  };

  const handleAddBugDialogClose = () => {
    setAddBugDialogOpen(false);
  };

  const handleDeadlineToggle = (bugId: number) => {
    setDeadlineToggles((prev) => ({
      ...prev,
      [bugId]: !prev[bugId],
    }));
  };

  const debouncedFetchBugs = useCallback(
    debounce((nextValue: string) => fetchBugs(nextValue, 1, itemsPerPage), 300),
    [itemsPerPage]
  );

  useEffect(() => {
    debouncedFetchBugs(searchQuery);
  }, [searchQuery, debouncedFetchBugs]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchBugs(searchQuery, newPage, itemsPerPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    fetchBugs(searchQuery, 1, newItemsPerPage);
  };

  const fetchBugs = async (
    searchTerm: string = "",
    page: number = 1,
    limit: number = itemsPerPage
  ) => {
    try {
      setIsSearching(true);
      const projectId = params.id;

      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", limit.toString());

      if (searchTerm.trim() !== "") {
        queryParams.append("title", searchTerm.trim());
      }

      const url = `/api/bugs/project/${projectId}?${queryParams.toString()}`;
      const bugsResponse = await fetch(url, {
        credentials: "include",
      });
      const bugsResult = await bugsResponse.json();

      if (bugsResult.success) {
        setBugsData(bugsResult.data || []);

        if (bugsResult.pagination) {
          setTotalPages(bugsResult.pagination.totalPages || 1);
          setTotalItems(bugsResult.pagination.totalItems || 0);
          setCurrentPage(bugsResult.pagination.currentPage || 1);
        } else {
          const totalItems = bugsResult.data?.length || 0;
          setTotalItems(totalItems);
          setTotalPages(Math.ceil(totalItems / limit));
          setCurrentPage(page);
        }
      }
    } catch (err) {
      console.error("Error fetching bugs:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleBugCreated = () => {
    fetchBugs(searchQuery, currentPage, itemsPerPage);
  };

  const handleStatusChange = async (bugId: number, newStatus: string) => {
    try {
      setUpdatingBugId(bugId);

      const response = await fetch(`/api/bugs/${bugId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update bug status");
      }

      const result = await response.json();

      if (result.success) {
        setBugsData((prevBugs) =>
          prevBugs.map((bug) =>
            bug.id === bugId
              ? {
                  ...bug,
                  status: newStatus,
                  statusColor: getStatusColor(newStatus),
                  chipColor: getStatusChipColor(newStatus),
                }
              : bug
          )
        );
        console.log("Bug status updated successfully");
      } else {
        throw new Error(result.message || "Failed to update bug status");
      }
    } catch (error) {
      console.error("Error updating bug status:", error);
      alert("Failed to update bug status. Please try again.");
    } finally {
      setUpdatingBugId(null);
    }
  };

  const handleDeleteBug = async (bugId: number) => {
    try {
      setDeletingBugId(bugId);

      const response = await fetch(`/api/bugs/${bugId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete bug");
      }

      const result = await response.json();

      if (result.success) {
        setBugsData((prevBugs) => prevBugs.filter((bug) => bug.id !== bugId));
        console.log("Bug deleted successfully");
      } else {
        throw new Error(result.message || "Failed to delete bug");
      }
    } catch (error) {
      console.error("Error deleting bug:", error);
      alert("Failed to delete bug. Please try again.");
    } finally {
      setDeletingBugId(null);
    }
  };

  return (
    <>
      <Box sx={{ width: "100%", height: "100%", backgroundColor: "#FFFFFF" }}>
        <ResponsiveAppBar />

        <Box
          sx={{
            width: "1165px",
            marginLeft: "221px",
          }}
        >
          <Box sx={{ maxWidth: "xl", margin: "30px auto" }}>
            <Box sx={{ padding: "0 32px" }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: "400",
                  color: "#5B6871",
                  lineHeight: "16px",
                  cursor: "pointer",
                }}
                onClick={() => router.push("/projects")}
              >
                Projects &gt;{" "}
                <span style={{ color: "#000000" }}>
                  {projectName}
                </span>
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "21px" }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "36px",
                      lineHeight: "48px",
                      color: "#252C32",
                      letterSpacing: "-2.2%",
                    }}
                  >
                    All bugs listing
                  </Typography>
                  <Chip
                    label="Bugs"
                    sx={{
                      marginTop: "18px",
                      backgroundColor: "#FDF2F2",
                      color: "#EC5962",
                      fontWeight: "500",
                      fontSize: "12.72px",
                      width: "47.97",
                      height: "25.45px",
                      borderRadius: "4.24px",
                    }}
                  />
                </Box>

                <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
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

                  {userRole === "QA" && (
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddBugDialogOpen}
                      sx={{
                        backgroundColor: "#007DFA",
                        color: "#F6F8F9",
                        textTransform: "none",
                        borderRadius: "6px",
                        padding: "8px",
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
                  )}
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                borderTop: "1px solid #DDE2E4",
                borderBottom: "1px solid #DDE2E4",
                margin: "16px 0",
                padding: "0 32px",
              }}
            >
              <Box sx={{ marginRight: "152px" }}>
                <TextField
                  placeholder="Search"
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                  gap: "12px",
                  justifyContent: "center",
                }}
              >
                <FormControl sx={{ minWidth: 121 }}>
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

                <FormControl sx={{ minWidth: 79 }}>
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

              <Box
                sx={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  marginLeft: "240px",
                }}
              >
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

            <TableContainer component={Paper} sx={{ marginTop: "24px" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#F9FAFC" }}>
                    <TableCell
                    sx={{
                      width: "57px"
                    }}>
                      <Checkbox
                        sx={{
                          width: "18.54px",
                          height: "18.54px",
                          paddingLeft: "21px",
                        }}
                      />
                    </TableCell>

                    <TableCell
                      sx={{
                        width: "384px",
                        fontWeight: 600,
                        color: "#3A3541DE",
                        fontSize: "12.36px",
                        lineHeight: "24.72px",
                        letterSpacing: "0.18px",
                        position: "relative",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                          height: "14.42px",
                          width: "2px",
                          backgroundColor: "#3A35411F",
                        },
                      }}
                    >
                      DETAILS
                    </TableCell>

                    <TableCell
                      sx={{
                        width: "148px",
                        fontWeight: 600,
                        color: "#3A3541DE",
                        fontSize: "12.36px",
                        lineHeight: "24.72px",
                        letterSpacing: "0.18px",
                        position: "relative",
                        textAlign: "center",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                          height: "14.42px",
                          width: "2px",
                          backgroundColor: "#3A35411F",
                        },
                      }}
                    >
                      STATE
                    </TableCell>

                    <TableCell
                      sx={{
                        width: "152px",
                        fontWeight: 600,
                        color: "#3A3541DE",
                        fontSize: "12.36px",
                        lineHeight: "24.72px",
                        letterSpacing: "0.18px",
                        position: "relative",
                        textAlign: "center",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                          height: "14.42px",
                          width: "2px",
                          backgroundColor: "#3A35411F",
                        },
                      }}
                    >
                      STATUS
                    </TableCell>

                    <TableCell
                      sx={{
                        width: "124px",
                        fontWeight: 600,
                        color: "#3A3541DE",
                        fontSize: "12.36px",
                        lineHeight: "24.72px",
                        letterSpacing: "0.18px",
                        position: "relative",
                        textAlign: "center",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                          height: "14.42px",
                          width: "2px",
                          backgroundColor: "#3A35411F",
                        },
                      }}
                    >
                      DUE DATE
                    </TableCell>

                    <TableCell
                      sx={{
                        width: "156px",
                        fontWeight: 600,
                        color: "#3A3541DE",
                        fontSize: "12.36px",
                        lineHeight: "24.72px",
                        letterSpacing: "0.18px",
                        position: "relative",
                        textAlign: "center",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                          height: "14.42px",
                          width: "2px",
                          backgroundColor: "#3A35411F",
                        },
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
                        position: "relative",
                        textAlign: "center",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                          height: "14.42px",
                          width: "2px",
                          backgroundColor: "#3A35411F",
                        },
                      }}
                    >
                      ACTION
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        sx={{ textAlign: "center", py: 4 }}
                      >
                        <Typography>Loading bugs...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        sx={{ textAlign: "center", py: 4 }}
                      >
                        <Typography color="error">{error}</Typography>
                      </TableCell>
                    </TableRow>
                  ) : bugsData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        sx={{ textAlign: "center", py: 4 }}
                      >
                        <Typography>No bugs found for this project</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    bugsData.map((bug) => (
                      <TableRow key={bug.id}>
                        <TableCell>
                          <Checkbox
                            sx={{
                              width: "18.54px",
                              height: "18.54px",
                              paddingLeft: "21px",
                            }}
                          />
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

                        <TableCell
                          sx={{ textAlign: "center", verticalAlign: "middle" }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
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

                        <TableCell
                          sx={{ textAlign: "center", verticalAlign: "middle" }}
                        >
                          <Box
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
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
                          </Box>
                        </TableCell>

                        <TableCell
                          sx={{ textAlign: "center", verticalAlign: "middle" }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {deadlineToggles[bug.id] ? (
                              <Typography
                                onClick={() => handleDeadlineToggle(bug.id)}
                                sx={{
                                  color: "#007DFA",
                                  fontSize: "12px",
                                  cursor: "pointer",
                                  fontWeight: 500,
                                  "&:hover": {
                                    textDecoration: "underline",
                                  },
                                }}
                              >
                                {new Date(bug.deadline).toLocaleDateString()}
                              </Typography>
                            ) : (
                              <Tooltip title="Click to view deadline">
                                <IconButton
                                  onClick={() => handleDeadlineToggle(bug.id)}
                                  sx={{
                                    padding: 0,
                                    "&:hover": {
                                      backgroundColor: "transparent",
                                    },
                                  }}
                                >
                                  <CalendarTodayIcon
                                    sx={{
                                      color: "#D0D5DD",
                                      width: "21px",
                                      height: "21px",
                                      cursor: "pointer",
                                      "&:hover": {
                                        color: "#007DFA",
                                      },
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>

                        <TableCell
                          sx={{ textAlign: "center", verticalAlign: "middle" }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            {bug.assignedDevelopers &&
                            bug.assignedDevelopers.length > 0 ? (
                              bug.assignedDevelopers.map(
                                (user: User, index: number) => (
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
                                )
                              )
                            ) : (
                              <Typography
                                sx={{ fontSize: "12px", color: "#6E6F72" }}
                              >
                                Unassigned
                              </Typography>
                            )}
                          </Box>
                        </TableCell>

                        <TableCell
                          sx={{ textAlign: "center", verticalAlign: "middle" }}
                        >
                          <IconButton
                            onClick={(event) =>
                              handleActionsClick(event, bug.id)
                            }
                            disabled={
                              updatingBugId === bug.id ||
                              deletingBugId === bug.id
                            }
                            sx={{
                              color: "#3A35418A",
                              width: "4.12px",
                              height: "16.48px",
                              opacity:
                                updatingBugId === bug.id ||
                                deletingBugId === bug.id
                                  ? 0.5
                                  : 1,
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

          <BugActionsDialog
            open={dialogOpen}
            anchorEl={dialogAnchorEl}
            onClose={handleDialogClose}
            userRole={userRole}
            bugId={selectedBugId || 0}
            bugType={
              bugsData.find((bug) => bug.id === selectedBugId)?.type || "bug"
            }
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteBug}
            isUpdating={updatingBugId === selectedBugId}
            isDeleting={deletingBugId === selectedBugId}
          />

          <AddBugDialog
            open={addBugDialogOpen}
            onClose={handleAddBugDialogClose}
            projectId={params.id as string}
            onBugCreated={handleBugCreated}
          />

          <PaginationBugs
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </Box>
      </Box>
    </>
  );
}
