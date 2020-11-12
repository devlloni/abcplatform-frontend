import {
    EVENTOS_CALENDARIO,
    AGREGAR_EVENTO
} from './calendarTypes';

export default (state, action) => {
    switch(action.type){
        case EVENTOS_CALENDARIO:
            return {
                ...state,
                eventoscalendario: action.payload
            }
        case AGREGAR_EVENTO:
            return {
                ...state,
                eventoscalendario: [action.payload, ...state.eventoscalendario]
            }
        default:
            return state;
    }
}