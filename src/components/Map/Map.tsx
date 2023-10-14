import { icon } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "./leaflet.css";
import { IAtm, IBank } from "../../App";

interface iCoordsProps {
  coords: [number, number];
  onAtmClick: (atm: IAtm) => void;
  onBankClick: (bank: IBank) => void;
}

export const Map = ({ coords, onAtmClick, onBankClick }: iCoordsProps) => {
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
        eventHandlers={{ click: () => onAtmClick(atm) }}
        position={centerPosition}
        icon={icon({ iconUrl: "/public/bank_icon.svg" })}
      >
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>

      <Marker
        eventHandlers={{ click: () => onBankClick(bank) }}
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
