import { Box, Card, CardContent, Typography } from "@mui/material";
import ResponsiveAppBar from "../navbar";
import projectImg from "../../../public/images/folder.png";
import Image from "next/image";

export default function Projects() {
  const data = [
    {
      id: 1,
      image: projectImg,
      name: "Card 1",
      description: "Description 1 is over here",
      completedTasks: "10",
      totalTask: "20",
    },
    {
      id: 2,
      image: projectImg,
      name: "Card 2",
      description: "Description 2 is over here",
      completedTasks: "10",
      totalTask: "20",
    },
    {
      id: 3,
      image: projectImg,
      name: "Card 3",
      description: "Description 3 is over here",
      completedTasks: "10",
      totalTask: "20",
    },
    {
      id: 4,
      image: projectImg,
      name: "Card 4",
      description: "Description 4 is over here",
      completedTasks: "10",
      totalTask: "20",
    },
    {
      id: 5,
      image: projectImg,
      name: "Card 5",
      description: "Description 5 is over here",
      completedTasks: "10",
      totalTask: "20",
    },
    {
      id: 6,
      image: projectImg,
      name: "Card 6",
      description: "Description 6 is over here",
      completedTasks: "10",
      totalTask: "20",
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "white",
        color: "black",
        padding: "0 100px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          flex: 1,
          width: "100%",
        }}
      >
        <ResponsiveAppBar />

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <h1>3</h1>
          <h1>3</h1>
          <h1>3</h1>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {data.map((item) => (
            <Box
              key={item.id}
              sx={{
                width: "calc((100% - 48px) / 3)", 
                marginBottom: "24px",
              }}
            >
              <Card
                sx={{
                  width: "100%",
                  height: "202px",
                  display: "flex",
                  flexDirection: "column",
                  boxSizing: "border-box",
                  justifyContent: "center",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    padding: "16px",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Image
                      src={item.image}
                      alt="Project"
                      width={57}
                      height={58}
                      style={{ flexShrink: 0 }}
                    />
                    <Typography
                      sx={{
                        fontWeight: "600",
                        fontSize: "14.79px",
                        lineHeight: "100%",
                        letterSpacing: "1%",
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      fontWeight: "400",
                      fontSize: "12.67px",
                      lineHeight: "100%",
                      letterSpacing: "1%",
                    }}
                  >
                    {item.description}
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: "500",
                      fontSize: "12.67px",
                      lineHeight: "100%",
                      letterSpacing: "1%",
                    }}
                  >
                    Task Done: {item.completedTasks} / {item.totalTask}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      <h2>2</h2>
    </Box>
  );
}
