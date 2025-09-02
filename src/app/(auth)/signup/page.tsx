"use client";
import {
  Grid,
  Paper,
  styled,
  Typography,
  Box,
  Link,
} from "@mui/material";
import Image from "next/image";
import signImg from "../../../../public/images/Left.png";
import UserTypeSelectionCard from "@/app/components/UserTypeSelectionCard/page";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import { VerifiedUser } from "@mui/icons-material";
import { UserTypeSelectionCardProps } from "../../../../interfaces/UserTypeSelectionCardProps";
import userImg from "../../../../public/images/user.png";
import briefcaseImg from "../../../../public/images/briefcase.png";
import freelancerImg from "../../../../public/images/freelancer-freelance 1.png";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Item = styled(Paper)(({ theme }) => ({
  paddingTop: "265px",
  paddingLeft: "263px",
  width: "426px",
  backgroundColor: "#FFFFFF",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  boxShadow: "none",
}));

const cardsData: UserTypeSelectionCardProps[] = [
  {
    icon: userImg,
    title: "Manager",
    description: "Signup as a manager to manage the tasks and bugs",
    type: "manager",
  },
  {
    icon: briefcaseImg,
    title: "Developer",
    description: "Signup as a Developer to assign relevant task to QA",
    type: "developer",
  },
  {
    icon: freelancerImg,
    title: "QA",
    description: "Signup as a QA to create the bugs and report in tasks",
    type: "qa",
  },
];

export default function Signup() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>("manager");

  const handleCardSelect = (type: string) => {
    setSelectedType(type);
    router.push(`/signup/form?type=${type}`);
  };

  return (
    <Grid container spacing={0} style={{ height: "100vh" , width: "1600px"}}>
      <Grid style={{ position: "relative", height: "100vh", width: "655px" }}>
        <Image
          src={signImg}
          alt="SignUp"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </Grid>

      <Grid style={{width: "945px", height: "100vh"}}>
        <Box
            sx={{
              paddingTop: '36px',
              paddingLeft: '597px',
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

        <Item>
          <Box
            sx={{
              paddingTop: 0,
              paddingLeft: 0

            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                color: "#2F3367",
                fontSize: "28px",
                lineHeight: "100%",
              }}
            >
              Join Us!
            </Typography>

            <Box sx={{paddingTop: "7px", paddingLeft: 0}}>
              <Typography
                sx={{
                  fontWeight: 400,
                  color: "#8692A6",
                  marginBottom: 4,
                  fontSize: "16px",
                  lineHeight: "28px",
                  letterSpacing: "0%"
                }}
              >
                To begin this journey, tell us what type of account you&apos;d be
                opening.
              </Typography>
            </Box>
            
            <Box sx={{}}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "28px"}}>
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
          </Box>
        </Item>
      </Grid>
    </Grid>
  );
}
