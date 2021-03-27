import {
    GET_INCIDENTS,
    ERROR_GET,
    SUCCESFUL_GET_P,
    SUCCESFUL_DELETE_P,
    ERROR_DELETE_P,
    SUCCESFUL_GET_PP,
    ERROR_GET_PP,
    SUCCESFUL_DELETE_PP
} from './incidentTypes';


export default ( state, action ) => {
    switch(action.type){
        case SUCCESFUL_GET_P:
            return{
                ...state,
                incidentesPersona: action.payload,
                loadingIncidentesPersona: false
            }
        case SUCCESFUL_GET_PP:
            return{
                ...state,
                incidentesPropiedad: action.payload,
                loadingIncidentesPropiedad: false
            }
        case ERROR_GET_PP:
            return{
                ...state,
                msgPP: 'Error del servidor, por favor, intentalo en unos momentos.'
            }
        // 
        case ERROR_DELETE_P:
        case ERROR_GET:
            return{
                ...state,
                msg: 'Error del servidor, por favor, intentalo en unos momentos.'
            }
        case SUCCESFUL_DELETE_P:
            return{
                ...state,
                incidentesPersona: state.incidentesPersona.filter(i => i._id !== action.payload)
            }
        case SUCCESFUL_DELETE_PP:
            return{
                ...state,
                incidentesPropiedad: state.incidentesPropiedad.filter(i => i._id !== action.payload)
            }
        
        default:
            return state;
    }
}