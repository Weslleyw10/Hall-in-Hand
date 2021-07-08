import { takeLatest, all, call, put, select } from 'redux-saga/effects'

import { 
    updateServices,
    allServices as allServicesAction,
    removeMediaServices as removeMediaServicesAction,
    resetServices
} from './actions'

import rest from '../../../services/rest'
import types from './types'

export function* allServices() {
    try {

        const { data: res } = yield call(
            rest.get,
            `/service/hall/60b92a65806460dd54a02098`
        )

        if(res.error) {
            console.log(res.message)
            return false
        }

        yield put(updateServices({
            services: res
        }))
        
    } catch (error) {
        console.log(error.message)
    }
}

export function* removeMediaServices({ key }) {
    const { form } = yield select(
        state => state.services
    )

    try {
        yield put(updateServices({ form: { ...form, saving: true } }))
        const { data: res } = yield call(
            rest.post,
            `/service/media`,
            { key }
        )

        if (res.error) {
            console.log(res.message)
            return false
        }

        yield put(updateServices({ form: { ...form, saving: false } }))
        
    } catch (error) {
        console.log(error.message)
        yield put(updateServices({ form: { ...form, saving: false } }))
    }



}

export function* saveService() {
    const { service, form, components, behavior } = yield select(state => state.services)
    
    try {
        yield put(updateServices({
            form: {...form, saving: true}
        }))

        const formData = new FormData()
        formData.append('service', JSON.stringify({
            title: service.title,
            price: service.price,
            commission: service.commission, 
            duration: service.duration,
            recurrence: service.recurrence, 
            description: service.description,
            hall: service.hall
        }))

        formData.append('hallId', '60b92a65806460dd54a02098')

        service.medias.map((file, index) => {
            formData.append(`file_${index}`, file)
        })

        const {data: res} = yield call(
            behavior === 'create' ? rest.post : rest.put,
            behavior === 'create' ? 'service' : `/service/${service._id}`,
            formData
        )

        if(res.error) {
            console.log(res.message)
            return false
        }

        yield put(allServicesAction())
        yield put(updateServices({
            components: { ...components, drawer: false },
            form: { ...form, saving: false }
        }))
        yield put(resetServices())
        
    } catch (error) {
        console.log(error.message)
        yield put({
            form: {...form, saving: false}
        })
    }
}

export function* deleteService() {
    const { form, service} = yield select(state => state.services)

    try {
        yield put(updateServices({
            form: {...form, saving: true}
        }))

        const { data: res } = yield call(
            rest.delete,
            `service/${service._id}`
        )

        if (res.error) {
            console.log(res.message)
            return false
        }

        yield put(allServicesAction())

        yield put(updateServices({
            form: {...form, saving: false},
            components: {drawer: false, confirmDelete: false}
        }))

        yield put(resetServices())
        

        
    } catch (error) {
        console.log(error.message)
        yield put(updateServices({
            form: {...form, loading: false}
        }))
    }
}


export default all([
    takeLatest(types.ALL_SERVICES, allServices),
    takeLatest(types.REMOVE_MEDIA_SERVICES, removeMediaServices),
    takeLatest(types.SAVE_SERVICES, saveService),
    takeLatest(types.REMOVE_SERVICES, deleteService),
])

