import axios from "axios";
import { IAtm, IOffice } from "./types";
import { HOST } from "./config";

export const api = {
  getAtms: () => axios.get<IAtm[]>(`${HOST}/atms`).then((res) => res.data),
  getOffices: () =>
    axios.get<IOffice[]>(`${HOST}/offices`).then((res) => res.data),
};
