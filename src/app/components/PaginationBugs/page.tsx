import {
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React from "react";

export default function PaginationProjects() {
  const [rowsPerPage, setRowsPerPage] = React.useState("5");

  const handleRowsPerPageChange = (event: SelectChangeEvent) => {
    setRowsPerPage(event.target.value);
  };
  return (
    <Box
      sx={{
        padding: "20px 0",
        backgroundColor: "#FFFFFF",
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 280px",
        }}
      >
        <Typography
          sx={{
            color: "#6C757D",
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "22px",
          }}
        >
          Showing 1 to 10 of 50 entries
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Typography
              sx={{ fontSize: "14px", color: "#3A3541AD", fontWeight: "400" }}
            >
              Rows per page:
            </Typography>
            <FormControl
              variant="outlined"
              sx={{ minWidth: "38px", height: "24px" }}
            >
              <Select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                sx={{
                  fontSize: "14px",
                  height: "24px",
                  color: "#3A3541DE",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              >
                <MenuItem value="5">5</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Typography sx={{ fontSize: "14px", color: "#3A3541DE", fontWeight: "400", lineHeight: "143%", letterSpacing: "0.15px" }}>
              1-5 of 6
            </Typography>

            <IconButton
              sx={{
                color: "#3A35418A",
                width: "7.41px", 
                height: "12px"
              }}
            >
              <KeyboardArrowDownIcon
                sx={{ fontSize: "18px", transform: "rotate(90deg)" }}
              />
            </IconButton>

            <IconButton
              sx={{
                color: "#3A35418A",
                width: "7.41px", 
                height: "12px"
              }}
            >
              <KeyboardArrowDownIcon
                sx={{ fontSize: "18px", transform: "rotate(270deg)" }}
              />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
