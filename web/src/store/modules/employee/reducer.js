import produce from 'immer'
import types from './types'

const INITIAL_STATE = {
    behavior: "create",
    components: {
        drawer: false,
        confirmDelete: false,
        saving: false
    },
    form: {
        filtering: false,
        disabled: true,
        saving: false
    },
    services: [],
    employees: [],
    employee: {
        email: '',
        name: '',
        phone: '',
        birthDate: '',
        gender: 'M',
        status: 'active',
        relationshipId: '',
        relationshipStatus: '',
        bankAccount: {
            owner: '',
            document: '',
            bank: '',
            accountType: '',
            bankAgency: '',
            numberAccount: '',
            verifyingDigit: '',
        },
        recipientId: '',
        services: []
    }
}

function employee (state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.UPDATE_EMPLOYEES:
            return produce(state, (draft) => {
                draft = { ...draft, ...action.payload }
                return draft
            })
            break;

        case types.RESET_EMPLOYEES:
            return produce(state, (draft) => {
                draft.employee = INITIAL_STATE.employee
                return draft
            })
            break;

        default:
            return state
    }
}

export default employee
