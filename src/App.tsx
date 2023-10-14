import { createTheme, ThemeProvider } from "@mui/material/styles";

import "./app.css";
import Header from "./components/Header/Header.tsx";
import { useEffect, useState } from "react";
import { Map } from "./components/Map/Map.tsx";
import { Popover } from "./components/Popover/Popover.tsx";

type TDay = "пн" | "вт" | "ср" | "чт" | "пт" | "сб" | "вс";

export interface IAtm {
  address: string;
  latitude: number;
  longitude: number;
  allDay: boolean;
  services: {
    wheelchair: { serviceCapability: string; serviceActivity: string };
    blind: { serviceCapability: string; serviceActivity: string };
    nfcForBankCards: { serviceCapability: string; serviceActivity: string };
    qrRead: { serviceCapability: string; serviceActivity: string };
    supportsUsd: { serviceCapability: string; serviceActivity: string };
    supportsChargeRub: { serviceCapability: string; serviceActivity: string };
    supportsEur: { serviceCapability: string; serviceActivity: string };
    supportsRub: { serviceCapability: string; serviceActivity: string };
  };
  load: { days: TDay; loads: number[] }[];
}

export interface IBank {
  salePointName: string;
  address: number;
  status: number;
  openHours: { days: TDay; hours: string }[];
  rko: string;
  openHoursIndividual: { days: TDay; hours: string }[];
  officeType: string;
  salePointFormat: string;
  suoAvailability: string;
  hasRamp: string;
  latitude: number;
  longitude: number;
  metroStation: string;
  distance: number;
  kep: boolean;
  myBranch: boolean;
  load: { days: TDay; loads: number[] }[];
}

const theme = createTheme({
  palette: {},
});

export const App = () => {
  const [coords, setCoords] = useState<[number, number]>([55.754121, 37.62066]);
  const [curAtm, setCurAtm] = useState<null | IAtm>(null);
  const [curBank, setCurBank] = useState<null | IBank>(null);

  const handleAtmClick = (atm: IAtm) => {
    setCurAtm(atm);
    setCurBank(null);
  };

  const handleBankClick = (bank: IBank) => {
    setCurBank(bank);
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
        {coords[0] !== 0 && (
          <Map
            coords={coords}
            onAtmClick={handleAtmClick}
            onBankClick={handleBankClick}
          />
        )}
        <Popover atm={curAtm} bank={curBank} />
      </div>
    </ThemeProvider>
  );
};
