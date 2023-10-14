import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "./leaflet.css";

const centerPosition: LatLngExpression = [55.74222, 37.61556];
const positions: LatLngExpression[] = [
  [55.75222, 37.61556],
  [55.74222, 37.61556],
  [55.73222, 37.61556],
  [55.72222, 37.61556],
];

export const Map = () => {
  return (
    <MapContainer
      center={centerPosition}
      zoom={15}
      scrollWheelZoom={false}
      style={{ width: "100vw", height: "100vh" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {positions.map((position) => (
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
