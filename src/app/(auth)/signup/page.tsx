"use client";
import {
  Grid,
  Paper,
  styled,
  Typography,
  Box,
  Link,
  Button,
} from "@mui/material";
import Image from "next/image";
import signImg from "../../../../public/images/sign.jpg";
import UserTypeSelectionCard from "@/app/components/UserTypeSelectionCard/page";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import { VerifiedUser } from "@mui/icons-material";
import { UserTypeSelectionCardProps } from "../../../../interfaces/UserTypeSelectionCardProps";
import { useState } from "react";

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

const cardsData: UserTypeSelectionCardProps[] = [
  {
    icon: <PersonIcon />,
    title: "Manager",
    description: "Signup as a manager to manage the tasks and bugs",
    type: "manager",
  },
  {
    icon: <WorkIcon />,
    title: "Developer",
    description: "Signup as a Developer to assign relevant task to QA",
    type: "developer",
  },
  {
    icon: <VerifiedUser />,
    title: "QA",
    description: "Signup as a QA to create the bugs and report in tasks",
    type: "qa",
  },
];

export default function Signup() {
  const [selectedType, setSelectedType] = useState<string>("manager");

  const handleCardSelect = (type: string) => {
    setSelectedType(type);
  };

  return (
    <Grid container spacing={0} style={{ height: "100vh" }}>
      <Grid size={4.5} style={{ position: "relative", height: "100vh" }}>
        <Image
          src={signImg}
          alt="SignUp"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </Grid>

      <Grid size={7.5}>
        <Item>
          <Box
            sx={{
              position: "absolute",
              width: 315,
              height: 28,
              top: 36,
              left: 750,
              zIndex: 1,
            }}
          >
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontWeight: 500,
                fontStyle: "normal",
                fontSize: "18px",
                lineHeight: "28px",
                letterSpacing: "0%",
                textAlign: "right",
                verticalAlign: "middle",
                color: "#64748B",
              }}
            >
              Already have an account?{" "}
              <Link
                href="/signin"
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: 500,
                  fontSize: "18px",
                  lineHeight: "28px",
                  letterSpacing: "0%",
                  color: "#3B82F6",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>

          <Box
            sx={{
              marginTop: "40px",
              textAlign: "left",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                color: "#2F3367",
                marginBottom: 2,
                fontSize: "28px",
                lineHeight: "100%",
              }}
            >
              Join Us!
            </Typography>

            <Typography
              sx={{
                fontWeight: 400,
                color: "#8692A6",
                marginBottom: 4,
                fontSize: "16px",
                lineHeight: "28px",
                width: "426px",
              }}
            >
              To begin this journey, tell us what type of account you&apos;d be
              opening.
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {cardsData.map(({ icon, title, description, type }, idx) => (
                <UserTypeSelectionCard
                  key={idx}
                  icon={icon}
                  title={title}
                  description={description}
                  type={type}
                  isSelected={selectedType === type}
                  onSelect={() => handleCardSelect(type)}
                />
              ))}
            </Box>
          </Box>
        </Item>
      </Grid>
    </Grid>
  );
}
