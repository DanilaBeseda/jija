import { createTheme, ThemeProvider } from "@mui/material/styles";

import "./app.css";
import Header from "./components/Header/Header.tsx";
import { useEffect, useState } from "react";
import { Map } from "./components/Map/Map.tsx";
import { Popover } from "./components/Popover/Popover.tsx";
import { LeafletMouseEvent } from "leaflet";

const theme = createTheme({
  palette: {},
});

export const App = () => {
  const [coords, setCoords] = useState<[number, number]>([0, 0]);
  const [curDep, setCurDep] = useState<null>(null);

  const handleClickDep = (e: LeafletMouseEvent) => {
    console.log(e);
    // setCurDep(dep);
  };

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos: GeolocationPosition) {
    // console.log(pos.coords);
    setCoords([pos.coords.latitude, pos.coords.longitude]);
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
        <Header coords={coords} />
        {coords[0] !== 0 && <Map coords={coords} onClick={handleClickDep} />}
        {curDep && <Popover />}
      </div>
    </ThemeProvider>
  );
};
