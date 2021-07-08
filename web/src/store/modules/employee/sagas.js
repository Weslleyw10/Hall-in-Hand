import { takeLatest, all, call, put, select } from 'redux-saga/effects'
import {
    updateEmployees,
    allEmployees as allEmployeesAction,
    resetEmployees
} from './actions'

import types from './types'
import rest from '../../../services/rest'

export function* allEmployees() {
    const { form } = yield select(state => state.employees)

    try {
        yield put(updateEmployees({ form: { ...form, filtering: true } }))

        const { data: res } = yield call(
            rest.get, 
            `/employee/hall/60b92a65806460dd54a02098`
            )

        yield put(updateEmployees({ form: { ...form, filtering: false } }));


        if (res.error) {
            console.log(res.message)
            return false
        }

        yield put(updateEmployees({
            form: { ...form, filtering: false },
            employees: res.employees
        }))


    } catch (error) {
        yield put(updateEmployees({ form: { ...form, filtering: false } }))
        console.log(error.message)
    }
}

export function* filterEmployees() {
    const { form, employee } = yield select(state => state.employees)

    try {
        yield put(updateEmployees({
            form: { ...form, filtering: true }
        }))

        const { data: res } = yield call(rest.post, `/employee/filter`, {
            filters: {
                email: employee.email,
                status: 'active'
            }
        })

        if (res.error) {
            console.log(res.message)
            return false
        }

        if (res.employees.length > 0) {
            yield put(updateEmployees({
                employee: res.employees[0],
                form: { ...form, filtering: false, disabled: true }
            }))
        } else {
            yield put(updateEmployees({
                form: { ...form, disabled: false }
            }))
        }

    } catch (error) {
        yield put(updateEmployees({
            form: { ...form, filtering: false }
        }))
        console.log(error.message)
    }

}

export function* addEmployees() {
    const { form, employee, components, behavior } = yield select(state => state.employees)

    try {
        yield put(updateEmployees({ form: { ...form, saving: true } }))
        let res = {}

        if (behavior === 'create') {
            const response = yield call(rest.post, `/employee`, {
                hall: '60b92a65806460dd54a02098',
                employee
            })
            res = response.data

        } else {
            const response = yield call(rest.put, `/employee/${employee._id}`, {
                bondId: employee.relationshipId,
                status: employee.relationshipStatus,
                services: employee.services
            })
            res = response.data
        }


        yield put(updateEmployees({ form: { ...form, saving: false } }))

        if (res.error) {
            console.log(res.message)
            return false
        }

        yield put(allEmployeesAction())
        yield put(updateEmployees({
            components: {
                ...components,
                saving: false, 
                drawer: false 
            }
        }))
        yield put(resetEmployees())


    } catch (error) {
        yield put(updateEmployees({ form: { ...form, saving: false } }))
        console.log(error.message)
    }

}

export function* unlinkEmployees() {
    try {

    } catch (error) {
        console.log(error.message)
    }

}

export function* allServices() {
    const { form, services } = yield select(
        (state) => state.employees
    )

    try {
        yield put(updateEmployees({ form: { ...form, filtering: true } }))

        const { data: res } = yield call(
            rest.get, `/hall/services/60b6f33a8dd0cb8eb0fb36d3`
        )

        yield put(updateEmployees({ form: { ...form, filtering: false } }))

        if (res.error) {
            console.log(res.message)
            return false
        }

        yield put(updateEmployees({
            services: res.services
        }))

    } catch (error) {
        yield put(updateEmployees({
            form: { ...form, filtering: false }
        }))
        console.log(error.message)
    }

}



export default all([
    takeLatest(types.ALL_EMPLOYEES, allEmployees),
    takeLatest(types.FILTER_EMPLOYEES, filterEmployees),
    takeLatest(types.ADD_EMPLOYEES, addEmployees),
    takeLatest(types.UNLINK_EMPLOYEES, unlinkEmployees),
    takeLatest(types.SERVICES_EMPLOYEES, allServices),
])