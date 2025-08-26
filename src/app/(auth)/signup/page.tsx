"use client";
import { Grid, Paper, styled } from "@mui/material";
import Image from "next/image";
import signImg from "../../../../public/images/sign.jpg";
import UserTypeSelectionCard from "@/app/components/UserTypeSelectionCard/page";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import { VerifiedUser } from "@mui/icons-material";
import { UserTypeSelectionCardProps } from "../../../../interfaces/UserTypeSelectionCardProps";

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: "100%",
}));

const cardsData: UserTypeSelectionCardProps[] = [
  {
    icon: <PersonIcon />,
    title: "Manager",
    description: "Manager description here.",
  },
  {
    icon: <WorkIcon />,
    title: "Developer",
    description: "Developer description here.",
  },
  {
    icon: <VerifiedUser />,
    title: "QA",
    description: "QA description here.",
  },
];

export default function SignUp() {
  return (
    <Grid container spacing={0} style={{ height: "100vh" }}>
      <Grid size={4.5} style={{ position: "relative", height: "100vh" }}>
        <div>
          <Image
            src={signImg}
            alt="SignUp"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </Grid>

      <Grid size={7.5}>
        <Item
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <h1>Join Us!</h1>
            <p>
              To begin this journey, tell us what type of account you would be
              opening.
            </p>
            <div>
              {cardsData.map(({ icon, title, description }, idx) => (
                <UserTypeSelectionCard
                  key={idx}
                  icon={icon}
                  title={title}
                  description={description}
                />
              ))}
            </div>
          </div>
        </Item>
      </Grid>
    </Grid>
  );
}
