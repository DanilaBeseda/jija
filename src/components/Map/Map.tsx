import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "./leaflet.css";

interface iCoordsProps {
  long: number,
  lat: number

}


const positions: LatLngExpression[] = [
  [55.75222, 37.61556],
  [55.74222, 37.61556],
  [55.73222, 37.61556],
  [55.72222, 37.61556],
];

export const Map = ({lat, long}:iCoordsProps) => {
  console.log(lat, long)
  const centerPosition: LatLngExpression = [lat, long];
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
