import {LeafletMouseEvent, icon} from "leaflet";
import {MapContainer, TileLayer, Marker, Polyline, useMapEvent} from "react-leaflet";
import {useEffect, useState} from "react";
import "./leaflet.css";
import {api} from "../../api";
import {IAtm, IOffice, IRoute} from "../../types";
import MarkerClusterGroup from "react-leaflet-cluster";

interface iCoordsProps {
    coords: [number, number];
    onAtmClick: (e: LeafletMouseEvent, atm: IAtm) => void;
    onOfficeClick: (e: LeafletMouseEvent, bank: IOffice) => void;
    curRoute: IRoute | null;
  onLeftClick: (e: LeafletMouseEvent) => void;
}

function OnLeftClick({cb}: { cb: (e: LeafletMouseEvent) => void }) {
    useMapEvent('contextmenu', (e: LeafletMouseEvent) => {
        cb(e)
    })
    return null
}

export const Map = ({coords, onAtmClick, onOfficeClick, curRoute, onLeftClick}: iCoordsProps) => {
    const [atms, setAtms] = useState<IAtm[]>([]);
    const [offices, setOffices] = useState<IOffice[]>([]);
    const {getAtms, getOffices} = api;
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

    return (
        <MapContainer
            center={centerPosition}
            zoom={15}
            scrollWheelZoom={true}
            style={{width: "100vw", height: "100vh"}}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <Marker
                position={centerPosition}
                icon={icon({iconUrl: "/public/user.svg"})}
            />

            <MarkerClusterGroup>
                {atms?.map((atm, index) => (
                    <Marker
                        key={index}
                        eventHandlers={{
                            click: (e: LeafletMouseEvent) => onAtmClick(e, atm),
                        }}
                        icon={icon({iconUrl: "/public/atm.svg"})}
                        position={[atm.latitude, atm.longitude]}
                    />
                ))}
                {offices?.map((office, index) => (
                    <Marker
                        key={index}
                        eventHandlers={{
                            click: (e: LeafletMouseEvent) => onOfficeClick(e, office),
                        }}
                        icon={icon({iconUrl: "/public/bank_icon.svg"})}
                        position={[office.latitude, office.longitude]}
                    />
                ))}
                {curRoute && <Polyline positions={curRoute.nodes}></Polyline>}
                <OnLeftClick cb={onLeftClick}
                />
            </MarkerClusterGroup>
        </MapContainer>
    );
};
