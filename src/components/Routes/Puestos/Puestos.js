import React, {Fragment, useState, useEffect, useRef} from 'react';
import Swal from 'sweetalert2';
import useWindowSize from '../../../hooks/useWindowSize';
import clienteAxios from '../../../config/clienteAxios';
import classNames from 'classnames';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Table } from '@fullcalendar/daygrid';
import { InputTextarea } from 'primereact/inputtextarea';
const Puestos = () => {
    document.title = "ABC | Lugares";
    const { width } = useWindowSize();

    const [ puestos, setPuestos ] = useState(null);
    const [ puestoDialog, setPuestoDialog ] = useState(false);
    const [ yaExiste, setYaExiste ] = useState(false);
    const [ enviado, setEnviado ] = useState(false);
    const [ puesto, setPuesto ] = useState({
        id: '',
        nombrePuesto: '',
        idCompania: '',
        nombreCompania: '',
        comentarios: ''
    });
    const [ globalFilter, setGlobalFilter ] = useState('');
    const [ companias, setCompanias ] = useState(null);

    const { nombrePuesto, idCompania, comentarios } = puesto;

    const getPuestos = async () => {
        const resp = await clienteAxios.get('/companias/puestos');
        setPuestos(resp.data.puestos);
        return;
    }

    const getCompanies = async () => {
        const resp = await clienteAxios.get('/companias');
        let companieResp = resp.data;
        let arr = [];
        for(let i = 0; i < companieResp.length; i++){
            arr.push({label: companieResp[i].razonSocial, value: companieResp[i]._id});
        }
        setCompanias(arr);
    }

    const myToast = useRef(null);
    const showToast = (severityValue, summaryValue, detailValue) => {   
        myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
    }

    useEffect( ()=>{
        if(!puestos){
            getPuestos();
        }
        if(!companias){
            getCompanies();
        }
    }, []);

    const reiniciarPuesto = () => {
        setPuesto({
            id: null,
            idCompania: '',
            nombreCompania: '',
            nombrePuesto: '',
            comentarios: ''
        });
        return;
    }

    const showPuestoDialog = e => {  
        setPuestoDialog(true);
    }

    const submitDeletePuesto = async ( id ) => {
        const resp = await clienteAxios.post('/companias/puestos/delete', {id});
        if(resp.status === 200){
            getPuestos();
            return showToast('success', '¡Perfecto!', '¡El puesto fué eliminado con éxito!');
        }else{
            return showToast('error', '¡Error!', '¡Ocurrió un error inesperado! Por favor, inténtalo más tarde.');
        }
    }

    const handleDeletePuesto = (rawData) => {
        Swal.fire({
            title: `¿Estás seguro de eliminar el puesto "${rawData.nombrePuesto}"?`,
            text: 'No podrás volver atrás.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, borrarlo.',
            cancelButtonText: 'No, cancelar.'
          }).then((result) => {
            if (result.value) {
              //! HANDLE DELETE,
              submitDeletePuesto(rawData._id);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire(
                'Cancelado',
                'El lugar sigue conservándose en la base de datos.',
                'warn'
              )
            }
          })
    }

    const submitEditPuesto = async (puesto) => {
        const resp = await clienteAxios.post('/companias/puestos/edit', puesto);
        if(resp.status === 200 && resp.data.msg === 'ok'){
            let msg = `¡El puesto [ "${puesto.nombrePuesto}" ] fué actualizado correctamente.`;
            getPuestos();
            setPuestoDialog(false);
            reiniciarPuesto();
            setYaExiste(false);
            return showToast('success', '¡Exito!', msg);
        }
        if(resp.status === 200 && resp.data.msg === 'exists'){
            setYaExiste(true);
            let msg = `¡El puesto [ "${puesto.nombrePuesto}" ] ya existe! Intente con otro nombre.`;
            return showToast('warn', '¡Atención!', msg);
        }
    }

    const submitNewPuesto = async () => {
        setEnviado(true);
        if(!idCompania || idCompania.length === 0 ||
           !nombrePuesto || nombrePuesto.length === 0    
        ){
            return showToast('error', '¡Error!', '¡Completa todos los campos e intentelo de nuevo!');
        }
        if(puesto._id){
            return submitEditPuesto(puesto);
        }
        else{
            
                const respuesta = await clienteAxios.post('/companias/puestos', puesto);
                if(respuesta.status === 200 && respuesta.data.msg === 'ok'){
                    getPuestos();
                    setEnviado(false);
                    setPuestoDialog(false);
                    reiniciarPuesto();
                    setYaExiste(false);
                    return showToast('success', '¡Puesto cargado con éxito!', 'El puesto fué cargado correctamente en la base de datos.');
                }
                else if(respuesta.status === 200 && respuesta.data.msg === 'exists'){
                    setYaExiste(true);
                    let msg = `¡El puesto [ "${puesto.nombrePuesto}" ] ya existe! Intente con otro nombre.`;
                    return showToast('warn', '¡Atención!', msg);
                }
                else{
                    setYaExiste(false);
                    return showToast('error', '¡Error!', 'Lo sentimos, ocurrió un error inesperrado en el sistema, inténtelo más tarde.');
                }
        }
    }

    const hideDialog = e => {
        setPuestoDialog(false);
        setEnviado(false);
        reiniciarPuesto();
    }

    const onInputChange = e => {
        setPuesto({
            ...puesto,
            [e.target.name] : e.target.value
        });

        if(e.target.name === 'idCompania'){
            //!
            let comp;
            if(companias){
                companias.forEach( companie => {
                    if(companie.value === e.target.value){
                        comp = companie.label;
                        setPuesto({
                            ...puesto,
                            nombreCompania: comp,
                            [e.target.name] : e.target.value
                        });
                    }
                });
            }
        }
        if(e.target.name === 'nombrePuesto'){
            setYaExiste(false);
        }
    }

    const EditPuesto = puesto => {
        setPuesto(puesto);
        setPuestoDialog(true);
    }

    const dialogPuestoFooter = (
                <div>
                    <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={()=> hideDialog()} />
                    <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={()=> submitNewPuesto()} />
                </div>
        );
    

    const TableHeader = (
        <div className="table-header">
                Lista de Puestos
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Filtros globales" />
                </span>
        </div>
    )

    const actionBody = (rawData) => {
        return(
            <div className='p-text-center'>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => EditPuesto(rawData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => handleDeletePuesto(rawData)} />
            </div>
        );
    }

    const headerDialog = (
        <div className='center'>Detalles del puesto</div>
    );

    const idBodyTemplate = rowData => {
        return(
            <Fragment>
                <span className='p-column-title'></span>

                {rowData.nombreCompania}
            </Fragment>
        )
    }

    const nombreBodyTemplate = rawData => {
        return(
            <Fragment>
                <span className='p-column-title'></span>
                {rawData.nombrePuesto}
            </Fragment>
        )
    }
 
    return ( 
        <div className="datatable-crud-demo"style={
            {paddingBottom: '50px',marginTop: '0.8em', marginLeft: '0.8em', marginRight: '0.8em'}
        }>
            <h5 className='center'>Puestos de trabajo</h5>
            <Toast ref={myToast} />
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
                        onClick={(e)=> showPuestoDialog()} 
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
                {puestos ? (
                    <div className='datatable-filter-demo'>
                        <div className='card'>
                        <DataTable
                            value={puestos}
                            className='p-datatable-responsive-demo'
                            paginator rows={4}
                            header={TableHeader}
                            globalFilter={globalFilter}
                        >
                            <Column field="nombrePuesto" header="Nombre" body={nombreBodyTemplate} 
                                filter={true} filterPlaceholder={'Buscar por nombre de lugar'}
                            />
                            <Column field='nombreCompania' header='Companía asociada' body={idBodyTemplate}
                                filter={true} filterPlaceholder='Buscar por Companía.'
                            />
                            <Column  body={actionBody}/>
                        </DataTable>
                        </div>
                    </div>
                ):
                (<div className='center p-mt-6 p-mb-6'>
                    <ProgressSpinner />
                </div>)
                }
                {/* ---- DIALOGS ----  */}
                <Dialog
                    visible={puestoDialog}
                    style={ width < 993 ? {width: '450px'} : {width: '750px'}}
                    header={headerDialog}
                    modal className='p-fluid'
                    footer={dialogPuestoFooter}
                    onHide={()=>hideDialog()}
                >
                    <div className='p-grid p-fluid'>
                        <div className='p-col-12'>
                            <Dropdown 
                                value={idCompania} 
                                name="idCompania"
                                id="idCompania"
                                options={companias} 
                                className={classNames({ 'p-invalid': enviado && !puesto.idCompania })}
                                onChange={(e) => onInputChange(e)} 
                                placeholder="¿A qué compañía está asociado?"
                            />
                            {enviado && !puesto.idCompania && <small className="p-invalid">La compañía asociada es obligatoria.</small>}
                        </div>
                    </div>
                    <div className='p-grid p-fluid'>
                        <div className='p-col-12'>
                            <InputText 
                                value={nombrePuesto}
                                name='nombrePuesto'
                                id='nombrePuesto'
                                className={classNames({ 'p-invalid': enviado && (!puesto.nombrePuesto || yaExiste) })}
                                onChange={(e)=> onInputChange(e)}
                                placeholder="Nombre del puesto"
                            />
                            {enviado && !puesto.nombrePuesto && <small className="p-invalid">El nombre del puesto es obligatorio.</small>}
                            {enviado && yaExiste ? ( <small> EL nombre ingresado ya existe. Intente con otro. </small> ) : null}
                        </div>
                    </div>
                    <div className='p-grid p-fluid'>
                        <div className='p-col-12'>
                            <InputTextarea 
                                style={{maxWidth: '100%'}}
                                value={comentarios}
                                name='comentarios'
                                id='comentarios'
                                onChange={(e)=> onInputChange(e)}
                                placeholder='Comentarios del lugar'
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
     );
}
 
export default Puestos;