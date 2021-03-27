import {
    SUCCESFULL_GET
} from './empleadosTypes';


export default ( state, action ) => {
    switch(action.type){
        case SUCCESFULL_GET:
            return{
                ...state,
                // incidentesPersona: action.payload,
                // loadingIncidentesPersona: false
            }
        
        default:
            return state;
    }
}