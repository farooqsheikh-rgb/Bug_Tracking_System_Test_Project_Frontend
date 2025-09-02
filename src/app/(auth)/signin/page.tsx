"use client";

import { useState } from "react";
import {
  Grid,
  Paper,
  styled,
  Typography,
  Box,
  Button,
  Link,
} from "@mui/material";
import Image from "next/image";
import signImg from "../../../../public/images/sign.jpg";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import SignInputFields from "@/app/components/SignInputFields/page";
import LockIcon from "@mui/icons-material/Lock";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRouter } from "next/navigation";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  padding: theme.spacing(0),
  textAlign: "center",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 0,
  boxShadow: "none",
  position: "relative",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  width: "176px",
  height: "70px",
  padding: "18.5px",
  justifyContent: "space-between",
  textTransform: "none",
  fontWeight: "600",
  fontSize: "22px",
  lineHeight: "100%",
  verticalAlign: "middle",
}));

export default function Signin() {
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const [serverError, setServerError] = useState("");

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
    const errors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formValues.email.trim()) {
      errors.email = "Email is required";
    } else if (/\s/.test(formValues.email)) {
      errors.email = "Email must not contain spaces";
    } else if (!emailRegex.test(formValues.email)) {
      errors.email = "Invalid email format";
    }

    if (!formValues.password.trim()) {
      errors.password = "Password is required";
    }

    setFormErrors({
      email: errors.email || "",
      password: errors.password || "",
    });

    return Object.keys(errors).length === 0;
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(data?.error || "Login failed");
        return;
      }

      router.push("/projects");
    } catch (err) {
      console.error("Login error:", err);
      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <Grid container spacing={0} style={{ height: "100vh", width: "1600px" }}>
      <Grid style={{ position: "relative", height: "100vh", width: "655px" }}>
        <Image
          src={signImg}
          alt="SignUp"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </Grid>

      <Grid style={{ width: "945px", height: "100vh" }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "443px",
            height: "484px",
            textAlign: "left",
            paddingTop: "222px",
            paddingLeft: "251px",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "30px",
              width: "443px",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                color: "#2F3367",
                fontSize: "28px",
              }}
            >
              Login
            </Typography>

            <Typography
              sx={{
                fontWeight: 500,
                color: "#8692A6",
                fontSize: "16px",
                lineHeight: "100%",
              }}
            >
              Please fill your information below
            </Typography>

            <SignInputFields
              icon={<MailOutlineIcon />}
              label="E-mail"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              onKeyDown={handleEmailKeyDown}
            />
            {formErrors.email && (
              <Typography sx={{ color: "red", fontSize: 13 }}>
                {formErrors.email}
              </Typography>
            )}

            <SignInputFields
              icon={<LockIcon />}
              label="Password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
            />
            {formErrors.password && (
              <Typography sx={{ color: "red", fontSize: 13 }}>
                {formErrors.password}
              </Typography>
            )}

            {serverError && (
              <Typography sx={{ color: "red", fontSize: 14 }}>
                {serverError}
              </Typography>
            )}

            <StyledButton
              type="submit"
              variant="contained"
              endIcon={<ChevronRightIcon sx={{ width: '33px', height: '33px' }}/>}
            >
              Login
            </StyledButton>

            <Box
              sx={{
                paddingTop: "30px",
                borderTop: "1px solid #ECECF0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#8692A6",
                  lineHeight: "100%",
                }}
              >
                Don’t have an account?
              </Typography>
              <Link
                href="/signup"
                sx={{
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#007DFA",
                  textDecoration: "none",
                  lineHeight: "100%"
                }}
              >
                Create account
              </Link>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
