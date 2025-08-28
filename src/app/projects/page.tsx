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
} from "@mui/material";
import ResponsiveAppBar from "../navbar";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import projectImg from "../../../public/images/folder.png";
import manageBugImg from "../../../public/images/manageBug.png";
import Image from "next/image";
import PaginationProjects from "../components/PaginationProjects/page";
import React from "react";

export default function Projects() {
  const data = [
    {
      id: 1,
      icon: projectImg,
      name: "Android UI System",
      description: "Redesign all the web pages with animation.",
      completedTasks: "02",
      totalTask: "56",
    },
    {
      id: 2,
      icon: projectImg,
      name: "Meeting Hub Website",
      description: "Redesign all the web pages with animation.",
      completedTasks: "06",
      totalTask: "56",
    },
    {
      id: 3,
      icon: projectImg,
      name: "Dribbble Presentation",
      description: "Redesign all the web pages with animation.",
      completedTasks: "08",
      totalTask: "56",
    },
    {
      id: 4,
      icon: projectImg,
      name: "Pixels Design studio",
      description: "Redesign all the web pages with animation.",
      completedTasks: "18",
      totalTask: "56",
    },
    {
      id: 5,
      icon: projectImg,
      name: "Tubik Presentation",
      description: "Redesign all the web pages with animation.",
      completedTasks: "25",
      totalTask: "56",
    },
  ];

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
            sx={{
              backgroundColor: "#007DFA",
              color: "#FFFFFF",
              textTransform: "none",
              borderRadius: "5px",
              padding: "12px 20px",
              fontWeight: 500,
              fontSize: "14px",
              width: "163px",
              height: "45px",
            }}
          >
            Add New Bug
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

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "34px",
            marginBottom: "40px",
          }}
        >
          {data.map((item) => (
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
                      src={item.icon}
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
                    {item.description}
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
                    <span style={{ fontWeight: 400}}>
                      <strong>
                        {item.completedTasks}/{item.totalTask}
                      </strong>
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
