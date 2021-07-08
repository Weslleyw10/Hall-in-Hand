import produce from 'immer'
import types from './types'

const INITIAL_STATE = {
    customers: [],
    behavior: "create",
    components: {
        drawer: false,
        confirmDelete: false,
        view: 'week'
    },
    form: {
        filtering: false,
        disabled: true,
        saving: false
    },
    employees: [],
    services: [],
    schedules: [],
    schedules: {
        hall: '',
        specialties: [],
        employees: [],
        days: [],
        start: '',
        end: ''
      },
}

function schedule(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.UPDATE_SCHEDULE:
            return produce(state, (draft) => {
                draft = { ...draft, ...action.payload }
                return draft
            })
            break;
        
        case types.RESET_SCHEDULE:
            return produce(state, (draft) => {
                draft.schedule = INITIAL_STATE.schedule
                return draft
            })    
            break;

        default:
            return state
    }

}

export default schedule