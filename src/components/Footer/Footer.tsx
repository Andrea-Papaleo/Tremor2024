import { Box, Link, Typography } from "@mui/material";
import React from "react";

function Copyright() {
  return (
    <Typography variant="body2" color="white" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        apapaleo.com
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
export const Footer = () => {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "black",
        height: "64px",
      }}
      component="footer"
    >
      <Typography
        variant="subtitle1"
        align="center"
        color="white"
        component="p"
      >
        La La La
      </Typography>
      <Copyright />
    </Box>
  );
};
