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
import ImageIcon from "@mui/icons-material/Image";
import projectImg from "../../../public/images/folder.png";
import manageBugImg from "../../../public/images/manageBug.png";
import Image from "next/image";
import PaginationProjects from "../components/PaginationProjects/page";
import React, { useCallback, useEffect, useState } from "react";
import { Project } from "@/type/Project";
import { useRouter } from "next/navigation";

export default function Projects() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [projectsData, setProjectsData] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  // Sorting and pagination state
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(9);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // Reset form values and errors when closing
    setFormValues({ name: "", description: "" });
    setFormErrors({ name: "", description: "" });
    setServerError("");
  };

  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
  }); 

  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
  });

  const fetchProjects = async (searchTerm: string) => {
    try {
      setIsSearching(true);
      let url = "/api/projects";
      
      if (searchTerm.trim() !== "") {
        url += `?name=${encodeURIComponent(searchTerm.trim())}`;
      }

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error("Search error:", data.error || "Failed to search projects");
        return;
      }

      setProjectsData(data.data || []);
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedFetchProjects = useCallback(
    debounce((nextValue: string) => fetchProjects(nextValue), 300),
    []
  );

  useEffect(() => {
    debouncedFetchProjects(searchQuery);
  }, [searchQuery, debouncedFetchProjects]);

  // Initial load of all projects
  useEffect(() => {
    fetchProjects("");
  }, []);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // For now, just update the page number
    // You can implement the actual API call here later
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

  const validateForm = () => {
    const errors: { name?: string; description?: string } = {};

    if (!formValues.name.trim()) {
      errors.name = "Project name is required";
    }
    if (!formValues.description.trim()) {
      errors.description = "Short details are required";
    }

    setFormErrors({
      name: errors.name || "",
      description: errors.description || "",
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

      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(data?.error || "Failed to add project");
        return;
      }

      // Close modal and refresh projects list
      handleClose();
      // Refresh the projects list
      fetchProjects(searchQuery);
    } catch (err) {
      console.error("Add project error:", err);
      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        padding: "32px 80px",
        backgroundColor: "#F5F6F8",
        minHeight: "100vh",
      }}
    >
      <ResponsiveAppBar />

      <Box sx={{ maxWidth: "xl", margin: "20px auto" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "40px",
            borderLeft: "4px solid #50A885",
            borderBottom: "1px solid #ECECEE",
            paddingBottom: "20px",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
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
            }}
          >
            Add New Project
          </Button>

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

          <IconButton
            sx={{
              width: "48px",
              height: "48px",
            }}
          >
            <Image
              src={manageBugImg}
              alt={"ManageBug"}
              fill
              style={{ objectFit: "cover" }}
              priority
            ></Image>
          </IconButton>
        </Box>

        {/* Add New Project Modal */}
        <Dialog 
          open={open} 
          onClose={handleClose} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ 
                textAlign: "left",
                fontWeight: 600,
                fontSize: "18px",
                color: "#000000"
              }}
            >
              Add new Project
            </Typography>
          </DialogTitle>
          
          <DialogContent sx={{ pt: 2 }}>
            <Box sx={{ display: "flex", gap: 3 }}>
              {/* Left Column - Input Fields */}
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 500, 
                      color: "#000000",
                      mb: 1,
                      fontSize: "14px"
                    }}
                  >
                    Project name
                  </Typography>
                  <TextField
                    fullWidth
                    name="name"
                    variant="outlined"
                    placeholder="Enter project name"
                    value={formValues.name}
                    onChange={handleChange}
                    error={!!formErrors.name}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                        "& fieldset": {
                          borderColor: formErrors.name ? "#d32f2f" : "#E0E0E0",
                        },
                        "&:hover fieldset": {
                          borderColor: formErrors.name ? "#d32f2f" : "#BDBDBD",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: formErrors.name ? "#d32f2f" : "#007DFA",
                        },
                      },
                    }}
                  />
                  {formErrors.name && (
                    <Typography sx={{ color: "#d32f2f", fontSize: "12px", mt: 0.5 }}>
                      {formErrors.name}
                    </Typography>
                  )}
                </Box>
                
                <Box>
                  <Typography 
                    variant="subtitle1"
                    sx={{ 
                      fontWeight: 500, 
                      color: "#000000",
                      mb: 1,
                      fontSize: "14px"
                    }}
                  >
                    Short details
                  </Typography>
                  <TextField
                    fullWidth
                    name="description"
                    variant="outlined"
                    placeholder="Enter details here"
                    value={formValues.description}
                    onChange={handleChange}
                    error={!!formErrors.description}
                    multiline
                    minRows={3}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "5px",
                        "& fieldset": {
                          borderColor: formErrors.description ? "#d32f2f" : "#E0E0E0",
                        },
                        "&:hover fieldset": {
                          borderColor: formErrors.description ? "#d32f2f" : "#BDBDBD",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: formErrors.description ? "#d32f2f" : "#007DFA",
                        },
                      },
                    }}
                  />
                  {formErrors.description && (
                    <Typography sx={{ color: "#d32f2f", fontSize: "12px", mt: 0.5 }}>
                      {formErrors.description}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Right Column - Image Upload Area */}
              <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box
                  sx={{
                    width: "200px",
                    height: "200px",
                    border: "2px dashed #E0E0E0",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "#007DFA",
                      backgroundColor: "#F8F9FA",
                    },
                  }}
                >
                  <ImageIcon 
                    sx={{ 
                      fontSize: "48px", 
                      color: "#6E6F72",
                      mb: 1
                    }} 
                  />
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: "#6E6F72",
                      textAlign: "center",
                      fontWeight: 500,
                    }}
                  >
                    Upload project photo
                  </Typography>
                </Box>
              </Box>
            </Box>

            {serverError && (
              <Typography sx={{ color: "#d32f2f", fontSize: "14px", mt: 2, textAlign: "center" }}>
                {serverError}
              </Typography>
            )}
          </DialogContent>
          
          <DialogActions sx={{ justifyContent: "flex-start", px: 3, pb: 3, gap: 2 }}>
            <Button 
              variant="contained" 
              onClick={handleAdd}
              sx={{
                backgroundColor: "#007DFA",
                color: "#FFFFFF",
                textTransform: "none",
                borderRadius: "5px",
                fontWeight: 500,
                fontSize: "14px",
                px: 3,
                py: 1,
                "&:hover": {
                  backgroundColor: "#0056CC",
                },
              }}
            >
              Add
            </Button>
            <Button 
              onClick={handleClose}
              sx={{
                color: "#6E6F72",
                textTransform: "none",
                borderRadius: "5px",
                fontWeight: 500,
                fontSize: "14px",
                px: 3,
                py: 1,
                border: "1px solid #E0E0E0",
                "&:hover": {
                  backgroundColor: "#F5F5F5",
                  borderColor: "#BDBDBD",
                },
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Search Results or All Projects */}
        {isSearching && (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography sx={{ color: "#6E6F72" }}>
              Searching...
            </Typography>
          </Box>
        )}

        {!isSearching && projectsData.length === 0 && searchQuery.trim() !== "" && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography sx={{ color: "#6E6F72" }}>
              No projects found matching &quot;{searchQuery}&quot;
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "34px",
            marginBottom: "40px",
          }}
        >
          {projectsData.map((item: Project) => (
            <Card
              key={item.id}
              sx={{
                backgroundColor: "#FFFFFF",
                borderRadius: "8.45px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                cursor: "pointer",
              }}
              onClick={() => {
                router.push(`/projects/${item.id}`);
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
                      position: "relative",
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
                      marginBottom: "8px",
                      lineHeight: 1.3,
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
                      marginBottom: "12px",
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
        />
      </Box>
    </Box>
  );
}