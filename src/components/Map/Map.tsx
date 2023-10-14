import { icon } from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
} from "react-leaflet";
import { useEffect, useState } from "react";
import "./leaflet.css";
import { api } from "../../api";
import { IAtm, IOffice } from "../../types";
import MarkerClusterGroup from "react-leaflet-cluster";

interface iCoordsProps {
  coords: [number, number];
  onAtmClick: (atm: IAtm) => void;
  onOfficeClick: (bank: IOffice) => void;
}

export const Map = ({ coords, onAtmClick, onOfficeClick }: iCoordsProps) => {
  const [atms, setAtms] = useState<IAtm[]>([]);
  const [offices, setOffices] = useState<IOffice[]>([]);
  const { getAtms, getOffices } = api;
  const centerPosition = coords;

  useEffect(() => {
    const getData = async () => {
      const offices = await getOffices();
      const atms = await getAtms();

      setAtms(atms);
      setOffices(offices);
    };

    getData();
  }, [getAtms, getOffices]);

  console.log(offices);

  return (
    <MapContainer
      center={centerPosition}
      zoom={15}
      scrollWheelZoom={true}
      style={{ width: "100vw", height: "100vh" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker
        position={centerPosition}
        icon={icon({ iconUrl: "/public/user.svg" })}
      >
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>

      <MarkerClusterGroup>
        {atms?.map((atm) => (
          <CircleMarker center={[atm.latitude, atm.longitude]} />
        ))}
        {offices?.map((office) => (
          <CircleMarker center={[office.latitude, office.longitude]} />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};
