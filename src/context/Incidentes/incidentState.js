import React, {useReducer} from 'react';
import IncidentContext from './incidentContext';
import IncidentReducer from './incidentReducer';
import clienteAxios from '../../config/clienteAxios';

    //Importamos los types.
    import { 
        GET_INCIDENTS, 
        SUCCESFUL_GET_P,
        ERROR_GET,
        SUCCESFUL_DELETE_P,
        ERROR_DELETE_P,
        ERROR_GET_PP,
        SUCCESFUL_GET_PP,
        SUCCESFUL_DELETE_PP,
        ERROR_DELETE_PP
    } from './incidentTypes';

const IncidentState = props => {

    const initialState = {
        currentIncidient: null,
        incidentesPersona: null,
        msg: null,
        loadingIncidentesPersona: true,
        loadingCurrent: true,
        // ---------
        incidentesPropiedad: null,
        loadingIncidentesPropiedad: true,
        msgPP: null
    }

    const [ state, dispatch ] = useReducer(IncidentReducer, initialState);

    //Retornar el usuario autenticado.

    const getIncidentesPersona = async () => {
        const resp = await clienteAxios.get('/incidentespersona/');
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

    const deleteIncidentePersona = async ( id ) => {
        const resp = await clienteAxios.post('/incidentespersona/delete', {id: id});
        if(resp.status === 200){
            dispatch({
                type: SUCCESFUL_DELETE_P,
                payload: id
            });
        }else{
            dispatch({
                type: ERROR_DELETE_P
            })
        }
    }

    const getIncidentesPropiedad = async () => {
        const resp = await clienteAxios.get('/incidentespropiedad/');
        if(resp.status === 200){
            dispatch({
                type: SUCCESFUL_GET_PP,
                payload: resp.data.incidentes
            });
        }else{
            dispatch({
                type: ERROR_GET_PP
            });
        }
    }

    const deleteIncidentePropiedad = async ( id ) => {
        const resp = await clienteAxios.post('/incidentespropiedad/delete/', {id: id});
        if(resp.status === 200){
            dispatch({
                type: SUCCESFUL_DELETE_PP,
                payload: id
            });
        }else{
            dispatch({
                type: ERROR_DELETE_PP
            })
        }
    }

    //* Provider
    return (
        <IncidentContext.Provider
            value={{
                currentIncident: state.currentIncident,
                incidentesPersona: state.incidentesPersona,
                msg: state.msg,
                loadingIncidentesPersona: state.loadingIncidentesPersona,
                loadingCurrent: state.loadingCurrent,
                getIncidentesPersona,
                getIncidentesPropiedad,
                deleteIncidentePersona,
                // ------
                incidentesPropiedad: state.incidentesPropiedad,
                loadingIncidentesPropiedad: state.loadingIncidentesPropiedad,
                msgPP: state.msgPP,
                getIncidentesPropiedad,
                deleteIncidentePropiedad
            }}
        >
            {props.children}
        </IncidentContext.Provider>
    )
}

export default IncidentState;
