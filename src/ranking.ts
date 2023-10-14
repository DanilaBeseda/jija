import {IAtm, IOffice, IPos, IRanked, IRankResult, IRoute, TPerson, TProfiles, TTarget} from "./types.ts";
import {api, api_osm} from "./api.ts";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const isOffice = (targetType: TTarget, target: IOffice | IAtm): target is IOffice => {
    return targetType === 'office'
}

export function getWaitingTime(arrivalTime: Date, target: IOffice | IAtm, targetType: TTarget, person: TPerson): number | null {
    const weekDay = arrivalTime.getDay() == 0 ? 7 : arrivalTime.getDay()
    let load: { day: number; loads: [number, number][] }[]
    if (isOffice(targetType, target)) {
        load = person == 'individual' ?  target.loadIndividuals : target.load
    } else {
        load = target.load
    }
    load = load.filter((day) => day.day == weekDay)
    if (load.length != 1) return null
    const dayLoads = load[0]
    const dayHour = arrivalTime.getHours()
    const hourLoads = dayLoads.loads.filter((hourLoadTuple) => hourLoadTuple[0] == dayHour)
    if (hourLoads.length != 1) return null
    const predictLoad = hourLoads[0][1] * 60_000
    if (!target.workHrs.includes(Math.floor((dayHour * 3_600_000 + predictLoad) / 3_600_000))) return null
    return predictLoad
}

export const rank = async (time: Date, pos: IPos, targetType: TTarget, personType: TPerson, profile: TProfiles): Promise<IRankResult> => {
    const nearestTargets = targetType == 'office' ? await api.getOfficesNearest(pos) : await api.getAtmsNearest(pos)
    nearestTargets.filter(() => true)
    let rankedTargets: IRanked[] = []
    let bestTravelTimeRanked: IRanked | undefined = undefined
    let bestWaitingTimeRanked: IRanked | undefined = undefined
    for (const target of nearestTargets) {
        const targetPos: IPos = {lat: target.latitude, lng: target.longitude}
        const route: IRoute = await api_osm.buildRoute(pos, targetPos, profile);
        const travelTime = route.duration * 60_000;
        const arrivalTime = new Date(time.getTime() + travelTime)
        const waitingTime = getWaitingTime(arrivalTime, target, targetType, personType)
        if (waitingTime == null) continue
        const summaryTime = travelTime + waitingTime
        const ranked = {travelTime, waitingTime, summaryTime, targetType, target}
        if (!bestTravelTimeRanked) {
            bestTravelTimeRanked = ranked
        } else {
            if (bestTravelTimeRanked.waitingTime > waitingTime) {
                bestTravelTimeRanked = ranked
            }
        }
        if (!bestWaitingTimeRanked) {
            bestWaitingTimeRanked = ranked
        } else {
            if (bestWaitingTimeRanked.waitingTime > waitingTime) {
                bestWaitingTimeRanked = ranked
            }
        }
        rankedTargets.push(ranked)
    }
    rankedTargets = rankedTargets.sort((a, b) => a.summaryTime - b.summaryTime)
    return {top: rankedTargets, bestTravelTime: bestWaitingTimeRanked, bestWaitingTime: bestWaitingTimeRanked}
}
