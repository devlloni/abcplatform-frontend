import React, {useReducer} from 'react';
import EmpleadosContext from './empleadosContext';
import EmpleadosReducer from './empleadosReducer';
import clienteAxios from '../../config/clienteAxios';

    //Importamos los types.
    import { 
        SUCCESFULL_GET,
        ERROR_GET
    } from './empleadosTypes';

const EmpleadosState = props => {

    const initialState = {
        empleados: null,
        currentEmpleado: null,
        loading: true,
        roles: null,
        loadingRoles: true
    }

    const [ state, dispatch ] = useReducer(EmpleadosReducer, initialState);

    //Retornar el usuario autenticado.

    const getEmpleados = async () => {
        const resp = await clienteAxios.get('/usuarios/empleados');
        if(resp.status === 200){
            dispatch({
                type: SUCCESFUL_GET_P,
                payload: resp.data
            });
        }else{
            dispatch({
                type: ERROR_GET
            });
        }
    }

    const getCurrentEmpleado = async () => {
        const resp = await clienteAxios.get('')
    }

    // const deleteIncidentePersona = async ( id ) => {
    //     const resp = await clienteAxios.post('/incidentespersona/delete', {id: id});
    //     if(resp.status === 200){
    //         dispatch({
    //             type: SUCCESFUL_DELETE_P,
    //             payload: id
    //         });
    //     }else{
    //         dispatch({
    //             type: ERROR_DELETE_P
    //         })
    //     }
    // }

    // const getIncidentesPropiedad = async () => {
    //     const resp = await clienteAxios.get('/incidentespropiedad/');
    //     if(resp.status === 200){
    //         dispatch({
    //             type: SUCCESFUL_GET_PP,
    //             payload: resp.data.incidentes
    //         });
    //     }else{
    //         dispatch({
    //             type: ERROR_GET_PP
    //         });
    //     }
    // }

    // const deleteIncidentePropiedad = async ( id ) => {
    //     const resp = await clienteAxios.post('/incidentespropiedad/delete/', {id: id});
    //     if(resp.status === 200){
    //         dispatch({
    //             type: SUCCESFUL_DELETE_PP,
    //             payload: id
    //         });
    //     }else{
    //         dispatch({
    //             type: ERROR_DELETE_PP
    //         })
    //     }
    // }

    //* Provider
    return (
        <EmpleadosContext.Provider
            value={{
                empleados: state.empleados,
                loading: state.loading,
                currentEmpleado: state.currentEmpleado,
                roles: state.roles,
                loadingRoles: state.loadingRoles,
                getEmpleados,

            }}
        >
            {props.children}
        </EmpleadosContext.Provider>
    )
}

export default EmpleadosState;
