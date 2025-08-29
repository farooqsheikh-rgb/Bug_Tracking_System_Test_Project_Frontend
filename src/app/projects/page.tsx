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
import manageBugImg from "../../../public/images/manageBug.png";
import Image from "next/image";
import PaginationProjects from "../components/PaginationProjects/page";
import React, { useCallback, useEffect, useState } from "react";
import { Project } from "@/type/Project";
import axios from "axios";

type ProjectType = {
  id: number;
  name: string;
  // add other fields as needed
};


export default function Projects() {
  const [serverError, setServerError] = useState("");
  const [projectsData, setProjectsData] = useState([]);
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
const [searchResults, setSearchResults] = useState<ProjectType[]>([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
  });

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const fetchProjects = async (searchTerm:string) => {
    try {
      const response = await axios.get("/api/v1/projects/search", {
        params: { name: searchTerm },
      });
      setSearchResults(response.data);
    } catch (err) {
      console.error("Search error", err);
    }
  };

  const debouncedFetchProjects = useCallback(
    debounce((nextValue) => fetchProjects(nextValue), 300),
    []
  );

  useEffect(() => {
    if (query.trim() !== "") {
      debouncedFetchProjects(query);
    } else {
      setSearchResults([]);
    }
  }, [query]);

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
      errors.name = "Name is required";
    }
    if (!formValues.description.trim()) {
      errors.description = "Description is required";
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
        body: JSON.stringify(formValues),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(data?.error || "Login failed");
        return;
      }
    } catch (err) {
      console.error("Login error:", err);
      setServerError("Something went wrong. Please try again.");
    }
    handleClose();
  };


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setServerError(data.error || "Failed to fetch projects");
          return;
        }

        setProjectsData(data.data);
      } catch (err) {
        setServerError("Something went wrong.");
        console.error(err);
      }
    };

    fetchProjects();
  },[]);

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
        value={query}
        onChange={(e) => setQuery(e.target.value)}
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

          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
              <Typography
                variant="h6"
                component="div"
                sx={{ textAlign: "left" }}
              >
                Add New Project
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box>
                  <Typography variant="subtitle1">Project Name</Typography>
                  <TextField
                    fullWidth
                    name="name"
                    variant="outlined"
                    value={formValues.name}
                    onChange={handleChange}
                  />
                  {formErrors.name && (
                    <Typography sx={{ color: "red", fontSize: 13 }}>
                      {formErrors.name}
                    </Typography>
                  )}
                </Box>
                <Box>
                  <Typography variant="subtitle1">
                    Project Description
                  </Typography>
                  <TextField
                    fullWidth
                    name="description"
                    variant="outlined"
                    multiline
                    minRows={3}
                    value={formValues.description}
                    onChange={handleChange}
                  />
                  {formErrors.description && (
                    <Typography sx={{ color: "red", fontSize: 13 }}>
                      {formErrors.description}
                    </Typography>
                  )}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "flex-start", px: 3, pb: 2 }}>
              <Button variant="contained" onClick={handleAdd}>
                Add
              </Button>
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </Dialog>

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

<ul>
        {searchResults.map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
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
                window.location.href = `/projects/${item.id}`;
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

        <PaginationProjects />
      </Box>
    </Box>
  );
}
