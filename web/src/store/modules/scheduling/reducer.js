import produce from 'immer'
import types from './types'

const INITIAL_STATE = {
    schedulings: []
}

function scheduling(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.SCHEDULING_UPDATE:
            return produce(state, (draft) => {
                draft.schedulings = action.schedulings
                return draft
            })
            break;
        
        default:
            return state
    }
}

export default scheduling
