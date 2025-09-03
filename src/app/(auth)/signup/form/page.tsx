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
import signImg from "../../../../../public/images/sign.jpg";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import SignInputFields from "@/app/components/SignInputFields";
import LockIcon from "@mui/icons-material/Lock";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useSearchParams, useRouter } from "next/navigation";
import { CONSTANTS } from "@/app/constants";

const StyledButton = styled(Button)(() => ({
  borderRadius: "8px",
  width: "203px",
  height: "70px",
  paddingLeft: "20px",
  paddingRight: "20px",
  justifyContent: "space-between",
  textTransform: "none",
  fontWeight: 600,
  fontSize: "22px",
  lineHeight: "100%",
  verticalAlign: "middle",
}));

export default function SignupForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialType = searchParams.get("type") || "manager";

  const displayUserType =
    initialType.toLowerCase() === "qa" ? "QA" : initialType;

  const [formValues, setFormValues] = useState({
    name: "",
    user_type: displayUserType,
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [serverError, setServerError] = useState("");

  const nameRegex = /^[A-Za-z]+( [A-Za-z]+)*$/;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validatePassword(pw: string) {
    if (pw.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(pw))
      return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(pw))
      return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(pw)) return "Password must contain at least one digit";
    if (!/[^A-Za-z0-9]/.test(pw))
      return "Password must contain at least one special character";
    return "";
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "user_type") return;

    setFormValues((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  const validateForm = () => {
    const errors: any = {};

    if (!formValues.name.trim()) errors.name = "Name is required";
    else if (!nameRegex.test(formValues.name))
      errors.name =
        "Name must contain only letters and single spaces between words";

    if (!formValues.email.trim()) errors.email = "Email is required";
    else if (/\s/.test(formValues.email))
      errors.email = "Email must not contain spaces";
    else if (!emailRegex.test(formValues.email))
      errors.email = "Invalid email format";

    if (!formValues.password.trim()) errors.password = "Password is required";
    else {
      const pwError = validatePassword(formValues.password);
      if (pwError) errors.password = pwError;
    }

    setFormErrors(errors);
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

    let sendUserType = formValues.user_type.toLowerCase();
    if (sendUserType === "qa") sendUserType = "QA";

    const postData = {
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      password: formValues.password,
      user_type: sendUserType,
    };

    try {
      const res = await fetch(CONSTANTS.SIGNUP_API_URL, {
        method: CONSTANTS.POST_METHOD,
        headers: { "Content-Type": CONSTANTS.CONTENT_TYPE_APPLICATION_JSON },
        body: JSON.stringify(postData),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(data.error || CONSTANTS.SIGNUP_FAILED);
        return;
      }

      router.push(CONSTANTS.PROJECTS_PAGE_URL);
    } catch (err) {
      console.error(err);
      setServerError(CONSTANTS.SERVER_ERROR_MESSAGE);
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
        {" "}
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
          
          <Box sx={{ display: "flex", flexDirection: "column", gap: "30px", width: "443px", height: "672px" }}>
            <Typography
            sx={{ fontWeight: 700, color: "#2F3367", fontSize: "28px", lineHeight: "100%" }}
          >
            Sign Up
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
              icon={<PersonIcon />}
              label="Name"
              name="name"
              value={formValues.name}
              onChange={handleChange}
            />
            {formErrors.name && (
              <Typography sx={{ color: "red", fontSize: 13 }}>
                {formErrors.name}
              </Typography>
            )}

            <SignInputFields
              icon={<WorkIcon />}
              label="User Type"
              name="user_type"
              value={formValues.user_type}
              onChange={() => {}}
              inputProps={{ readOnly: true, style: { cursor: "not-allowed" } }}
            />

            <SignInputFields
              icon={<MailOutlineIcon />}
              label="Email"
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
              inputProps={{ type: "password" }}
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
              Sign Up
            </StyledButton>

            <Box
            sx={{
              pt: "30px",
              borderTop: "1px solid #ECECF0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ fontWeight: 500, fontSize: "16px", color: "#8692A6" }}
            >
              Already have an account?
            </Typography>
            <Link
              href="/signin"
              sx={{
                fontWeight: 600,
                fontSize: "16px",
                color: "#007DFA",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Login to your account
            </Link>
          </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
