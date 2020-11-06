import React, {useReducer} from 'react';
import CalendarContext from './calendarContext';
import CalendarReducer  from './calendarReducer';

import {
    EVENTOS_CALENDARIO,
    AGREGAR_EVENTO
} from './calendarTypes';

const CalendarState = props => {
    const initialState = {
        eventoscalendario: [
            {
                id: createEventId(),
                title: 'All-day event',
                start: todayStr,
                color: `#${addColor}`
              },
              {
                id: createEventId(),
                title: 'Timed event',
                start: todayStr + 'T12:00:00',
                color: `purple`
              }, //Formato: Año - Mes - Dia,
        ],
        errorevento: false,
        eventoseleccionado: null
    }
    //Crear dispatch y state
    const [state, dispatch] = useReducer(CalendarReducer, initialState)

    //Crear las funciones

    //Obtener los eventos del calendario
    const obtenerEventos = async usuario => {
        try {
            
        } catch (error) {
            
        }
    }
    //Agregar evento
    const agregarEvento = async evento => {
        dispatch({
            type: AGREGAR_EVENTO,
            payload: evento
        });
    }
    return(
        <CalendarContext.Provider
            value={
                {
                    eventoscalendario: state.eventoscalendario,
                    errorevento: state.errorevento,
                    eventoseleccionado: state.eventoseleccionado,
                    obtenerEventos,
                    agregarEvento
                }
            }
        >
            {props.children}
        </CalendarContext.Provider>
    )
}

export default CalendarState