import {
    OBTENER_USUARIO,
    LOGIN_EXITOSO,
    LOGIN_ERROR,
    CERRAR_SESION
} from './authTypes';
import Swal from 'sweetalert2';

export default ( state, action ) => {
    switch(action.type){
        case LOGIN_EXITOSO:
            localStorage.setItem('token', action.payload.token);
            return{
                ...state,
                autenticado: true,
                mensaje: null,
                cargando: false
            }
        case CERRAR_SESION:
        case LOGIN_ERROR:
            localStorage.removeItem('token');
            // Swal.fire('Oops..',
            // action.payload,
            // 'error'
            // );
            return{
                ...state,
                token: null,
                usuario: null,
                autenticado: null,
                mensaje: action.payload,
                cargando: false
            }
        case OBTENER_USUARIO:
            return{
                ...state,
                autenticado: true,
                usuario: action.payload,
                cargando: false
            }
        default:
            return state;
    }
}