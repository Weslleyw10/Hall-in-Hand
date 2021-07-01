import types from './types'

export function allEmployees () {
    return {
        type: types.ALL_EMPLOYEES
    }
}

export function updateEmployees (payload) {
    return {
        type: types.UPDATE_EMPLOYEES,
        payload
    }
}

export function filterEmployees () {
    return {
        type: types.FILTER_EMPLOYEES
    }
}

export function addEmployees () {
    return {
        type: types.ADD_EMPLOYEES
    }
}

export function resetEmployees () {
    return {
        type: types.RESET_EMPLOYEES
    }
}

export function unlinkEmployees () {
    return {
        type: types.UNLINK_EMPLOYEES
    }
}

export function servicesEmployees () {
    return {
        type: types.SERVICES_EMPLOYEES
    }
}

