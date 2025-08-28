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

export default function PaginationProjects() {
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
          <Typography
            sx={{
              color: "#6C757D",
              fontSize: "14px",
              fontWeight: "400",
              lineHeight: "22px",
            }}
          >
            Display
          </Typography>
          <FormControl>
            <Select
              value="10"
              IconComponent={KeyboardArrowDownIcon}
              sx={{
                borderRadius: "4px",
                fontSize: "14px",
                height: "30px",
              }}
            >
              <MenuItem value="10">10</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <IconButton
              sx={{
                backgroundColor: "#DFDFDF",
                color: "#343A40",
                width: "30px",
                height: "30px",
                borderRadius: "2px",
              }}
            >
              <KeyboardArrowDownIcon
                sx={{ transform: "rotate(90deg)", fontSize: "20px" }}
              />
            </IconButton>

            <Box sx={{ display: "flex", gap: "4px" }}>
              {[1, 2, 3, 4].map((page) => (
                <Button
                  key={page}
                  variant={page === 1 ? "contained" : "text"}
                  size="small"
                  sx={{
                    minWidth: "30px",
                    height: "30px",
                    borderRadius: "4px",
                    backgroundColor: page === 1 ? "#007DFA" : "transparent",
                    color: page === 1 ? "#FFFFFF" : "#6C757D",
                    fontWeight: 400,
                    fontSize: "14px",
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <IconButton
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
