import { createTheme, ThemeProvider } from "@mui/material/styles";

import "./app.css";
import Header from "./components/Header/Header.tsx";
import { useEffect, useState } from "react";
import { Map } from "./components/Map/Map.tsx";
import { Popover } from "./components/Popover/Popover.tsx";
import { IAtm, IOffice, IRankingResult, IRoute, ITime } from "./types.ts";
import { LeafletMouseEvent } from "leaflet";
import {api_osm} from "./api.ts";
import {getTime, rank} from "./ranking.ts";
import {SearchPopover} from "./components/SearchPopover/SearchPopover.tsx";

const theme = createTheme({
  palette: {},
});

export const App = () => {
  const [coords, setCoords] = useState<[number, number]>([0, 0]);
  const [curAtm, setCurAtm] = useState<null | IAtm>(null);
  const [curOffice, setCurOffice] = useState<null | IOffice>(null);
  const [curRoute, setCurRoute] = useState<null | IRoute>(null);
  const [rankingResult, setRankingResult] = useState<null | IRankingResult>(null)

  const [individual, setIndividual] = useState(true)
  const [office, setOffice] = useState(true)
  const [car, setCar] = useState(false)
  const [service, setService] = useState("")
  const [blind, setBlind] = useState(false)
  const [wheel, setWheel] = useState(false)

  const [targetTime, setTargetTime] = useState<ITime | null>(null)

  /* useEffect(() => {
    const handleClick = () => {
      setCurAtm(null);
      setCurOffice(null);
    };

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []); */

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => success(pos),
      error,
      options
    );
  }, []);

  useEffect(() => {
    curOffice && api_osm.buildRoute({lat: coords[0], lng: coords[1]}, {lat: curOffice.latitude, lng: curOffice.longitude}, car ? 'car' : 'foot').then((route) => {
      setCurRoute(route)
      setTargetTime(getTime(
          new Date(Date.now()),
          route,
          curOffice,
          'office',
          individual ? 'individual' : 'legal'
      ))
    })
    curAtm && api_osm.buildRoute({lat: coords[0], lng: coords[1]}, {lat: curAtm.latitude, lng: curAtm.longitude}, car ? 'car' : 'foot').then((route) => {
      setCurRoute(route)
      setTargetTime(getTime(
          new Date(Date.now()),
          route,
          curAtm,
          'atm',
          individual ? 'individual' : 'legal'
      ))
    })
    if (service != '') {
      coords && rank(new Date(Date.now()),
          {lat: coords[0], lng: coords[1]},
          office ? 'office' :'atm',
          individual ? 'individual' : 'legal',
          car ? 'car' : 'foot',
          wheel,
          blind
      )
          .then(setRankingResult)
    }
  }, [coords, individual, office, car, service, blind, wheel])

  const handleAtmClick = (e: LeafletMouseEvent, atm: IAtm) => {
    e?.originalEvent.stopPropagation();
    setCurAtm(atm);
    setCurOffice(null);
    api_osm.buildRoute({lat: coords[0], lng: coords[1]}, {lat: atm.latitude, lng: atm.longitude}, car ? 'car' : 'foot')
        .then((route) => {
          setCurRoute(route)
          setTargetTime(getTime(
              new Date(Date.now()),
              route,
              atm,
              'atm',
              individual ? 'individual' : 'legal'
          ))
        })
  };

  const handleOfficeClick = (e: LeafletMouseEvent, bank: IOffice) => {
    e?.originalEvent.stopPropagation();
    setCurOffice(bank);
    setCurAtm(null);
    api_osm.buildRoute({lat: coords[0], lng: coords[1]}, {lat: bank.latitude, lng: bank.longitude}, car ? 'car' : 'foot')
        .then((route) => {
          setCurRoute(route)
          setTargetTime(getTime(
              new Date(Date.now()),
              route,
              bank,
              'office',
              individual ? 'individual' : 'legal'
          ))
        })
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
      <div className="app" onContextMenu={(event) => {
        event.preventDefault();
      }}>
        <Header coords={coords} />
        {coords[0] !== 0 && (
          <Map
            coords={coords}
            onAtmClick={handleAtmClick}
            onOfficeClick={handleOfficeClick}
            curRoute={curRoute}
            onLeftClick={(e) => {setCoords([e.latlng.lat, e.latlng.lng])}}
          />
        )}
        {(curAtm || curOffice) && targetTime && <Popover atm={curAtm} office={curOffice} time={targetTime} />}
        <SearchPopover atmSelect={handleAtmClick} officeSelect={handleOfficeClick} blind={blind} wheel={wheel} setWheel={setWheel} car={car} setCar={setCar} rankingResult={rankingResult} office={office} setOffice={setOffice}  setBlind={setBlind} setIndividual={setIndividual} setService={setService} service={service} individual ={individual}/>
      </div>
    </ThemeProvider>
  );
};
