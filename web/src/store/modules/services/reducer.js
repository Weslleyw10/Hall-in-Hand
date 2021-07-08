import produce from 'immer';
import types from './types'
import moment from 'moment'

const INITIAL_STATE = {
    services: [],
    behavior: "create",
    components: {
        drawer: false,
        confirmDelete: false
    },
    form: {
        filtering: false,
        disabled: true,
        saving: false
    },
    service: {
        _id: '',
        title: '',
        description: '',
        hall: '60b92a65806460dd54a02098',
        price: '',
        commission: '',
        duration: moment('00:30','HH:mm').format(),
        recurrence: '',
        status: 'active',
        createdAt: '',
        updatedAt: '',
        medias: []

      }
}

function services (state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.UPDATE_SERVICES:
            return produce(state, (draft) => {
                draft = {
                    ...draft,
                    ...action.payload
                }
                return draft
            })
            break;
        
        case types.RESET_SERVICES:
            return produce(state, (draft) => {
                draft.service = INITIAL_STATE.service
                return draft
            })
            break;

        default:
            return state

    }
}


export default services
