"use client";
import * as React from "react";
import Image from "next/image";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import arrowImg from "../../../../public/images/arrow-right.png";

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isSelected'
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  width: "426px",
  height: "108px",
  border: isSelected ? "1px solid #007DFA" : "1px solid #F5F5F7",
  borderRadius: "6px",
  boxShadow: "none",
  backgroundColor: "#FFFFFF",
}));

const StyledAvatar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelected'
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  backgroundColor: isSelected ? "#007DFA" : "#FFFFFF",
  width: "52px",
  height: "52px",
  border: "1px solid #007DFA",
  borderRadius: "30px",
  color: isSelected ? "#F1F5F9" : "#007DFA",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const IconWrapper = styled('div')({
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export interface UserTypeSelectionCardProps {
  icon: any;
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
      <CardActionArea onClick={onSelect} sx={{ paddingLeft: 0, height: "100%" }}>
        <CardContent
          sx={{
            paddingLeft: 0,
            height: "100%",
            display: "flex",
            alignItems: "center",    
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              width: "108px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <StyledAvatar isSelected={isSelected}>
              <Image
                src={icon}
                alt=""
                style={{ height: "20px", width: "20px", paddingLeft: 0 }}
              />
            </StyledAvatar>
          </Box>

          <Box
            sx={{
              width: "265px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "left",
            }}
          >
            <Typography
              sx={{
                color: "#2F3367",
                fontWeight: 500,
                fontSize: "16px",
                lineHeight: "100%",
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

          <Box
            sx={{
              width: "53px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isSelected && (
              <Image
                src={arrowImg}
                alt=""
                style={{ height: "20px", width: "20px", paddingLeft: 0 }}
              />
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </StyledCard>
  );
}
