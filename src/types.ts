export type TDay = "пн" | "вт" | "ср" | "чт" | "пт" | "сб" | "вс";

export interface IAtm {
  address: string;
  latitude: number;
  longitude: number;
  allDay: boolean;
  services: {
    wheelchair: { serviceCapability: string; serviceActivity: string };
    blind: { serviceCapability: string; serviceActivity: string };
    nfcForBankCards: { serviceCapability: string; serviceActivity: string };
    qrRead: { serviceCapability: string; serviceActivity: string };
    supportsUsd: { serviceCapability: string; serviceActivity: string };
    supportsChargeRub: { serviceCapability: string; serviceActivity: string };
    supportsEur: { serviceCapability: string; serviceActivity: string };
    supportsRub: { serviceCapability: string; serviceActivity: string };
  };
  load: { days: number; loads: number[][] }[];
}

export interface IOffice {
  salePointName: string;
  address: number;
  status: number;
  openHours: { days: TDay; hours: string }[];
  rko: string;
  openHoursIndividual: { days: TDay; hours: string }[];
  officeType: string;
  salePointFormat: string;
  suoAvailability: string;
  hasRamp: string;
  latitude: number;
  longitude: number;
  metroStation: string;
  distance: number;
  kep: boolean;
  myBranch: boolean;
  load: { days: number; loads: number[][] }[];
}

export interface IPos {
  lat: number;
  lng: number
}

export interface IRoute {
  nodes: [number, number][]
  duration: number
  distance: number
}

export type TProfiles = "car" | "bike" | "foot"
