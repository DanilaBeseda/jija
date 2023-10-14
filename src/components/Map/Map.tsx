import { icon } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "./leaflet.css";
import { IDepInfo } from "../../App";

interface iCoordsProps {
  coords: [number, number];
  onClick: (depInfo: IDepInfo) => void;
}

export const Map = ({ coords, onClick }: iCoordsProps) => {
  const centerPosition = coords;

  return (
    <MapContainer
      center={centerPosition}
      zoom={15}
      scrollWheelZoom={false}
      style={{ width: "100vw", height: "100vh" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker
        eventHandlers={{ click: () => onClick(depInfo) }}
        position={centerPosition}
        icon={icon({ iconUrl: "/public/bank_icon.svg" })}
      >
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};
