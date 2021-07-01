import { all } from 'redux-saga/effects'

import schedulings from './modules/scheduling/sagas'
import customers from './modules/customer/sagas'
import employee from './modules/employee/sagas'

export default function* rootSaga() {
    return yield all([
        schedulings, 
        customers,
        employee
    ])
}
