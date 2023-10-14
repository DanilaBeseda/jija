import { createTheme, ThemeProvider } from "@mui/material/styles";

import "./app.css";
import Header from "./components/Header/Header.tsx";
import { useEffect, useState } from "react";
import { Map } from "./components/Map/Map.tsx";
import { Popover } from "./components/Popover/Popover.tsx";
import { IAtm, IOffice } from "./types.ts";
import { LeafletMouseEvent } from "leaflet";

const theme = createTheme({
  palette: {},
});

export const App = () => {
  const [coords, setCoords] = useState<[number, number]>([0, 0]);
  const [curAtm, setCurAtm] = useState<null | IAtm>(null);
  const [curOffice, setCurOffice] = useState<null | IOffice>(null);

  useEffect(() => {
    const handleClick = () => {
      setCurAtm(null);
      setCurOffice(null);
    };

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => success(pos),
      error,
      options
    );
  }, []);

  const handleAtmClick = (e: LeafletMouseEvent, atm: IAtm) => {
    e.originalEvent.stopPropagation();
    setCurAtm(atm);
    setCurOffice(null);
  };

  const handleOfficeClick = (e: LeafletMouseEvent, bank: IOffice) => {
    e.originalEvent.stopPropagation();
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
        {(curAtm || curOffice) && <Popover atm={curAtm} office={curOffice} />}
      </div>
    </ThemeProvider>
  );
};
