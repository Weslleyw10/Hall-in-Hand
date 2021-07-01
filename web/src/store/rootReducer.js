import { combineReducers } from 'redux'

import schedulings from './modules/scheduling/reducer'
import customers from './modules/customer/reducer'
import employees from './modules/employee/reducer'

export default combineReducers({
    schedulings,
    customers,
    employees
})
