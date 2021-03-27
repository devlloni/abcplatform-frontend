import {
    SUCCESFUL_GET_COMPANIES,
    ERROR_GET_COMPANIES
} from './companieTypes';


export default ( state, action ) => {
    switch(action.type){
        case SUCCESFUL_GET_COMPANIES:
            return{
                ...state,
                companies: action.payload,
                loadingCompanies: false
            }
        case ERROR_GET_COMPANIES:
            return{
                ...state,
                msg: 'Error del servidor, por favor, intentalo en unos momentos.'
            }
        default:
            return state;
    }
}