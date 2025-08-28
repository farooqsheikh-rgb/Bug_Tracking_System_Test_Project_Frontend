"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from "@mui/icons-material/Mail";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FolderIcon from "@mui/icons-material/Folder";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";
import PaymentIcon from "@mui/icons-material/Payment";
import { usePathname } from "next/navigation";
import Image from "next/image";
import manageBugImg from "../../public/images/manageBug.png";
import { Divider } from "@mui/material";

const pages = [
  { name: "Projects", icon: <FolderIcon />, path: "/projects" },
  { name: "Tasks", icon: <AssignmentIcon />, path: "/projects" },
  { name: "Manage", icon: <SettingsIcon />, path: "/projects" },
  { name: "Payments", icon: <PaymentIcon />, path: "/projects" },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const pathname = usePathname();

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

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
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: "80px" }}>
          <Box sx={{ display: "flex", alignItems: "center", mr: 4 }}>
            <Box
              sx={{
                width: 31.43,
                height: 31.31,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 1,
                position: "relative",
              }}
            >
              <Image
                src={manageBugImg}
                alt={"ManageBug"}
                fill
                style={{ objectFit: "cover" }}
                priority
              ></Image>
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

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
            }}
          >
            {pages.map((page) => {
              const isActive = getActivePage(page.path, page.name);

              return (
                <Button
                  key={page.name}
                  onClick={handleCloseNavMenu}
                  startIcon={
                    <span
                      style={{
                        color: isActive ? "#0C83FA" : "#787486",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {page.icon}
                    </span>
                  }
                  sx={{
                    my: 2,
                    color: isActive ? "#2F3367" : "#787486",
                    display: "flex",
                    alignItems: "center",
                    mx: 2,
                    textTransform: "none",
                    fontSize: "16px",
                    fontWeight: isActive ? 600 : 400,
                    gap: "8px",
                    "&:hover": {
                      backgroundColor: "transparent",
                      color: "#0C83FA",
                    },
                  }}
                >
                  {page.name}
                </Button>
              );
            })}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <IconButton
              sx={{
                color: "#868AA5",
                position: "relative",
                width: "24px",
                height: "24px",
              }}
            >
              <NotificationsIcon />
              <Box
                sx={{
                  position: "absolute",
                  top: 1,
                  right: 15,
                  width: 8,
                  height: 8,
                  backgroundColor: "#e91e63",
                  borderRadius: "50%",
                }}
              />
            </IconButton>

            <IconButton
              sx={{
                color: "#868AA5",
                position: "relative",
                width: "24px",
                height: "24px",
              }}
            >
              <MailIcon />
              <Box
                sx={{
                  position: "absolute",
                  top: 1,
                  right: 18,
                  width: 8,
                  height: 8,
                  backgroundColor: "#e91e63",
                  borderRadius: "50%",
                }}
              />
            </IconButton>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                }}
              ></Avatar>
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
        <Divider sx={{ bgcolor: "#ECECEE" }} />
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
