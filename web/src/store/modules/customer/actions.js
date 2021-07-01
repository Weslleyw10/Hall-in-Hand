import types from './types'

export function allCustomers() {
    return { type: types.ALL_CUSTOMERS }
}

export function updateCustomers(payload) {
    return { 
        type: types.UPDATE_CUSTOMERS, 
        payload 
    }
}

export function filterCustomers() {
    return {
        type: types.FILTER_CUSTOMERS
    }
}

export function addCustomer() {
    return {
        type: types.ADD_CUSTOMERS
    }
}

export function resetCustomer() {
    return {
        type: types.RESET_CUSTOMERS
    }
}

export function unlinkCustomer() {
    return {
        type: types.UNLINK_CUSTOMERS
    }
}
