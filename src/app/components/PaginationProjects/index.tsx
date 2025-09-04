"use client";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface PaginationProjectsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export default function PaginationProjects({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}: PaginationProjectsProps) {
  const startItem = totalItems > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0;
  const endItem = totalItems > 0 ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

  return (
    <Box
      sx={{
        padding: "19px 0",
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
          padding: "0 221px",
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

        <Box sx={{ display: "flex", alignItems: "center",}}>
          <Typography
            sx={{
              color: "#6C757D",
              fontSize: "14px",
              fontWeight: "400",
              lineHeight: "22px",
              letterSpacing: "0%",
              paddingRight: "5px"
            }}
          >
            Display
          </Typography>
          <FormControl>
            <Select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange?.(Number(e.target.value))}
              IconComponent={KeyboardArrowDownIcon}
              sx={{
                borderRadius: "4px",
                fontSize: "14px",
                height: "30px",
                border: "1px solid #DFDFDF",
              }}
            >
              <MenuItem value={9} sx={{padding: "0 10px", lineHeight: "22px", fontWeight: 400, fontSize: "14px"}}>9</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <IconButton
              onClick={() => onPageChange(currentPage - 1)}
              // disabled={currentPage === 1}
              sx={{
                backgroundColor: "#DFDFDF",
                color: "#343A40",
                width: "30px",
                height: "30px",
                borderRadius: "2px",
                marginLeft: "40px"
              }}
            >
              <KeyboardArrowDownIcon
                sx={{ transform: "rotate(90deg)", fontSize: "20px" }}
              />
            </IconButton>

            <Box sx={{ display: "flex", gap: "10px" }}>
              {totalPages > 0 && Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "contained" : "text"}
                    size="small"
                    onClick={() => onPageChange(pageNum)}
                    sx={{
                      minWidth: "30px",
                      height: "30px",
                      borderRadius: "4px",
                      backgroundColor: pageNum === currentPage ? "#007DFA" : "transparent",
                      color: pageNum === currentPage ? "#FFFFFF" : "#6C757D",
                      fontWeight: 400,
                      fontSize: "14px",
                    }}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </Box>

            <IconButton
              onClick={() => onPageChange(currentPage + 1)}
              // disabled={currentPage === totalPages}
              sx={{
                backgroundColor: "#DFDFDF",
                color: "#343A40",
                width: "30px",
                height: "30px",
                borderRadius: "2px",
              }}
            >
              <KeyboardArrowDownIcon
                sx={{ transform: "rotate(-90deg)", fontSize: "20px" }}
              />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
