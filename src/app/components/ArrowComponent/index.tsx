import { Box } from "@mui/material";
import Image from "next/image";
import arrowImg from "../../../../public/images/VectorArrow.png";

export default function ArrowComponent() {
  return (
    <Box
      sx={{
        width: 31,
        height: 31,
        position: "relative",
      }}
    >
      <Image
        src={arrowImg}
        alt="View"
        fill
        style={{ objectFit: "cover" }}
        priority
      />
    </Box>
  );
}
