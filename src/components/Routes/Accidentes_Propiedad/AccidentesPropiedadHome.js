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
import { shortId, shortTitle } from '../../../helpers/shortStringId';
import incidentesContext from '../../../context/Incidentes/incidentContext';
import jspdf from 'jspdf';
import ReactExport from 'react-export-excel';

import Swal from 'sweetalert2';
import moment from 'moment';


const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const AccidentesPropiedad = () => {
    
    let history = useHistory();

    const { incidentesPropiedad, loadingIncidentesPropiedad, getIncidentesPropiedad, deleteIncidentePropiedad } = React.useContext(incidentesContext);


    const myToast = useRef(null);
    const { width } = useWindowSize();

    const [ globalFilter, setGlobalFilter ] = useState('');
    const [ windowSize, setWindowSize ] = useState(width);
    useEffect( ()=>{
        // 
        setWindowSize(width);
    }, [, width])

    useEffect(()=>{
        if(!incidentesPropiedad && loadingIncidentesPropiedad){
            getIncidentesPropiedad();
        }
    }, [, incidentesPropiedad, loadingIncidentesPropiedad])

    //*Funcs

    const htmltoText = (html) => {
        let text = html;
        text = text.replace(/\n/gi, "");
        text = text.replace(/<style([\s\S]*?)<\/style>/gi, "");
        text = text.replace(/<script([\s\S]*?)<\/script>/gi, "");
        text = text.replace(/<a.*?href="(.*?)[\?\"].*?>(.*?)<\/a.*?>/gi, " $2 $1 ");
        text = text.replace(/<\/div>/gi, "\n\n");
        text = text.replace(/<\/li>/gi, "\n");
        text = text.replace(/<li.*?>/gi, "  *  ");
        text = text.replace(/<\/ul>/gi, "\n\n");
        text = text.replace(/<\/p>/gi, "\n\n");
        text = text.replace(/<br\s*[\/]?>/gi, "\n");
        text = text.replace(/<[^>]+>/gi, "");
        text = text.replace(/^\s*/gim, "");
        text = text.replace(/ ,/gi, ",");
        text = text.replace(/ +/gi, " ");
        text = text.replace(/\n+/gi, "\n\n");
        return text;
      };

    //Export to Excel
    const generateData = () => {
        var result = [];
        var data = [];
        console.log(incidentesPropiedad)
        if(incidentesPropiedad){
            incidentesPropiedad.forEach( incidente=> {
                data.push({
                    _id: incidente._id,
                    compania: incidente.compania,
                    titulo: incidente.titulo,
                    investigacion: htmltoText(incidente.investigacion),
                    lugar: incidente.lugar,
                    sector: incidente.sector,
                    sucursal: incidente.sucursal,
                    tipoIncidente: incidente.tipoIncidente
                })
            });
            return data;
        }
    }

    const createDataHeaders = keys => {
        var result = [];
        for(var i = 0; i < keys.length; i += 1){{
            result.push({
                id: keys[i],
                name: keys[i],
                prompt: keys[i],
                width: 49,
                align: "center",
                paddding: 0
            })
        }}
        return result;
    }

    const headersPdf = createDataHeaders([
        "_id",
        "compania",
        "titulo",
        "investigacion",
        "lugar",
        "sector",
        "sucursal",
        "tipoIncidente"
    ]);

    const generatePdf = () => {
        var doc = new jspdf({ putOnlyUsedFonts: true, orientation: 'landscape'});
        doc.table(1, 1, generateData(), headersPdf, {autoSize: false, fontSize: 9});
        let title = `Incidentes Propiedad | ABC (${moment(new Date()).format('l')}).pdf`;
        doc.save(title)
    }

    const showToast = (severityValue, summaryValue, detailValue) => {   
        myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
    }

    const newIncidente = () => {
        return history.push('/incidentes/propiedad');
    }

    const editIncidente = e => {
        history.push(`/incidentes/propiedad/${e._id}`);
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
                deleteIncidentePropiedad(e._id);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              return Swal.fire('¡Okey!', 'El incidente está a salvo y no fué eliminado.', 'warning');
            }
          })
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
            <h5 className='center'>Lista de incidentes (propiedad) </h5>
            <Toast 
                ref={myToast}
            />
            <div className='card'>
                <div className="p-grid p-fluid" style={{
                    marginTop: '1em',
                    marginLeft: '0.3em'
                }}>
                    <div className='p-md-3 p-col-12'>
                        <Button 
                        label="Nuevo" 
                        icon={ width < 320 ? '' : "pi pi-plus" }
                        className="p-button-info p-mr-2" 
                        onClick={(e)=> newIncidente()} 
                        />
                    </div>
                    <div className='p-md-3 p-col-12'>
                        <Button 
                            label="Eliminar" 
                            icon="pi pi-trash" 
                            className="p-button-danger" 
                            disabled={true}
                            onClick={(e)=> e.preventDefault()}
                        />
                    </div>
                    <div className='p-col-12 p-md-3'>
                        <Button 
                            label='Exportar a PDF'
                            icon='far fa-file-excel'
                            className='p-button-help'
                            disabled={ incidentesPropiedad && incidentesPropiedad.length > 0 ? false : true }
                            onClick={e => generatePdf()}
                        />
                    </div>
                    <div className='p-col-12 p-md-3'>
                        <ExcelFile
                            element={
                                <Button 
                                    label='Exportar a CSV'
                                    icon='far fa-file-pdf'
                                    className='p-button-success'
                                />
                            }
                        >
                            <ExcelSheet
                                data={incidentesPropiedad}
                                name="Incidentes Propiedad"
                            >
                                <ExcelColumn 
                                    label="_id" 
                                    value="_id"
                                />
                                <ExcelColumn 
                                    label="Título"
                                    value="titulo"
                                />
                                <ExcelColumn 
                                    label="Gravedad"
                                    value="gravedad"
                                />
                                <ExcelColumn 
                                    label="Tipo de incidente"
                                    value="tipoIncidente"
                                />
                                <ExcelColumn 
                                    label="Compania"
                                    value="compania"
                                />
                                <ExcelColumn 
                                    label="Lugar"
                                    value="lugar"
                                />
                                <ExcelColumn 
                                    label="Sector"
                                    value="sector"
                                />
                                
                            </ExcelSheet>
                        </ExcelFile>
                    </div>
                </div>
                {incidentesPropiedad ? (
                <div className='datatable-filter-demo'>
                    <div className='card'>
                        <DataTable
                            id='dataTableIncidentes'
                            value={incidentesPropiedad}
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