import { combineReducers } from 'redux'

import schedulings from './modules/scheduling/reducer'
import customers from './modules/customer/reducer'
import employees from './modules/employee/reducer'
import services from './modules/services/reducer'
import schedules from './modules/schedules/reducer'

export default combineReducers({
    schedulings,
    customers,
    employees,
    services,
    schedules
})
