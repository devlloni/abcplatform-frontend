import React, { useEffect, useState, useRef } from 'react';
import clienteAxios from '../../../config/clienteAxios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import useWindowSize from '../../../hooks/useWindowSize';
const AccidentesPersona = () => {

    const { width } = useWindowSize();

    const [ incidientesPropiedad, setIncidientesPropiedad ] = useState(null);
    const [ globalFilter, setGlobalFilter ] = useState('');

    useEffect( ()=>{
        if(!incidientesPropiedad){

        }
    }, [])

    const getIncidentes = async () => {
        const resp = await clienteAxios.get('/incidentespersona/');
        console.log(resp.data);
    }

    return ( 
        <h1>Accidentes propiedad HOME.</h1>
     );
}
 
export default AccidentesPersona;