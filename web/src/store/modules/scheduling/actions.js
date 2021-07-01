import types from './types'


export function filterScheduling(start, end) {
    return {
        type: types.SCHEDULING_FILTER,
        start,
        end
    }
}

export function updateScheduling(schedulings) {
    return {
        type: types.SCHEDULING_UPDATE,
        schedulings
    }
}