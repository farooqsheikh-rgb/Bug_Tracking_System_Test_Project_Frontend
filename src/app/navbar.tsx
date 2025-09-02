"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Divider } from "@mui/material";
import Image from "next/image";
import { usePathname } from "next/navigation";
import manageBugImg from "../../public/images/Group.png";
import bagImg from "../../public/images/Bag.png";
import categoryImg from "../../public/images/Category.png";
import solidImg from "../../public/images/Solid.png";
import profileImg from "../../public/images/Profile.png";
import notificationImg from "../../public/images/Notification.png";
import messageImg from "../../public/images/Message.png";
import ellipseImg from "../../public/images/Ellipse 11.png";

const pages = [
  { name: "Projects", icon: categoryImg, path: "/projects" },
  { name: "Tasks", icon: bagImg, path: "/projects/[id]" },
  { name: "Manage", icon: solidImg, path: "/" },
  { name: "Users", icon: profileImg, path: "/" },
];

function ResponsiveAppBar() {
  const pathname = usePathname();

  const getActivePage = (pagePath: string, pageName: string) => {
    if (pageName === "Tasks" && pathname.includes("/bugs")) return true;
    if (pageName === "Projects" && pathname === "/projects") return true;
    return pathname === pagePath;
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "transparent",
        color: "black",
        boxShadow: "none",
        width: "1165px",
        height: "182px",
        paddingTop: "37px",
        marginLeft: "221px",
      }}
    >
      <Box sx={{ width: "100%", height: "100%" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 0,
            paddingBottom: 0,
            height: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", }}>
            <Box sx={{ display: "flex", alignItems: "center",  gap: "6.92px" }}>
              <Box
                sx={{
                  width: 31,
                  height: 31,
                  position: "relative",
                }}
              >
                <Image
                  src={manageBugImg}
                  alt="ManageBug"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "19.17px",
                  lineHeight: "100%",
                  letterSpacing: "1%",
                  color: "#030303",
                }}
              >
                Manage
                <span
                  style={{
                    fontWeight: 100,
                    color: "#030303",
                    fontSize: "19.17px",
                    lineHeight: "100%",
                    letterSpacing: "1%",
                  }}
                >
                  Bug
                </span>
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: "46px" , paddingLeft: "206.47px"}}>
              {pages.map((page) => {
                const isActive = getActivePage(page.path, page.name);

                return (
                  <Button
                    key={page.name}
                    startIcon={
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          position: "relative",
                        }}
                      >
                        <Image
                          src={page.icon}
                          alt={page.name}
                          fill
                          style={{ objectFit: "cover" }}
                          priority
                        />
                      </Box>
                    }
                    sx={{
                      color: isActive ? "#2F3367" : "#787486",
                      display: "flex",
                      alignItems: "center",
                      textTransform: "none",
                      fontSize: "12px",
                      fontWeight: 500
                    }}
                  >
                    {page.name}
                  </Button>
                );
              })}
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "42px", paddingLeft: "117px" }}>
            <Box sx={{ width: 24, height: 24, position: "relative" }}>
              <Image
                src={notificationImg}
                alt="Notifications"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </Box>

            <Box sx={{ width: 24, height: 24, position: "relative" }}>
              <Image
                src={messageImg}
                alt="Messages"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 40, height: 40, position: "relative" }}>
                <Image
                  src={ellipseImg}
                  alt="Profile"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </Box>

              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "#3B3F70",
                  lineHeight: "100%",
                }}
              >
                Dev.
              </Typography>
 
              <IconButton
                sx={{
                  p: 0,
                  color: "#2F3367",
                  width: "9.17px",
                  height: "4.58px",
                }}
              >
                <KeyboardArrowDownIcon />
              </IconButton>
            </Box>
          </Box>
        </Toolbar>

        <Divider sx={{ bgcolor: "#ECECEE", marginTop: "88.69", height: "1px" }} />
      </Box>
    </AppBar>
  );
}

export default ResponsiveAppBar;
