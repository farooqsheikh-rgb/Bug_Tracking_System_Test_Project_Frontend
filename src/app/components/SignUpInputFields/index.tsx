import * as React from "react";
import { TextField, styled, InputAdornment, InputLabel } from "@mui/material";

const StyledTextField = styled(TextField)(({ theme }) => ({
  backgroundColor: "#F5F5F7",
  width: "443px",
  borderRadius: "6px",
  boxShadow: "none",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "3px solid #80BEFC",
    },
    color: "#3C4071",
  },
  "& input": {
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
  return (
    <StyledTextField
      fullWidth
      variant="outlined"
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      slotProps={{
        inputLabel: {
          shrink: false,
        }
      }}
      inputProps={inputProps}
      InputProps={{
        startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
      }}
    />
  );
}
