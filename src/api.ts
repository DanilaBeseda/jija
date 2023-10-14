import axios from "axios";
import {IAtm, IOffice, IPos, Route, TProfiles} from "./types";
import {HOST} from "./config";

export const api = {
    getAtms: () => axios.get<IAtm[]>(`${HOST}/atms`).then((res) => res.data),
    getOffices: () =>
        axios.get<IOffice[]>(`${HOST}/offices`).then((res) => res.data),
};

export const api_osm = {
    buildRoute: (startPos: IPos, dstPos: IPos, profile: TProfiles): Promise<Route> => {
        return axios.get(`http://router.project-osrm.org/route/v1/${profile}/${startPos.lng},${startPos.lat};${dstPos.lng},${dstPos.lat}` +
            '?' +
            'steps=true' +
            '&geometries=geojson' +
            '&overview=full' +
            '&generate_hints=false' +
            '&skip_waypoints=true')
            .then((response) => {
                const nodes = response.data.routes[0].geometry.coordinates.map((pos: [number, number]) => [pos[1], pos[0]])
                return {
                    nodes: nodes,
                    distance: response.data.distance,
                    duration: response.data.duration
                }
            })
    }
}