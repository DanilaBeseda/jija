import {IPos, TPerson, TTarget} from "./types.ts";
import {api} from "./api.ts";

export const rank = async (pos: IPos, target: TTarget, person: TPerson) => {
    const nearestTargets = target == 'office' ? await api.getOfficesNearest(pos) : await api.getAtmsNearest(pos)
    nearestTargets.filter(() => true)

}
