import { takeLatest, all, call, put, select } from 'redux-saga/effects'
import { updateCustomers, allCustomers as allCustomersAction, resetCustomer } from './actions'
import types from './types'
import rest from '../../../services/rest'

export function* allCustomers () {
    const { form } = yield select(state => state.customers)

    try {
        yield put(updateCustomers({ form: {...form, filtering: true } }))
        const { data: res } = yield call(rest.get, `/customer/hall/60b92a65806460dd54a02098`)

        if (res.error) {
            console.log(res.message)
            return false
        }

        yield put(updateCustomers({ 
            form: { ...form, filtering: false },
            customers: res.customers 
        }))
        
    } catch (error) {
        yield put(updateCustomers({ form: {...form, filtering: false} }))
        console.log(error.message)        
    }
}

export function* filterCustomers () {
    const { form, customer } = yield select(state => state.customers)

    try {
        yield put(updateCustomers({ form: { ...form, filtering: true } }))

        const { data: res } = yield call(rest.post, `/customer/filters`, 
            {
                status: 'active',
                email: customer.email
            }
        )

        yield put(updateCustomers({ 
            form: { ...form, filtering: false } 
        }))

        if (res.error) {
            console.log(res.message)
            return false
        }

        if (res.length > 0) {
            yield put(updateCustomers({
                customer: res[0],
                form: { ...form, filtering: false, disabled: true }
            }))

        } else {
            yield put(updateCustomers({ 
                form: { ...form, disabled: false } 
            }))
        }
        
    } catch (error) {
        yield put(updateCustomers({ 
            form: { ...form, filtering: false } 
        }))
        console.log(error.message)
    }
}

export function* addCustomer () {
    const { form, customer, components } = yield select((state) => state.customers)
    
    try {
        yield put(updateCustomers({ form: { ...form, saving: true} }))

        const { data: res } = yield call(rest.post, `/customer`, {
            hall: '60b92a65806460dd54a02098',
            customer
        })

        yield put(updateCustomers({ form: { ...form, saving: false} }))

        if (res.error) {
            console.log(res.message)
            return false
        }

        yield put(allCustomersAction())
        yield put(updateCustomers({ components: { ...components, drawer: false } }))
        yield put(resetCustomer())
        
        
    } catch (error) {
        yield put(updateCustomers({ form: { ...form, saving: false} }))
        console.log(error.message)
    }

}

export function* unlinkCustomer() {
    const { form, customer } = yield select(state => state.customers)

    try {
        const { data: res } = yield call(rest.delete, `/customer/hall/relationship/${customer.hallRelationship}`)

        yield put(updateCustomers({ 
            form: { ...form, saving: false } 
        }))

        if (res.error) {
            console.log(res.error)
            return false
        }

        yield put(allCustomersAction())
        yield put(updateCustomers({ components: { drawer: false, confirmDelete: false } }))
        yield put(resetCustomer())

        
    } catch (error) {
        yield put(updateCustomers({ form: { ...form, saving: false } }))
        console.log(error.message)
    }

}

export default all([
    takeLatest(types.ALL_CUSTOMERS, allCustomers),
    takeLatest(types.FILTER_CUSTOMERS, filterCustomers),
    takeLatest(types.ADD_CUSTOMERS, addCustomer),
    takeLatest(types.UNLINK_CUSTOMERS, unlinkCustomer),
])