import { createTheme, ThemeProvider } from "@mui/material/styles";

import "./app.css";
import Header from "./components/Header/Header.tsx";
import { useEffect, useState } from "react";
import { Map } from "./components/Map/Map.tsx";

const theme = createTheme({
  palette: {},
});

export const App = () => {
  const [lat, setLat] = useState<number>(0);
  const [long, setLong] = useState<number>(0);
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos: GeolocationPosition) {
    // console.log(pos.coords);
    setLat(pos.coords.latitude);
    setLong(pos.coords.longitude);
    // console.log("Your current position is:");
    // console.log(`Latitude : ${pos.coords.latitude}`);
    // console.log(`Longitude: ${pos.coords.longitude}`);
    // console.log(`More or less meters.`);
  }

  function error() {
    //console.warn(`ERROR`);
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => success(pos),
      error,
      options
    );
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <Header lat={lat} long={long} />
        {lat != 0 && long != 0 && <Map lat={lat} long={long}/>}
      </div>
    </ThemeProvider>
  );
};
