import types from "./types";

export function updateSchedules (payload) {
    return {
        type: types.UPDATE_SCHEDULE,
        payload
    }
}

export function allSchedules() {
    return {
        type: types.ALL_SCHEDULE
    }
}

export function saveSchedule () {
    return {
        type: types.SAVE_SCHEDULE
    }
}

export function removeSchedules() {
    return {
        type: types.REMOVE_SCHEDULE
    }
}

export function resetSchedule () {
    return {
        type: types.RESET_SCHEDULE
    }
}

export function allServicesSchedule () {
    return {
        type: types.ALL_SERVICES_SCHEDULE
    }
}

export function allEmployeesSchedule () {
    return {
        type: types.ALL_EMPLOYEES_SCHEDULE
    }
}

export function filterEmployeesSchedule () {
    return {
        type: types.FILTER_EMPLOYEES_SCHEDULE
    }
}
