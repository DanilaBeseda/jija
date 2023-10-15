import {IAtm, IDayLoad, IOffice, IPos, IRanked, IRankingResult, IRoute, TPerson, TProfiles, TTarget} from "./types.ts";
import {api, api_osm} from "./api.ts";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const isOffice = (targetType: TTarget, target: IOffice | IAtm): target is IOffice => {
    return targetType === 'office'
}

export function getWaitingTime(arrivalTime: Date, target: IOffice | IAtm, targetType: TTarget, person: TPerson): number | null {
    const weekDay = arrivalTime.getDay() == 0 ? 7 : arrivalTime.getDay()
    let load: IDayLoad[]
    if (isOffice(targetType, target)) {
        load = person == 'individual' ?  target.loadIndividuals : target.load
    } else {
        load = target.load
    }
    load = load.filter((day) => {
        return day.day == weekDay
    })

    if (load.length != 1) return null
    const dayLoads = load[0]
    const dayHour = arrivalTime.getHours()
    const hourLoads = dayLoads.loads.filter((hourLoadTuple) => hourLoadTuple[0] == dayHour)
    if (hourLoads.length != 1) return null
    const predictLoad = hourLoads[0][1] * 60_000
    if (!dayLoads.workHrs.includes(Math.floor((dayHour * 3_600_000 + predictLoad) / 3_600_000))) return null
    return predictLoad
}

export const rank = async (time: Date,
                           pos: IPos,
                           targetType: TTarget,
                           personType: TPerson,
                           profile: TProfiles,
                           wheel: boolean,
                           blind: boolean
                           ): Promise<IRankingResult> => {
    const nearestTargets = targetType == 'office' ? await api.getOfficesNearest(pos) : await api.getAtmsNearest(pos)
    nearestTargets.filter((target) => {
        let result = true
        if (isOffice(targetType, target)) {
            result = wheel ? target.hasRamp == 'Y' : true
        } else {
            result = wheel ? target.services.wheelchair.serviceActivity == 'AVAILABLE' : true
            result = blind ? target.services.blind.serviceActivity == 'AVAILABLE' : true
        }
        return result
    })
    let rankedTargets: IRanked[] = []
    let bestTravelTimeRanked: IRanked | undefined = undefined
    let bestWaitingTimeRanked: IRanked | undefined = undefined
    for (const target of nearestTargets) {
        const targetPos: IPos = {lat: target.latitude, lng: target.longitude}
        const route: IRoute = await api_osm.buildRoute(pos, targetPos, profile);
        const travelTime = route.duration * 1000;
        const arrivalTime = new Date(time.getTime() + travelTime)
        const waitingTime = getWaitingTime(arrivalTime, target, targetType, personType)
        if (waitingTime == null) continue
        const summaryTime = travelTime + waitingTime
        const ranked = {travelTime, waitingTime, summaryTime, targetType, target}
        if (!bestTravelTimeRanked) {
            bestTravelTimeRanked = ranked
        } else {
            if (bestTravelTimeRanked.travelTime > travelTime) {
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
