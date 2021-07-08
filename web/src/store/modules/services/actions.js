import types from './types'

export function updateServices(payload) {
    return {
        type: types.UPDATE_SERVICES,
        payload
    }
}

export function allServices() {
    return {
        type: types.ALL_SERVICES
    }
}

export function saveServices() {
    return {
        type: types.SAVE_SERVICES
    }
}

export function resetServices() {
    return {
        type: types.RESET_SERVICES
    }
}

export function removeServices() {
    return {
        type: types.REMOVE_SERVICES
    }
}

export function removeMediaServices(key) {
    return {
        type: types.REMOVE_MEDIA_SERVICES,
        key
    }
}

