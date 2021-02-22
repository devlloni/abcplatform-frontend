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
const Lugares = () => {
    document.title = "ABC | Lugares";
    const { width } = useWindowSize();

    const [ lugares, setLugares ] = useState(null);
    const [ lugarDialog, setLugarDialog ] = useState(false);
    const [ yaExiste, setYaExiste ] = useState(false);
    const [ enviado, setEnviado ] = useState(false);
    const [ lugar, setLugar ] = useState({
        id: '',
        nombreLugar: '',
        idCompania: '',
        nombreCompania: '',
        comentarios: ''
    });
    const [ globalFilter, setGlobalFilter ] = useState('');
    const [ companias, setCompanias ] = useState(null);

    const { nombreLugar, idCompania, comentarios } = lugar;

    const getLugares = async () => {
        const resp = await clienteAxios.get('/companias/lugares');
        setLugares(resp.data.lugares);
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
        if(!lugares){
            getLugares();
        }
        if(!companias){
            getCompanies();
        }
    }, []);

    const reiniciarLugar = () => {
        setLugar({
            id: null,
            idCompania: '',
            nombreCompania: '',
            nombreLugar: '',
            comentarios: ''
        });
        return;
    }

    const showLugarDialog = e => {  
        setLugarDialog(true);
    }

    const submitEditLugar = async (lugar) => {
        const resp = await clienteAxios.post('/companias/lugares/edit', lugar);
        if(resp.status === 200 && resp.data.msg === 'ok'){
            let msg = `¡El lugar [ "${lugar.nombreLugar}" ] fué actualizado correctamente.`;
            getLugares();
            setLugarDialog(false);
            reiniciarLugar();
            return showToast('success', '¡Exito!', msg);
        }
        if(resp.status === 200 && resp.data.msg === 'exists'){
            setYaExiste(true);
            let msg = `¡El lugar [ "${lugar.nombreLugar}" ] ya existe! Intente con otro nombre.`;
            return showToast('warn', '¡Atención!', msg);
        }
    }

    const submitDeleteLugar = async ( id ) => {
        console.log('Intentando eliminar el id: ', id);
        const resp = await clienteAxios.post('/companias/lugares/delete', {id});
        if(resp.status === 200){
            getLugares();
            return showToast('success', '¡Perfecto!', '¡El lugar fué eliminado con éxito!');
        }else{
            return showToast('error', '¡Error!', '¡Ocurrió un error inesperado! Por favor, inténtalo más tarde.');
        }
    }

    const handleDeleteLugar = (rawData) => {
        Swal.fire({
            title: `¿Estás seguro de eliminar el lugar "${rawData.nombreLugar}"?`,
            text: 'No podrás volver atrás.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, borrarlo.',
            cancelButtonText: 'No, cancelar.'
          }).then((result) => {
            if (result.value) {
              //! HANDLE DELETE, 
              submitDeleteLugar(rawData._id);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire(
                'Cancelado',
                'El lugar sigue conservándose en la base de datos.',
                'warn'
              )
            }
          })
    }

    const submitnewLugar = async () => {
        setEnviado(true);
        if(!idCompania || idCompania.length === 0 ||
           !nombreLugar || nombreLugar.length === 0    
        ){
            return showToast('error', '¡Error!', '¡Completa todos los campos e intentelo de nuevo!');
        }
        if(lugar._id){
            return submitEditLugar(lugar);
        }
        else{
            
                const respuesta = await clienteAxios.post('/companias/lugares', lugar);
                if(respuesta.status === 200 && respuesta.data.msg === 'ok'){
                    getLugares();
                    setEnviado(false);
                    setLugarDialog(false);
                    reiniciarLugar();
                    setYaExiste(false);
                    return showToast('success', '¡Lugar cargado con éxito!', 'El lugar fué cargado correctamente en la base de datos.');
                }
                else if(respuesta.status === 200 && respuesta.data.msg === 'exists'){
                    setYaExiste(true);
                    let msg = `¡El lugar [ "${lugar.nombreLugar}" ] ya existe! Intente con otro nombre.`;
                    return showToast('warn', '¡Atención!', msg);
                }
                else{
                    setYaExiste(false);
                    return showToast('error', '¡Error!', 'Lo sentimos, ocurrió un error inesperrado en el sistema, inténtelo más tarde.');
                }   
        }
    }

    const hideDialog = e => {
        setLugarDialog(false);
        setEnviado(false);
        setYaExiste(false);
        reiniciarLugar();
    }

    const onInputChange = e => {
        setLugar({
            ...lugar,
            [e.target.name] : e.target.value
        });
        if(e.target.name === 'idCompania'){
            //!
            let comp;
            if(companias){
                companias.forEach( companie => {
                    if(companie.value === e.target.value){
                        comp = companie.label;
                        setLugar({
                            ...lugar,
                            nombreCompania: comp,
                            [e.target.name] : e.target.value
                        });
                    }
                });
            }
            //*
        }
        if(e.target.name === 'nombreLugar'){
            setYaExiste(false);
        }
    }

    const EditLugar = lugar => {
        setLugar(lugar);
        setLugarDialog(true);
    }

    const dialogLugarFooter = (
                <div>
                    <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={()=> hideDialog()} />
                    <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={()=> submitnewLugar()} />
                </div>
        );
    

    const TableHeader = (
        <div className="table-header">
                Lista de Lugares
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Filtros globales" />
                </span>
        </div>
    )

    const actionBody = (rawData) => {
        return(
            <div className='p-text-center'>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => EditLugar(rawData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => handleDeleteLugar(rawData)} />
            </div>
        );
    }

    const headerDialog = (
        <div className='center'>Detalles del lugar</div>
    );

    const idBodyTemplate = rowData => {
        // let comp;
        // if(companias){
        //     companias.forEach( companie => {
        //         if(companie.value === rowData.idCompania){
        //             comp = companie.label;
        //         }
        //         else{
        //             return;
        //         }
        //     });
        // }
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
                {rawData.nombreLugar}
            </Fragment>
        )
    }
 
    return ( 
        <div className="datatable-crud-demo"style={
            {paddingBottom: '50px',marginTop: '0.8em', marginLeft: '0.8em', marginRight: '0.8em'}
        }>
            <h5 className='center'>Lugares de trabajo</h5>
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
                        onClick={(e)=> showLugarDialog()} 
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
                {lugares ? (
                    <div className='datatable-filter-demo'>
                        <div className='card'>
                        <DataTable
                            value={lugares}
                            className='p-datatable-responsive-demo'
                            paginator rows={4}
                            header={TableHeader}
                            globalFilter={globalFilter}
                        >
                            <Column field="nombreLugar" header="Nombre" body={nombreBodyTemplate} 
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
                    visible={lugarDialog}
                    style={ width < 993 ? {width: '450px'} : {width: '750px'}}
                    header={headerDialog}
                    modal className='p-fluid'
                    footer={dialogLugarFooter}
                    onHide={()=>hideDialog()}
                >
                    <div className='p-grid p-fluid'>
                        <div className='p-col-12'>
                            <Dropdown 
                                value={idCompania} 
                                name="idCompania"
                                id="idCompania"
                                options={companias} 
                                className={classNames({ 'p-invalid': enviado && !lugar.idCompania })}
                                onChange={(e) => onInputChange(e)} 
                                placeholder="¿A qué compañía está asociado?"
                            />
                            {enviado && !lugar.idCompania && <small className="p-invalid">La compañía asociada es obligatoria.</small>}
                        </div>
                    </div>
                    <div className='p-grid p-fluid'>
                        <div className='p-col-12'>
                            <InputText 
                                value={nombreLugar}
                                name='nombreLugar'
                                id='nombreLugar'
                                className={classNames({ 'p-invalid': enviado && (!lugar.nombreLugar || yaExiste) })}
                                onChange={(e)=> onInputChange(e)}
                                placeholder="Nombre del lugar"
                            />
                            {enviado && !lugar.nombreLugar && <small className="p-invalid">El nombre del lugar es obligatorio.</small>}
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
 
export default Lugares;