import { LatLngExpression, LeafletMouseEvent, icon } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "./leaflet.css";

interface iCoordsProps {
  coords: [number, number];
  onClick: (e: LeafletMouseEvent) => void;
}

export const Map = ({ coords, onClick }: iCoordsProps) => {
  const centerPosition: LatLngExpression = [coords[0], coords[1]];

  return (
    <MapContainer
      center={centerPosition}
      zoom={15}
      scrollWheelZoom={false}
      style={{ width: "100vw", height: "100vh" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker
        eventHandlers={{ click: onClick }}
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
