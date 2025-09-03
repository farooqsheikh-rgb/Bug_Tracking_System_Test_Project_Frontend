import * as React from "react";
import { TextField, styled, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const StyledTextField = styled(TextField)(({ theme }) => ({
  backgroundColor: "#F5F5F7",
  width: "443px",
  borderRadius: "6px",
  boxShadow: "none",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none", 
      color: "#3C4071"
    },
    "&.Mui-focused fieldset": {
      border: "3px solid #80BEFC",
      color: "#3C4071"
    },
    color: "#3C4071", 
  },
  "& input": {
    marginLeft: "19px",
    color: "#3C4071", 
  },
}));

export interface SignInputFieldsProps {
  icon: React.ReactNode;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>; 
}

export default function SignInputFields({
  icon,
  label,
  name,
  value,
  onChange,
  onKeyDown,
  inputProps,
}: SignInputFieldsProps) {
  const [focus, setFocus] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const shrinkLabel = name === "user_type" ? true : focus || Boolean(value);
  const isPasswordField = name === "password";

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <StyledTextField
      fullWidth
      id="outlined-basic"
      variant="outlined"
      label={label}
      name={name}
      value={value}
      type={isPasswordField && !showPassword ? "password" : "text"}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
      sx={{
        "& legend": {
          marginLeft: shrinkLabel ? "unset" : "59px",
          color: "#3C4071",
        },
      }}
      slotProps={{
        inputLabel: {
          shrink: shrinkLabel,
          sx: {
            marginLeft: shrinkLabel ? "unset" : "59px",
            color: "#3C4071",
          },
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment
            position="start"
            sx={{
              width: "20px",
              height: "20px",
              color: focus ? "#2F3367" : "#868AA5",
            }}
          >
            {icon}
          </InputAdornment>
        ),
        endAdornment: isPasswordField && (
          <InputAdornment position="end">
            <IconButton
              onClick={handleTogglePasswordVisibility}
              edge="end"
              size="small"
              sx={{ color: "#3C4071", marginRight: "8px" }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
