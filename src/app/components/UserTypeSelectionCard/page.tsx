import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Avatar from "@mui/material/Avatar";
import { Grid } from "@mui/material";

export default function UserTypeSelectionCard({
  key,
  icon,
  title,
  description,
}: {
  key: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card
      style={{
        width: "426px",
        height: "108px",
        top: "405px",
        left: "918px",
        border: "1px",
        borderRadius: "6px",
        marginBottom: "25px",
      }}
    >
      <CardActionArea>
        <CardContent>
          <Grid container spacing={0}>
            <Grid size={3} style={{ position: "relative", height: "100vh" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Avatar>{icon}</Avatar>
              </div>
            </Grid>

            <Grid size={5}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{
                    color: "black",
                    fontWeight: "500",
                    size: "16px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    verticalAlign: "middle",
                  }}
                >
                  {title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "black",
                    fontWeight: "400",
                    size: "14px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    verticalAlign: "middle",
                  }}
                >
                  {description}
                </Typography>
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
