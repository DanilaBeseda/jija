import axios from "axios";
import {IAtm, IOffice, IPos, IRoute, TProfiles} from "./types";
import {HOST} from "./config";

export const api = {
    getAtms: () => axios.get<IAtm[]>(`${HOST}/atms`).then((res) => res.data),
    getOffices: () =>
        axios.get<IOffice[]>(`${HOST}/offices`).then((res) => res.data),
    getAtmsNearest: (pos: IPos) => axios.get<IAtm[]>(`${HOST}/atms/${pos.lat}/${pos.lng}`).then((res) => res.data),
    getOfficesNearest: (pos: IPos) =>
        axios.get<IOffice[]>(`${HOST}/offices/${pos.lat}/${pos.lng}`).then((res) => res.data),

};

export const api_osm = {
    buildRoute: (startPos: IPos, dstPos: IPos, profile: TProfiles): Promise<IRoute> => {
        const port = profile == 'car' ? 8183 : 8182
        return axios.get(`http://65.109.239.28:${port}/route/v1/${profile}/${startPos.lng},${startPos.lat};${dstPos.lng},${dstPos.lat}` +
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
                    distance: response.data.routes[0].distance,
                    duration: response.data.routes[0].duration,
                    profile: profile
                }
            })
    }
}