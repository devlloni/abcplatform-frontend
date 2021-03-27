import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom'
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import useWindowSize from '../../../hooks/useWindowSize';
import { shortId, shortTitle } from '../../../helpers/shortStringId';
import Swal from 'sweetalert2';
import incidentContext from '../../../context/Incidentes/incidentContext';
import ReactExport from 'react-export-excel'
import moment from 'moment';
import { Checkbox } from 'primereact/checkbox';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const AccidentesPersona = () => {
    
    let history = useHistory();

    const { incidentesPersona, msg, loadingIncidentesPersona, getIncidentesPersona, deleteIncidentePersona } = React.useContext(incidentContext)

    const myToast = useRef(null);
    const { width } = useWindowSize();

    // const [ incidentesPersona, setIncidentesPersona ] = useState(null);
    const [ globalFilter, setGlobalFilter ] = useState('');
    const [ windowSize, setWindowSize ] = useState(width);
    useEffect( ()=>{
        setWindowSize(width);
    }, [, width])

    const [ selectedIncidents, setSelectedIncidents ] = useState([]);

    useEffect(()=>{
        if(!incidentesPersona && loadingIncidentesPersona){
            console.log('effect run')
            getIncidentesPersona();
        }
    }, [, incidentesPersona, loadingIncidentesPersona])

    // TEST
    
    const showToast = (severityValue, summaryValue, detailValue) => {   
        myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
    }

    const newIncidente = () => {
        return history.push('/incidentes/persona');
    }

    const editIncidente = e => {
        history.push(`/incidentes/persona/${e._id}`);
    }

    const deleteIncidente = async e => {
        Swal.fire({
            title: 'Confirmación de ELIMINACIÓN de incidente.',
            text: `Al aceptar, confirma la eliminación permanente del incidente titulado <b>${e.titulo}</b>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Borrar',
            cancelButtonText: 'No, conservar'
          }).then(async (result) => {
            if (result.value) {
                deleteIncidentePersona(e._id);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              return Swal.fire('¡Okey!', 'El incidente está a salvo y no fué eliminado.', 'warning');
            }
          })
    }

    const handleDelete = async e => {
        console.log(selectedIncidents);
        // setSelectedIncidents([]);
    }

    //! PDF export

    const generateExcel = () => {
        if(incidentesPersona){
            console.log(incidentesPersona);
        }
    }

    const generateData = () => {

    }

    const generateHeaders = () => {

    }

    //* Components
    const TableHeader = (
        <div className='table-header'>
            Lista de Incidentes de personas
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

    const handleCheck = id => {
        if(selectedIncidents.indexOf(id, 0) === -1){
            setSelectedIncidents([...selectedIncidents, id])
        }else{
            let data = [...selectedIncidents];
            let i = data.indexOf(id, 0);
            data.splice(i, 1);
            setSelectedIncidents(data);
        }
    }
    

    const tituloBody = rawData => {
        let isChecked = false;
        if(selectedIncidents.indexOf(rawData._id, 0) !== -1){
            isChecked = true
        }else{
            isChecked = false;
        }
        
        return(
            <div>
                <span className='p-column-title' style={{marginRight: '0.5em'}}>
                    <Checkbox 
                        checked={isChecked}
                        onChange={() => handleCheck(rawData._id)}
                    />
                </span>
                { width < 600 ? shortTitle(rawData.titulo) : rawData.titulo}

            </div>
        )
    }
    const companiaBody = rawData => {
        return(
            <div>
                { width < 600 ? shortId(rawData.compania) : rawData.compania}
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
            <h5 className='center'>Lista de incidentes (persona) </h5>
            <Toast 
                ref={myToast}
            />
            <div className='card'>
                <div className="p-grid p-fluid" style={{
                    marginTop: '1em',
                    marginLeft: '0.3em'
                }}>
                    <div className='p-col-12 p-md-3'>
                        <Button 
                        label="Nuevo" 
                        icon={ width < 320 ? '' : "pi pi-plus" }
                        className="p-button-info p-mr-2" 
                        onClick={(e)=> newIncidente()} 
                        />
                    </div>
                    <div className='p-col-12 p-md-3'>
                        <Button 
                            label="Eliminar" 
                            icon="pi pi-trash" 
                            className="p-button-danger" 
                            disabled={ selectedIncidents.length > 0 ? false : true }
                            onClick={(e)=> handleDelete()}
                        />
                    </div>
                    <div className='p-col-12 p-md-3'>
                        <Button 
                            label='Exportar a PDF'
                            className='p-button-help'
                            disabled={true}
                        />
                    </div>
                    <div className='p-col-12 p-md-3'>
                            <ExcelFile
                                element={
                                    <Button 
                                    label="Exportar a Excel" 
                                    icon="pi pi-save" 
                                    className="p-button-success" 
                                    // disabled={true}
                                    onClick={(e)=> e.preventDefault()}
                                    />
                                }
                                filename={`[ABC] IncidentesPersona_${moment(new Date()).format('l')}`}
                            >
                                <ExcelSheet data={incidentesPersona} name="Incidentes persona" >
                                    <ExcelColumn 
                                        label="_id" 
                                        value="_id"
                                        style={ {width: {wcx: 40}} }
                                        cellStyle={ {width: {wcx: 40}} }
                                    />
                                    <ExcelColumn 
                                        label="titulo" 
                                        value="titulo"
                                        style={ {width: {wcx: 40}} }
                                    />
                                    <ExcelColumn 
                                        label="Companía"
                                        value='compania'
                                    />
                                    <ExcelColumn 
                                        label="Denuncia"
                                        value="denuncia"
                                    />
                                </ExcelSheet>
                            </ExcelFile>
                    </div>
                </div>
                {incidentesPersona ? (
                <div className='datatable-filter-demo'>
                    <div className='card'>
                        <DataTable
                            value={incidentesPersona}
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
 
export default AccidentesPersona;