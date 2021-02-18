import React, {useReducer} from 'react';
import AuthContext from './authContext';
import AuthReducer from './authReducer';
import clienteAxios from '../../config/clienteAxios';
import tokenAuth from '../../config/tokenAuth';

//Importamos los types.
import { 
    LOGIN_ERROR,
    LOGIN_EXITOSO,
    OBTENER_USUARIO,
    CERRAR_SESION,
    AUTH_ERROR
} from './authTypes';
import Swal from 'sweetalert2';

const AuthState = props => {

    const initialState = {
        token: localStorage.getItem('token'),
        autenticado: null,
        usuario: null,
        mensaje: null,
        cargando: true
    }

    const [ state, dispatch ] = useReducer(AuthReducer, initialState);

    //Retornar el usuario autenticado.
    const usuarioAutenticado = async () => {
        const token = localStorage.getItem('token');
        if(token){
            tokenAuth(token);
        }
        try {
            const respuesta = await clienteAxios.get('/auth');
            dispatch({
                type: OBTENER_USUARIO,
                payload: respuesta.data
            });
        } catch (error) {
            const alerta = {
                // msg: error.response.data.msg
                msg: 'Error al iniciar sesión'
            } 
            //Este deberíamos de cambiarlo por AUTH_ERROR, ya que no queremos enviar mensaje en autenticación, solo en logueo.
            dispatch({
                type: AUTH_ERROR
                // payload: alerta
            })
        }
    }
    
    //Usuario inicia sesion
    const iniciarSesion = async datos => {
        const respuesta = await clienteAxios.post('/auth', datos);
        if(respuesta.data.token){
            dispatch({
                type: LOGIN_EXITOSO,
                payload: respuesta.data
            });
            usuarioAutenticado();
        }
        else{
            dispatch({
                type: LOGIN_ERROR,
                payload: respuesta.data.msg
            });
        }

        // try {
        //     const respuesta = await clienteAxios.post('/auth', datos);
        //     console.log(respuesta);
        //     dispatch({
        //         type: LOGIN_EXITOSO,
        //         payload: respuesta.data
        //     });
        //     //Obtiene el usuario autenticado
        //     usuarioAutenticado();
        // } catch (error) {
        //     console.log(error);
        //     const alerta = {
        //         // msg: error.response.data.msg,
        //         msg: 'Error al iniciar sesión'
        //     }
        //     dispatch({
        //         type: LOGIN_ERROR,
        //         payload: alerta
        //     });
            
        // }
    }
    const cerrarSesion = () => {
        dispatch({
            type: CERRAR_SESION
        });
    }

    //* Provider
    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                autenticado: state.autenticado,
                usuario: state.usuario,
                mensaje: state.mensaje,
                cargando: state.cargando,
                iniciarSesion,
                usuarioAutenticado,
                cerrarSesion
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthState;
