import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom'
import clienteAxios from '../../../config/clienteAxios';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import useWindowSize from '../../../hooks/useWindowSize';
const AccidentesPropiedad = () => {
    let history = useHistory();

    const myToast = useRef(null);
    const { width } = useWindowSize();

    const [ incidientesPropiedad, setIncidientesPropiedad ] = useState(null);
    const [ globalFilter, setGlobalFilter ] = useState('');

    useEffect( ()=>{
        if(!incidientesPropiedad){
            getIncidentes();
        }   
    }, [])

    //*Funcs
    const getIncidentes = async () => {
        const resp = await clienteAxios.get('/incidentespropiedad/');
        if(resp.status === 200){
            const { incidentes } = resp.data;
            if(!incidentes){
                return showToast('error', '¡Oops!', 'Error en el servidor, no pudimos obtener los incidentes de la base de datos.');
            }else{
                setIncidientesPropiedad(incidentes);
            }
        }else{
            return showToast('error', '¡Oops!', 'Ocurrió un error desconocido en el servidor, por favor, informe a su webmaster.');
        }
        console.log(resp.data);
    }

    const showToast = (severityValue, summaryValue, detailValue) => {   
        myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
    }

    const newIncidente = () => {

    }

    const editIncidente = e => {
        history.push(`/incidentes/propiedad/${e._id}`);
    }

    const deleteIncidente = e => {

    }

    //* Components
    const TableHeader = (
        <div className='table-header'>
            Lista de Incidentes a la propiedad
            <span className='p-input-icon-left'>
                <i className='pi pi-search' />
                <InputText type='search' onInput={(e)=>setGlobalFilter(e.target.value)} placeholder='Filtros globales' />
            </span>
        </div>
    );

    const actionBody = (rawData) => {
        return(
            <div className='p-text-center'>
                <Button icon='pi pi-pencil' className='p-button-rounded p-button-success p-mr-2' onClick={() => editIncidente(rawData)} />
                <Button icon='pi pi-trash' className='p-button-rounded p-button-danger p-mr-2' onClick={() => deleteIncidente(rawData)} />
            </div>
        )
    }
    const tituloBody = rawData => {
        return(
            <div>
                <span className='p-column-title'></span>
                {rawData.titulo}
            </div>
        )
    }
    const companiaBody = rawData => {
        return(
            <div>
                {rawData.compania}
            </div>
        )
    }
    const gravedadBody = rawData => {
        return(
            <div>
                {rawData.gravedad}
            </div>
        )
    }

    return ( 
        <div className="datatable-crud-demo"style={
            {paddingBottom: '50px',marginTop: '0.8em', marginLeft: '0.8em', marginRight: '0.8em'}
        }>
            <h5 className='center'>Lista de incidentes (propiedad) </h5>
            <Toast 
                ref={myToast}
            />
            <div className='card'>
                <div className="p-grid p-fluid" style={{
                    marginTop: '1em',
                    marginLeft: '0.3em'
                }}>
                    <div className='p-col-3'>
                        <Button 
                        label="Nuevo" 
                        icon={ width < 320 ? '' : "pi pi-plus" }
                        className="p-button-success p-mr-2" 
                        onClick={(e)=> newIncidente()} 
                        />
                    </div>
                    <div className='p-col-3'>
                        <Button 
                            label="Eliminar" 
                            icon="pi pi-trash" 
                            className="p-button-danger" 
                            disabled={true}
                            onClick={(e)=> e.preventDefault()}
                        />
                    </div>
                    <div className='p-col-3 p-offest-3'>
                            <Button 
                                label="Exportar" 
                                icon="pi pi-upload" 
                                className="p-button-help" 
                                onClick={(e)=>e.preventDefault()} 
                            />
                    </div>
                </div>
                {incidientesPropiedad ? (
                <div className='datatable-filter-demo'>
                    <div className='card'>
                        <DataTable
                            value={incidientesPropiedad}
                            className='p-datatable-responsive-demo'
                            paginator rows={6}
                            header={TableHeader}
                            globalFilter={globalFilter}
                        >
                            <Column 
                                field="titulo"
                                header="Título incidente"
                                body={tituloBody}
                                filter={true}
                                filterPlaceholder="Buscar por título"
                            />
                            <Column 
                                field="compania"
                                header="ID Companía asociada"
                                body={companiaBody}
                                filter={true}
                                filterPlaceholder="Buscar por ID companía"
                            />
                            <Column 
                                field='gravedad'
                                header='Gravedad'
                                body={gravedadBody}
                                filter={true}
                                filterPlaceholder={"Buscar por gravedad"}
                            />
                            <Column 
                                body={actionBody}
                            />
                        </DataTable>
                    </div>
                </div>
                )
                :
                (
                <div className='center p-mt-6 p-mb-6'>
                    <ProgressSpinner />
                </div>
                )
                }
            </div>
        </div>
     );
}
 
export default AccidentesPropiedad;