import { Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import "./app.css";

const theme = createTheme({
  palette: {},
});

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <Box>header</Box>
        <Box sx={{ flexGrow: 1, display: "flex" }}>
          <Box>map</Box>
          <Box>sidebar</Box>
        </Box>
      </div>
    </ThemeProvider>
  );
};
