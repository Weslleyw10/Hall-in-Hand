import { takeLatest, all, call, put, select } from 'redux-saga/effects'
import {
    updateSchedules,
    allSchedules as allSchedulesAction,
    resetSchedule
} from './actions'

import types from './types'
import rest from '../../../services/rest'

export function* allSchedules() {
    const { form } = yield select(state => state.employees)

    console.log("chegou no sagas")

    try {
        yield put(updateSchedules({ form: { ...form, filtering: true } }))

        const { data: res } = yield call(
            rest.get, 
            `/schedule/hall/60b92a65806460dd54a02098`
            )

        yield put(updateSchedules({ form: { ...form, filtering: false } }));


        if (res.error) {
            console.log(res.message)
            return false
        }

        console.log(res)

        yield put(updateSchedules({
            form: { ...form, filtering: false },
            schedules: res.schedules
        }))


    } catch (error) {
        yield put(updateSchedules({ form: { ...form, filtering: false } }))
        console.log(error.message)
    }
}

export function* allServices() {


}


export default all([
    takeLatest(types.ALL_SCHEDULE, allSchedules),
])