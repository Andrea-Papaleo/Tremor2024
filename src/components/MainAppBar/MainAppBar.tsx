import { AppBar, Box, ButtonBase, Toolbar, Typography } from "@mui/material";
import { GraphicEqRounded as GraphicEqRoundedIcon } from "@mui/icons-material";

export const MainAppBar = () => {
  return (
    <AppBar position="fixed">
      <Toolbar
        sx={{
          display: "flex",
          backgroundColor: "#000",
          justifyContent: "space-between",
        }}
      >
        <Box
          display="flex"
          width="33%"
          flexGrow={1}
          justifyContent="flex-start"
        >
          <ButtonBase sx={{ color: "white" }}>
            <GraphicEqRoundedIcon sx={{ mr: 2 }} />
            <Typography variant="h6" color="inherit" noWrap>
              Tremor 2024
            </Typography>
          </ButtonBase>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
