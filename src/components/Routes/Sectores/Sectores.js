import React, {Fragment, useState, useEffect, useRef} from 'react';
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
const Sectores = () => {
    document.title = "ABC | Sectores";
    const { width } = useWindowSize();

    const [ sectores, setSectores ] = useState(null);
    const [ sectorDialog, setSectorDialog ] = useState(false);
    const [ yaExiste, setYaExiste ] = useState(false);
    const [ enviado, setEnviado ] = useState(false);
    const [ sector, setSector ] = useState({
        id: '',
        nombreSector: '',
        idCompania: '',
        nombreCompania: '',
        comentarios: ''
    });
    const [ globalFilter, setGlobalFilter ] = useState('');
    const [ companias, setCompanias ] = useState(null);
    const [ selectedSector, setSelectedSector ] = useState(null);

    const { nombreSector, idCompania, comentarios } = sector;

    const getSectores = async () => {
        const resp = await clienteAxios.get('/companias/sectores');
        setSectores(resp.data.sectores);
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
        if(!sectores){
            getSectores();
        }
        if(!companias){
            getCompanies();
        }
    }, []);

    const reiniciarSector = () => {
        setSector({
            id: null,
            idCompania: '',
            nombreCompania: '',
            nombreSector: '',
            comentarios: ''
        });
        return;
    }

    const showSectorDialog = e => {
        setSectorDialog(true);
    }

    const submitEditSector = async (sector) => {
        const resp = await clienteAxios.post('/companias/sectores/edit', sector);
        if(resp.status === 200 && resp.data.msg === 'ok'){
            let msg = `¡El sector [ "${sector.nombreSector}" ] fué actualizado correctamente.`;
            getSectores();
            setSectorDialog(false);
            reiniciarSector();
            return showToast('success', '¡Exito!', msg);
        }
        if(resp.status === 200 && resp.data.msg === 'exists'){
            setYaExiste(true);
            let msg = `¡El sector [ "${sector.nombreSector}" ] ya existe! Intente con otro nombre.`;
            return showToast('warn', '¡Atención!', msg);
        }
    }

    const submitNewSector = async () => {
        setEnviado(true);
        if(!idCompania || idCompania.length === 0 ||
           !nombreSector || nombreSector.length === 0    
        ){
            return showToast('error', '¡Error!', '¡Completa todos los campos e intentelo de nuevo!');
        }
        if(sector._id){
            return submitEditSector(sector);
        }
        else{
            
                const respuesta = await clienteAxios.post('/companias/sectores', sector);
                if(respuesta.status === 200 && respuesta.data.msg === 'ok'){
                    getSectores();
                    setEnviado(false);
                    setSectorDialog(false);
                    reiniciarSector();
                    return showToast('success', '¡Sector cargado con éxito!', 'El sector fué cargado correctamente en la base de datos.');
                }
                else if(respuesta.status === 200 && respuesta.data.msg === 'exists'){
                    setYaExiste(true);
                    let msg = `¡El sector [ "${sector.nombreSector}" ] ya existe! Intente con otro nombre.`;
                    return showToast('warn', '¡Atención!', msg);
                }
                else{
                    setYaExiste(false);
                    return showToast('error', '¡Error!', 'Lo sentimos, ocurrió un error inesperrado en el sistema, inténtelo más tarde.');
                }
                
        }
    }

    const hideDialog = e => {
        setSectorDialog(false);
        setEnviado(false);
        reiniciarSector();
    }

    const onInputChange = e => {
        setSector({
            ...sector,
            [e.target.name] : e.target.value
        });
        if(e.target.name === 'idCompania'){
            //!
            let comp;
            if(companias){
                companias.forEach( companie => {
                    if(companie.value === e.target.value){
                        comp = companie.label;
                        setSector({
                            ...sector,
                            nombreCompania: comp,
                            [e.target.name] : e.target.value
                        });
                    }
                });
            }
        }
        if(e.target.name === 'nombreSector'){
            setYaExiste(false);
        }
    }

    const editSector = sector => {
        console.log(sector);
        setSector(sector);
        setSectorDialog(true);
    }

    const dialogSectorFooter = (
                <div>
                    <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={()=> hideDialog()} />
                    <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={()=> submitNewSector()} />
                </div>
        );
    

    const TableHeader = (
        <div className="table-header">
                Lista de sectores
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Filtros globales" />
                </span>
        </div>
    )

    const actionBody = (rawData) => {
        return(
            <div className='p-text-center'>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editSector(rawData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={(e) => e.preventDefault()} />
            </div>
        );
    }

    const headerDialog = (
        <div className='center'>Detalles del sector</div>
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
                {rawData.nombreSector}
            </Fragment>
        )
    }
 
    return ( 
        <div className="datatable-crud-demo"style={
            {paddingBottom: '50px',marginTop: '0.8em', marginLeft: '0.8em', marginRight: '0.8em'}
        }>
            <h5 className='center'>Sectores de trabajo</h5>
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
                        onClick={(e)=> showSectorDialog()} 
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
                {sectores ? (
                    <div className='datatable-filter-demo'>
                        <div className='card'>
                        <DataTable
                            value={sectores}
                            className='p-datatable-responsive-demo'
                            paginator rows={4}
                            header={TableHeader}
                            globalFilter={globalFilter}
                        >
                            <Column field="nombreSector" header="Nombre" body={nombreBodyTemplate} 
                                filter={true} filterPlaceholder={'Buscar por nombre de sector'}
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
                    visible={sectorDialog}
                    style={ width < 993 ? {width: '450px'} : {width: '750px'}}
                    header={headerDialog}
                    modal className='p-fluid'
                    footer={dialogSectorFooter}
                    onHide={()=>hideDialog()}
                >
                    <div className='p-grid p-fluid'>
                        <div className='p-col-12'>
                            <Dropdown 
                                value={idCompania} 
                                name="idCompania"
                                id="idCompania"
                                options={companias} 
                                className={classNames({ 'p-invalid': enviado && !sector.idCompania })}
                                onChange={(e) => onInputChange(e)} 
                                placeholder="¿A qué compañía está asociado?"
                            />
                            {enviado && !sector.idCompania && <small className="p-invalid">La compañía asociada es obligatoria.</small>}
                        </div>
                    </div>
                    <div className='p-grid p-fluid'>
                        <div className='p-col-12'>
                            <InputText 
                                value={nombreSector}
                                name='nombreSector'
                                id='nombreSector'
                                className={classNames({ 'p-invalid': enviado && (!sector.nombreSector || yaExiste) })}
                                onChange={(e)=> onInputChange(e)}
                                placeholder="Nombre del sector"
                            />
                            {enviado && !sector.nombreSector && <small className="p-invalid">El nombre del sector es obligatorio.</small>}
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
                                placeholder='Comentarios del sector'
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
     );
}
 
export default Sectores;