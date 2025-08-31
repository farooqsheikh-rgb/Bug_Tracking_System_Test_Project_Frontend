"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Avatar from "@mui/material/Avatar";
import { Grid, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isSelected'
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  width: "426px",
  height: "108px",
  top: "405px",
  left: "918px",
  border: isSelected ? "1px solid #007DFA" : "1px solid #F5F5F7",
  borderRadius: "6px",
  boxShadow: "none",
  transition: "all 0.2s ease-in-out",
  backgroundColor: "#FFFFFF",
  "&:hover": {
    borderColor: "#3B82F6",
  },
}));

const StyledAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'isSelected'
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  backgroundColor: isSelected ? "#007DFA" : "#F1F5F9",
  width: "52px",
  height: "52px",
  borderRadius: "30px",
  color: isSelected ? "#F1F5F9" : "#007DFA",
}));

export interface UserTypeSelectionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  type: string;
  isSelected: boolean;
  onSelect: () => void;
}

export default function UserTypeSelectionCard({
  icon,
  title,
  description,
  type,
  isSelected,
  onSelect,
}: UserTypeSelectionCardProps) {
  return (
    <StyledCard isSelected={isSelected}>
      <CardActionArea onClick={onSelect} sx={{ height: "100%" }}>
        <CardContent sx={{ p: 3, height: "100%" }}>
          <Grid container spacing={0} alignItems="center" sx={{ height: "100%" }}>
            <Grid size={3}>
              <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%"
              }}>
                <StyledAvatar isSelected={isSelected}>
                  {icon}
                </StyledAvatar>
              </Box>
            </Grid>

            <Grid size={6}>
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%",
                textAlign: "left"
              }}>
                <Typography
                  sx={{
                    color: "#2F3367",
                    fontWeight: 500,
                    fontSize: "16px",
                    lineHeight: "100%",
                    marginBottom: 1,
                  }}
                >
                  {title}
                </Typography>
                <Typography
                  sx={{
                    color: "#8692A6",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "100%",
                  }}
                >
                  {description}
                </Typography>
              </Box>
            </Grid>

            <Grid size={3}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%"
                }}
              >
                {isSelected && (
                  <ChevronRightIcon 
                    sx={{ 
                      color: "#007DFA", 
                      fontSize: 24 
                    }} 
                  />
                )}
              </Box>

            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </StyledCard>
  );
} 