import { createTheme, ThemeProvider } from "@mui/material/styles";

import "./app.css";
import Header from "./components/Header/Header.tsx";
import { useEffect, useState } from "react";
import { Map } from "./components/Map/Map.tsx";
import { Popover } from "./components/Popover/Popover.tsx";
import { IAtm, IOffice } from "./types.ts";

const theme = createTheme({
  palette: {},
});

export const App = () => {
  const [coords, setCoords] = useState<[number, number]>([0, 0]);
  const [curAtm, setCurAtm] = useState<null | IAtm>(null);
  const [curOffice, setCurOffice] = useState<null | IOffice>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => success(pos),
      error,
      options
    );
  }, []);

  const handleAtmClick = (atm: IAtm) => {
    console.log(atm);

    setCurAtm(atm);
    setCurOffice(null);
  };

  const handleOfficeClick = (bank: IOffice) => {
    setCurOffice(bank);
    setCurAtm(null);
  };

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos: GeolocationPosition) {
    setCoords([pos.coords.latitude, pos.coords.longitude]);
  }

  function error() {
    //console.warn(`ERROR`);
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <Header coords={coords} />
        {coords[0] !== 0 && (
          <Map
            coords={coords}
            onAtmClick={handleAtmClick}
            onOfficeClick={handleOfficeClick}
          />
        )}
        <Popover atm={curAtm} office={curOffice} />
      </div>
    </ThemeProvider>
  );
};
