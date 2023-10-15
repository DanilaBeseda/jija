export type TDay = "пн" | "вт" | "ср" | "чт" | "пт" | "сб" | "вс";
export type TPerson = 'individual' | 'legal'
export type TTarget = 'atm' | 'office'

export interface IDayLoad { day: number; loads: [number, number][], workHrs: number[]}

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
  load: IDayLoad[];
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
  load: IDayLoad[];
  loadIndividuals: IDayLoad[];
}

export interface IPos {
  lat: number;
  lng: number
}

export interface IRoute {
  nodes: [number, number][]
  duration: number
  distance: number
  profile: TProfiles
}

export type TProfiles = "car" | "foot"

export interface IRanked {
  targetType: TTarget
  target: IOffice | IAtm
  travelTime: number
  waitingTime: number
  summaryTime: number
}

export interface IRankingResult {
  top: IRanked[]
  bestTravelTime: IRanked | undefined
  bestWaitingTime: IRanked | undefined
}