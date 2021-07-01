import { all, takeLatest, call, put } from 'redux-saga/effects'

import rest from '../../../services/rest'
import { updateScheduling } from './actions'
import types from './types'


export function* filterScheduling({ start, end }) {
    try {
        const { data: res } = yield call(rest.post, '/scheduling/filter', {
            hallId: "60b92a65806460dd54a02098",
            period: {
                start: start,
                end: end
            }
        })

        if(res.error) {
            console.log(res.message)
            return false
        }

        yield put(updateScheduling(res))
        
    } catch (error) {
        console.log(error.message)

    }


}

export default all([takeLatest(types.SCHEDULING_FILTER, filterScheduling)])