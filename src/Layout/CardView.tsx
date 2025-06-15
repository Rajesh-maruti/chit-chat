import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import { ReactNode } from "react";

const CardView = (props: { children: ReactNode }) => {
  return (
    <Box
      height="100vh"
      display="flex"
      width="100vw"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
      px={4}
    >
      <Box
        sx={{
          alignItems: "center",
          justifyContent: "center",
        }}
        boxShadow={4}
        p={4}
        maxWidth="400px"
        borderRadius={2}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
          }}
        >{props.children}</CardContent>
      </Box>
    </Box>
  );
};

export default CardView;
