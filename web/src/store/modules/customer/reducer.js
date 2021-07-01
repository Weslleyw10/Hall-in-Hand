import produce from 'immer'
import types from './types'

const INITIAL_STATE = {
    customers: [],
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
    customer: {
        email: '',
        name: '',
        phone: '',
        birthDate: '',
        gender: 'M',
        document: {
          documentType: 'cpf',
          document: '',
        },
        address: {
          address: '',
          city: '',
          state: '',
          zipcode: '',
          number: '',
          country: 'br',
        },
        hallRelationship: ''
      },
}

function customer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.UPDATE_CUSTOMERS:
            return produce(state, (draft) => {
                draft = { ...draft, ...action.payload }
                return draft
            })
            break;
        
        case types.RESET_CUSTOMERS:
            return produce(state, (draft) => {
                draft.customer = INITIAL_STATE.customer
                return draft
            })    
            break;

        default:
            return state
    }

}

export default customer