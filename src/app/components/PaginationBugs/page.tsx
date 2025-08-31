"use client";
import {
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React from "react";

interface PaginationBugsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export default function PaginationBugs({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}: PaginationBugsProps) {
  const startItem = totalItems > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0;
  const endItem = totalItems > 0 ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

  const handleRowsPerPageChange = (event: SelectChangeEvent) => {
    onItemsPerPageChange?.(Number(event.target.value));
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
          Showing {startItem} to {endItem} of {totalItems} entries
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
                value={itemsPerPage.toString()}
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
              {startItem}-{endItem} of {totalItems}
            </Typography>

            <IconButton
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              sx={{
                color: currentPage === 1 ? "#3A35418A" : "#3A35418A",
                width: "7.41px", 
                height: "12px",
                opacity: currentPage === 1 ? 0.5 : 1,
              }}
            >
              <KeyboardArrowDownIcon
                sx={{ fontSize: "18px", transform: "rotate(90deg)" }}
              />
            </IconButton>

            <IconButton
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              sx={{
                color: currentPage === totalPages ? "#3A35418A" : "#3A35418A",
                width: "7.41px", 
                height: "12px",
                opacity: currentPage === totalPages ? 0.5 : 1,
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
