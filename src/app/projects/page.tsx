"use client";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  DialogContent,
  DialogActions,
  Dialog,
  DialogTitle,
  debounce,
} from "@mui/material";
import ResponsiveAppBar from "../navbar";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import projectImg from "../../../public/images/folder.png";
import groupWhiteImg from "../../../public/images/Group white.png";
import Image from "next/image";
import PaginationProjects from "../components/PaginationProjects";
import React, { useCallback, useEffect, useState } from "react";
import { Project } from "@/type/Project";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  user_type: string;
}

export default function Projects() {
  const router = useRouter();
  const [userType, setUserType] = useState();
  const [serverError, setServerError] = useState("");
  const [projectsData, setProjectsData] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [userRole, setUserRole] = useState<"manager" | "QA" | "developer">(
    "developer"
  );
  const [assignedUsers, setAssignedUsers] = useState<User[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormValues({ name: "", description: "" });
    setFormErrors({ name: "", description: "", assignedUsers: "" });
    setServerError("");
    setAssignedUsers([]);
    setShowUserDropdown(false);
  };

  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
    assignedUsers: "",
  });

  const getUserTypeFromCookies = () => {
    try {
      const cookies = document.cookie.split(";");

      const userTypeCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("userType=")
      );
      if (userTypeCookie) {
        const userType = userTypeCookie.split("=")[1];
        return userType;
      }

      const accessTokenCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("accessToken=")
      );
      if (accessTokenCookie) {
        try {
          const token = accessTokenCookie.split("=")[1];

          const payload = JSON.parse(atob(token.split(".")[1]));

          const userType =
            payload.user_type ||
            payload.userType ||
            payload.role ||
            payload.type ||
            "developer";

          return userType;
        } catch (tokenError) {
          console.error("Error parsing token:", tokenError);
        }
      }

      return "developer";
    } catch (error) {
      console.error("Error getting user type from cookies:", error);
      return "developer";
    }
  };

  const fetchUsers = useCallback(async () => {
    try {
      setIsSearchingUsers(true);
      const response = await fetch("/api/users", {
        credentials: "include",
      });
      const result = await response.json();

      if (result.success) {
        setAvailableUsers(result.data);
      } else {
        console.error("Failed to fetch users:", result.error);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally{
      setIsSearchingUsers(false);
    }
  }, []);

  const handleAddUser = (user: User) => {
    if (!assignedUsers.find((u) => u.id === user.id)) {
      setAssignedUsers([...assignedUsers, user]);
      clearAssignedUsersError();
    }
    setShowUserDropdown(false);
  };

  const handleRemoveUser = (userId: number) => {
    setAssignedUsers(assignedUsers.filter((user) => user.id !== userId));
  };

  const fetchProjects = async (searchTerm: string, page: number = 1) => {
    try {
      setIsSearching(true);
      let url = "/api/projects";

      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", itemsPerPage.toString());
      params.append("sort", sortField);
      params.append("order", sortOrder);

      if (searchTerm.trim() !== "") {
        params.append("name", searchTerm.trim());
      }

      url += `?${params.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.log(
          "Search error:",
          data.error || "Failed to search projects"
        );
        return;
      }

      setProjectsData(data.data || []);

      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
        setTotalItems(data.pagination.totalItems || 0);
        setCurrentPage(data.pagination.currentPage || 1);
      }
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedFetchProjects = useCallback(
    debounce((nextValue: string) => fetchProjects(nextValue, 1), 300),
    [sortField, sortOrder, itemsPerPage]
  );

  useEffect(() => {
    debouncedFetchProjects(searchQuery);
  }, [searchQuery, debouncedFetchProjects]);

  useEffect(() => {
    const userType = getUserTypeFromCookies();
    setUserRole(userType as "manager" | "QA" | "developer");
  }, []);

  useEffect(() => {
    fetchProjects("", 1);
  }, []);

  useEffect(() => {
    if (open && userRole === "manager") {
      fetchUsers();
    }
  }, [open, userRole, fetchUsers]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchProjects(searchQuery, newPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    fetchProjects(searchQuery, 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setServerError("");
  };

  const clearAssignedUsersError = () => {
    setFormErrors((prev) => ({
      ...prev,
      assignedUsers: "",
    }));
  };

  const validateForm = () => {
    const errors: {
      name?: string;
      description?: string;
      assignedUsers?: string;
    } = {};

    if (!formValues.name.trim()) {
      errors.name = "Project name is required";
    }
    if (!formValues.description.trim()) {
      errors.description = "Short details are required";
    }
    if (assignedUsers.length === 0) {
      errors.assignedUsers =
        "At least one user must be assigned to the project";
    }

    setFormErrors({
      name: errors.name || "",
      description: errors.description || "",
      assignedUsers: errors.assignedUsers || "",
    });

    return Object.keys(errors).length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      console.log("Project creation response status:", res.status);
      console.log("Project creation response headers:", res.headers);

      const data = await res.json();
      console.log("Project creation response:", data);

      if (!res.ok) {
        console.error("Project creation failed with status:", res.status);
        setServerError(
          data?.error ||
            data?.message ||
            `Failed to add project (Status: ${res.status})`
        );
        return;
      }

      if (!data || Object.keys(data).length === 0) {
        console.error("Empty response received");
        setServerError("Empty response received from server");
        return;
      }

      if (!data.success) {
        setServerError(data?.error || data?.message || "Failed to add project");
        return;
      }

      if (!data.data || !data.data.id) {
        console.error("Invalid project creation response:", data);
        setServerError("Project created but invalid response received");
        return;
      }

      const projectId = data.data.id;
      console.log("Created project ID:", projectId);

      const userIds = assignedUsers.map((user) => user.id);
      console.log("Assigning users:", userIds);

      const assignRes = await fetch(`/api/projects/${projectId}/members`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds }),
      });

      const assignData = await assignRes.json();
      console.log("User assignment response:", assignData);

      if (!assignRes.ok || !assignData.success) {
        console.error("Failed to assign users to project:", assignData?.error);
      }

      handleClose();
      fetchProjects(searchQuery, currentPage);
    } catch (err) {
      console.error("Add project error:", err);
      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Box sx={{ width: "100%", height: "100%", backgroundColor: "#F5F6F8" }}>
        <ResponsiveAppBar />

        <Box
          sx={{
            width: "1165px",
            marginLeft: "221px",
            backgroundColor: "#F5F6F8",
          }}
        >
          <Box sx={{ width: "100%", margin: "50px auto" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: "12px",
                borderLeft: "4px solid #50A885",
                borderBottom: "1px solid #ECECEE",
                height: "72px",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", paddingTop: "12px" }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "16px",
                    color: "#000000",
                    lineHeight: "100%",
                    marginLeft: "20px",
                  }}
                >
                  Projects
                </Typography>

                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#AEAEAE",
                    fontWeight: 400,
                    marginTop: "4px",
                    marginLeft: "20px",
                  }}
                >
                  Hi DeVisnext, welcome to ManageBug
                </Typography>
              </Box>

              <TextField
                placeholder="Search for Projects here"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  width: "336px",
                  height: "45px",
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#F1F1F1",
                    fontWeight: "400",
                    fontSize: "16px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    borderRadius: "5px",
                    marginBottom: "12px",
                    "& fieldset": {
                      border: "none",
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <SearchIcon
                      sx={{
                        color: "#6E6F72",
                        marginRight: "8px",
                        width: "18px",
                        height: "18px",
                        borderRadius: "1px",
                      }}
                    />
                  ),
                }}
              />

              {userRole === "manager" && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpen}
                  sx={{
                    backgroundColor: "#007DFA",
                    color: "#FFFFFF",
                    textTransform: "none",
                    borderRadius: "5px",
                    fontWeight: 500,
                    fontSize: "13px",
                    width: "163px",
                    height: "45px",
                    marginBottom: "-10px",

                  }}
                >
                  Add New Project
                </Button>
              )}

              <FormControl
                sx={{
                  width: "110px",
                  height: "45px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              >
                <InputLabel>Sort by</InputLabel>
                <Select
                  label="Sort by"
                  IconComponent={KeyboardArrowDownIcon}
                  sx={{
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "100%",
                    letterSpacing: "0px",
                    backgroundColor: "transparent",
                  }}
                />
              </FormControl>

              <FormControl
                sx={{
                  width: "129px",
                  height: "45px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              >
                <InputLabel>My Project</InputLabel>
                <Select
                  label="My Project"
                  IconComponent={KeyboardArrowDownIcon}
                  sx={{
                    fontWeight: "400",
                    fontSize: "14px",
                    lineHeight: "100%",
                    letterSpacing: "0px",
                    backgroundColor: "transparent",
                  }}
                />
              </FormControl>

              <Box
                sx={{
                  width: 50,
                  height: 45,
                  borderRadius: "5px",
                  position: "relative",
                  backgroundColor: "#007DFA",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}

              >
                <Image
                  src={groupWhiteImg}
                  alt="Profile"
                  width={23.4}
                  height={23.31}
                  style={{ objectFit: "cover" }}
                  priority
                />
              </Box>
            </Box>

            <Dialog
              open={open}
              onClose={handleClose}
              maxWidth={"md"}
              fullWidth
              PaperProps={{
                sx: {
                  height: "465px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              <DialogTitle sx={{ pb: 1 }}>
                <Typography
                  sx={{
                    textAlign: "left",
                    fontWeight: 500,
                    fontSize: "20.35px",
                    color: "#000000",
                  }}
                >
                  Add new Project
                </Typography>
              </DialogTitle>

              <DialogContent sx={{ pt: 2 }}>
                <Box sx={{ display: "flex", gap: 3 }}>
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 400,
                          color: "#000000",
                          mb: 1,
                          fontSize: "16.28px",
                          lineHeight: "100%",
                        }}
                      >
                        Project name
                      </Typography>
                      <TextField
                        name="name"
                        variant="outlined"
                        placeholder="Enter project name"
                        value={formValues.name}
                        onChange={handleChange}
                        error={!!formErrors.name}
                        sx={{
                          width: "445.93px",
                          height: "53.56px",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "5.09px",
                            "& fieldset": {
                              borderColor: formErrors.name
                                ? "#d32f2f"
                                : "#E0E0E0",
                            },
                            "&:hover fieldset": {
                              borderColor: formErrors.name
                                ? "#d32f2f"
                                : "#BDBDBD",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: formErrors.name
                                ? "#d32f2f"
                                : "#007DFA",
                            },
                          },
                        }}
                      />
                      {formErrors.name && (
                        <Typography
                          sx={{ color: "#d32f2f", fontSize: "12px", mt: 0.5 }}
                        >
                          {formErrors.name}
                        </Typography>
                      )}
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 400,
                          color: "#000000",
                          mb: 1,
                          fontSize: "16.28px",
                          lineHeight: "100%",
                        }}
                      >
                        Short details
                      </Typography>
                      <TextField
                        name="description"
                        variant="outlined"
                        placeholder="Enter details here"
                        value={formValues.description}
                        onChange={handleChange}
                        error={!!formErrors.description}
                        multiline
                        minRows={3}
                        sx={{
                          width: "445.93px",
                          height: "53.56px",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "5px",
                            "& fieldset": {
                              borderColor: formErrors.description
                                ? "#d32f2f"
                                : "#E0E0E0",
                            },
                            "&:hover fieldset": {
                              borderColor: formErrors.description
                                ? "#d32f2f"
                                : "#BDBDBD",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: formErrors.description
                                ? "#d32f2f"
                                : "#007DFA",
                            },
                          },
                        }}
                      />
                      {formErrors.description && (
                        <Typography
                          sx={{ color: "#d32f2f", fontSize: "12px", mt: 0.5 }}
                        >
                          {formErrors.description}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 400,
                          color: "#000000",
                          mb: 1,
                          fontSize: "16.28px",
                          lineHeight: "100%",
                        }}
                      >
                        Assign team members
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                          minHeight: "40px",
                        }}
                      >
                        {assignedUsers.map((user) => (
                          <Box
                            key={user.id}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              backgroundColor: "#F5F5F5",
                              borderRadius: "16px",
                              padding: "4px 8px",
                              cursor: "pointer",
                              "&:hover": {
                                backgroundColor: "#E0E0E0",
                              },
                            }}
                            onClick={() => handleRemoveUser(user.id)}
                          >
                            <Box
                              sx={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                backgroundColor: "#000000",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "10px",
                                fontWeight: "bold",
                              }}
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </Box>
                            <Typography
                              sx={{
                                fontSize: "12px",
                                color: "#000000",
                                fontWeight: 500,
                              }}
                            >
                              {user.name}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "10px",
                                color: "#666",
                                backgroundColor: "#E0E0E0",
                                padding: "1px 4px",
                                borderRadius: "4px",
                              }}
                            >
                              {user.user_type}
                            </Typography>
                          </Box>
                        ))}
                        
                        {availableUsers.length!==0 && (
                          <Button
                          onClick={() => setShowUserDropdown(!showUserDropdown)}
                          sx={{
                            minWidth: "32px",
                            height: "32px",
                            border: "1px dashed #D0D5DD",
                            color: "#007DFA",
                            borderRadius: "16px",
                            "&:hover": {
                              borderColor: "#007DFA",
                              backgroundColor: "#F8F9FA",
                            },
                          }}
                        >
                          <AddIcon fontSize="small" />
                        </Button>
                        )}

                        {isSearchingUsers && (
                          <Box sx={{ textAlign: "center", py: 2 }}>
                            <Typography sx={{ color: "#6E6F72" }}>Searching QAs and Developers...</Typography>
                          </Box>
                        )}

                        {!isSearchingUsers && availableUsers.length===0 && (
                          <Typography
                            sx={{ color: "#d32f2f", fontSize: "12px", mt: 0.5 }}
                          >
                            No QAs and Developers available
                          </Typography>
                        )}
                        
                      </Box>

                      {showUserDropdown && (
                        <Box
                          sx={{
                            position: "absolute",
                            zIndex: 1000,
                            backgroundColor: "white",
                            border: "1px solid #D0D5DD",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            minWidth: 250,
                            maxHeight: 200,
                            overflow: "auto",
                            mt: 1,
                          }}
                        >
                          {availableUsers.map((user) => (
                            <Box
                              key={user.id}
                              onClick={() => handleAddUser(user)}
                              sx={{
                                p: 1.5,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  width: "24px",
                                  height: "24px",
                                  borderRadius: "50%",
                                  backgroundColor: "#000000",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  fontSize: "12px",
                                  fontWeight: "bold",
                                }}
                              >
                                {user.name.charAt(0).toUpperCase()}
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {user.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "#666" }}
                                >
                                  {user.user_type}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}

                      {formErrors.assignedUsers && (
                        <Typography
                          sx={{ color: "#d32f2f", fontSize: "12px", mt: 0.5 }}
                        >
                          {formErrors.assignedUsers}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>

                {serverError && (
                  <Typography
                    sx={{
                      color: "#d32f2f",
                      fontSize: "14px",
                      mt: 2,
                      textAlign: "center",
                    }}
                  >
                    {serverError}
                  </Typography>
                )}
              </DialogContent>

              <DialogActions
                sx={{ justifyContent: "flex-start", px: 3, pb: 3, gap: 2 }}
              >
                <Button
                  variant="contained"
                  onClick={handleAdd}
                  sx={{
                    backgroundColor: "#007DFA",
                    color: "#FFFFFF",
                    width: "203px",
                    height: "56px",
                    textTransform: "none",
                    borderRadius: "5px",
                    fontWeight: 400,
                    fontSize: "18.32px",
                    padding: "16.28px",
                  }}
                >
                  Add
                </Button>
                <Button
                  onClick={handleClose}
                  sx={{
                    backgroundColor: "#D4D4D8",
                    color: "#27272A",
                    width: "203px",
                    height: "56px",
                    textTransform: "none",
                    borderRadius: "5px",
                    fontWeight: 400,
                    fontSize: "18.32px",
                    lineHeight: "100%",
                    px: 3,
                    py: 1,
                    border: "1px solid gray/300",
                  }}
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>

            {isSearching && (
              <Box sx={{ textAlign: "center", py: 2 }}>
                <Typography sx={{ color: "#6E6F72" }}>Searching...</Typography>
              </Box>
            )}

            {
              !isSearching &&
              projectsData.length === 0 && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography sx={{ color: "#6E6F72" }}>
                    No projects found
                  </Typography>
                </Box>
              )
            }

            {/* {!isSearching &&
              projectsData.length === 0 &&
              searchQuery.trim() !== "" && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography sx={{ color: "#6E6F72" }}>
                    No projects found matching &quot;{searchQuery}&quot;
                  </Typography>
                </Box>
              )} */}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "42px",
                marginBottom: "80px",
                marginTop: "34px"
              }}
            >
              {projectsData.map((item: Project) => (
                <Card
                  key={item.id}
                  sx={{
                    width: "360px",
                    height: "202px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "8.45px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    router.push(`/projects/${item.id}#${encodeURIComponent(item.name)}`);
                  }}
                >
                  <CardContent
                    sx={{
                      padding: "20px",
                      width: "360px",
                      height: "202px",
                      borderRadius: "8.45px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        textAlign: "left",
                        gap: "12px"
                      }}
                    >
                      <Box
                        sx={{
                          width: "57.04px",
                          height: "58.06px",
                          borderRadius: "4.22px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "16px",
                          position: "relative"
                        }}
                      >
                        <Image
                          src={projectImg}
                          alt={""}
                          fill
                          style={{ objectFit: "cover" }}
                          priority
                        />
                      </Box>

                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "14.79px",
                          color: "#000000",
                          lineHeight: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          width: "100%",
                        }}
                      >
                        {item.name}
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "12.67px",
                          color: "#87888C",
                          lineHeight: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          height: "19px",
                          width: "100%",
                        }}
                      >
                        {item.description || "empty"}
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: "12.67px",
                          lineHeight: "100%",
                          letterSpacing: "1%",
                          color: "#000000",
                        }}
                      >
                        Task Done:{" "}
                        <span style={{ fontWeight: 400 }}>
                          <strong>10/20</strong>
                        </span>
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <PaginationProjects
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}
