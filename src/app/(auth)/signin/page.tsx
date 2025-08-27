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
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SignInputFields from "@/app/components/SignInputFields/page";
import LockIcon from '@mui/icons-material/Lock'; 
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

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
  borderRadius: '8px',
  width: '203px',
  height: '70px',
  paddingLeft: '20px',
  paddingRight: '20px',
  justifyContent: 'space-between', 
  textTransform: 'none', 
  fontWeight: '600',     
  fontSize: '22px',
  lineHeight: '100%',
  verticalAlign: 'middle'
}));

export default function Signin() {
  const [formValues, setFormValues] = useState({
    name: "",
    email:"",
    password:""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  return (
    <Grid container spacing={0} style={{ height: "100vh" }}>
      <Grid size={4.5} style={{ position: "relative", height: "100vh" }}>
        <Image
          src={signImg}
          alt="SignIn"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </Grid>
    
      <Grid size={7.5}>
        <Item>
          <Box sx={{ marginTop: "40px", textAlign: "left" }}>
            <Typography
              sx={{
                width: "109px",
                height: "42px",
                fontWeight: 700,
                color: "#2F3367",
                marginBottom: 2,
                fontSize: "28px",
              }}
            >
              Login
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Typography
                sx={{
                  fontWeight: 500,
                  color: "#8692A6",
                  fontSize: "16px",
                  lineHeight: "28px",
                  width: "267px",
                  height: "24px"
                }}
              >
                Please fill your information below
              </Typography>

              <SignInputFields
                icon={<MailOutlineIcon />}
                label="Email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
              />
              <SignInputFields
                icon={<LockIcon />}
                label="Password"
                name="password"
                value={formValues.password}
                onChange={handleChange}
              />

              <StyledButton variant="contained" endIcon={<ChevronRightIcon />}>
                Login
              </StyledButton>
              
            </Box>
            <Box sx={{ marginTop:"20px",paddingTop:"20px", borderTop:"1px solid #ECECF0", display: "flex", flexDirection: "row", justifyContent:"space-between", alignItems:"center" }}>
                <Typography
              sx={{
                fontWeight: 500,
                fontSize: "16px",
                lineHeight: "100%",
                letterSpacing: "0%",
                verticalAlign: "middle",
                color: "#8692A6"
              }}
            >
              Don’t have an account account?{" "}
            </Typography>
             <Link 
                href="/signup" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#007DFA", 
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline"
                  }
                }}
              >
                Create account
              </Link>
            </Box>
          </Box>
        </Item>
      </Grid>
    </Grid>
  );
}
