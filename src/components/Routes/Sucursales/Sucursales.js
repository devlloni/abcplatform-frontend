import React, {Fragment, useState, useEffect, useRef} from 'react';
import clienteAxios from '../../../config/clienteAxios';
import classNames from 'classnames';
//*Components
import {Toast} from 'primereact/toast';
import {Button} from 'primereact/button';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
//Hooks
import useWindowSize from '../../../hooks/useWindowSize';
const Sucursales = () => {

    document.title = "ABC | Sucursales"
    const { width } = useWindowSize();

    const [ sucursales, setSucursales ] = useState(null);
    const [ sucursalDialog, setSucursalDialog] = useState(false);
    const [ enviado, setEnviado ] = useState(false);
    const [ companias, setCompanias ] = useState([]);
    const [ sucursal, setSucursal ] = useState({
        id: null,
        compania: '',
        nombre: '',
        domicilio: '',
        localidad: '',
        provincia: '',
        telefono: '',
        email: '',
        comentario: ''
    });
    const { compania, nombre, domicilio, localidad, provincia,
            telefono, email, comentario } = sucursal;
    const getSucursales = async () => {
        const resp = await clienteAxios.get('/branchoffices/');
        setSucursales(resp.data);
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

    //Toast ref
    const myToast = useRef(null);
    const showToast = (severityValue, summaryValue, detailValue) => {   
        myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
    }

    //!Effects
    useEffect( ()=> {
        if(!sucursales){
            getSucursales();
        }
        if(!companias || companias.length == 0){
            getCompanies();
        }
    }, [])


    //*FUNCTIONS
    const onInputChange = e => {
        setSucursal({
            ...sucursal,
            [e.target.name] : e.target.value
        });
    }

    const hideDialog = () => {
        setSucursalDialog(false);
        setEnviado(false);
        reiniciarSucursal();
    }

    const submitEditSucursal = async (suc) => {
        const resp = await clienteAxios.post('/branchoffices/update', suc);
        if(resp.status === 200 && resp.data.msg === 'ok'){
            getSucursales();
            setSucursalDialog(false);
            reiniciarSucursal();
            return showToast('success', '¡Exito!', 'La sucursal fue actualizada correctamente.');
        }
    }

    const reiniciarSucursal = () => {
        setSucursal({
            id: null,
            compania: '',
            nombre: '',
            domicilio: '',
            localidad: '',
            provincia: '',
            telefono: '',
            email: '',
            comentario: ''
        });
    }

    const submitNewSucursal = async e => {
        e.preventDefault()
        setEnviado(true);
        if(sucursal.id){
            return showToast('Warn', '¡Advertencia!', 'Funcion no implementada todavía.');
        }
        if(!compania || compania.length === 0 ||
            !nombre  || nombre.length === 0 ||
            !domicilio || domicilio.length === 0 ||
            !localidad || localidad.length === 0 ||
            !provincia || provincia.length === 0 ||
            !telefono  || telefono.length === 0 ||
            !email     || email.length === 0
        ){
            return showToast('error', 'Error', 'Verifica que todos los campos estén completos.');
        }
        if(sucursal._id){
            return submitEditSucursal(sucursal);
        }
        const respuesta = await clienteAxios.post('/branchoffices/', sucursal);
        console.log(respuesta);
        if(respuesta.status === 200){
            showToast('success', '¡Genial!', `Sucursal agregada correctamente. (ID: ${compania})`);
            getSucursales();
            setSucursalDialog(false);
            setEnviado(false);
            setSucursal({
                id: null,
                compania: '',
                nombre: '',
                domicilio: '',
                localidad: '',
                provincia: '',
                telefono: '',
                email: '',
                comentario: ''
            })
        }
    }

    const editSucursal = (suc) => {
        setSucursal(suc);
        setSucursalDialog(true);
    }

    //
    const dialogSucursalFooter = () => {
        return(
                <React.Fragment>
                    <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={()=> hideDialog()} />
                    <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={(e)=> submitNewSucursal(e)} />
                </React.Fragment>
        )
    }

    //!Templates
    const actionBody = (rawData) => {
        return(
            <div >
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={()=>editSucursal(rawData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={(e)=>e.preventDefault()} />
            </div>
        )
    }

    const companieBodyTemplate = rowData => {
        let comp;
        if(companias){
            companias.forEach( companie => {
                if(companie.value === rowData.compania){
                    comp = companie.label;
                }
                else{
                    return;
                }
            })
        }
        return (
           <Fragment>
           <span className="p-column-title"></span>
           {/* Tenemos que obtener la compañía para la que trabaja */}
           {comp ? comp : ''}
           </Fragment>
        )
    }

    const nombreBodyTemplate = rowData => {
        return (
            <Fragment>
                <span className="p-column-title"></span>
                {rowData.nombre}
            </Fragment>
        )
     }

     const localidadBodyTemplate = rowData => {
        return (
            <Fragment>
                <span className="p-column-title"></span>
                {rowData.localidad}
            </Fragment>
        )
     }

     const emailBodyTemplate = rowData => {
         return (
            <Fragment>
            <span className="p-column-title"></span>
            {rowData.email}
            </Fragment>
         )
     }

    return ( 
        <div className='datatable-crud-demo' style={
            {paddingBottom: '50px',marginTop: '0.8em', marginLeft: '0.8em', marginRight: '0.8em'}
        }>
            <h5 className='center'>Sucursales</h5>
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
                                onClick={()=> setSucursalDialog(true)} 
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
                    {/* DATATABLE */}
                    {sucursales ? (
                        <DataTable value={sucursales} className="p-datatable-responsive-demo" paginator rows={4} header="Sucursales">
                        <Column field="nombre" header="Nombre" body={nombreBodyTemplate} />
                        
                        {width > 370 ? (
                            <Column field="apellido" header="Localidad" body={localidadBodyTemplate} />
                        ): null }

                        {width > 560 ? (
                        <Column field="compania" header="Compañía" body={companieBodyTemplate} />
                        )
                        : null
                        }

                        {width > 992 ? (
                            <Column field="email" header="E-Mail" body={emailBodyTemplate} />
                        ): null }
                        {width > 230 ? (
                            <Column style={ width < 560 ? {paddingLeft: '15%'} : {paddingLeft : '8%'}} body={actionBody}/>
                        )
                        :null
                        }
                    </DataTable>
                    ):
                    (
                        <div className='center p-mt-6 p-mb-6'>
                            <ProgressSpinner />
                        </div>
                    )
                    }
                    {/*/ //!DIALOGS */}
                    <Dialog
                        visible={sucursalDialog}
                        style={ width < 993 ? {width:'450px'} : {width: '750px'} } 
                        header={(<div className='center'>Detalles de sucursal</div>)} 
                        modal className="p-fluid" 
                        footer={dialogSucursalFooter()} 
                        onHide={()=>hideDialog()}
                    >
                    <div className='p-grid p-fluid'>
                        <div className='p-col-12'>
                            <Dropdown 
                                value={compania} 
                                name="compania"
                                id="compania"
                                options={companias} 
                                className={classNames({ 'p-invalid': enviado && !sucursal.compania })}
                                onChange={(e) => onInputChange(e)} 
                                placeholder="¿A qué compañía está asociado?"
                            />
                            {enviado && !sucursal.compania && <small className="p-invalid">El nombre es requerido.</small>}
                        </div>
                    </div>    
                    <div className='p-grid p-fluid'>
                    <div className="p-col-12 p-md-6 p-field">
                        <label htmlFor="nombre">Nombre</label>
                        <InputText id="nombre" name="nombre" value={nombre} onChange={(e) => onInputChange(e)} required autoFocus 
                        className={classNames({ 'p-invalid': enviado && !sucursal.nombre })} />
                        {enviado && !sucursal.nombre && <small className="p-invalid">El nombre es requerido.</small>}
                    </div>
                    <div className="p-col-12 p-md-6 p-field">
                        <label htmlFor="domicilio">Domicilio</label>
                        <InputText id="domicilio" name="domicilio" value={sucursal.domicilio} onChange={(e) => onInputChange(e)} 
                        required className={classNames({ 'p-invalid': enviado && !sucursal.domicilio })} />
                        {enviado && !sucursal.domicilio && <small className="p-invalid">El domicilio es requerido.</small>}
                    </div>
                    </div>
                <div className='p-grid p-fluid'>
                    <div className="p-col-12 p-md-6 p-field">
                        <label htmlFor="localidad">Localidad</label>
                        <InputText id="localidad" type="text" name="localidad" value={sucursal.localidad} onChange={(e) => onInputChange(e)} required 
                        className={classNames({ 'p-invalid': enviado && !sucursal.localidad })} />
                        {enviado && !sucursal.localidad && <small className="p-invalid">La localidad es requerida.</small>}
                    </div>
                    <div className="p-col-12 p-md-6 p-field">
                        <label htmlFor="provincia">Provincia</label>
                        <InputText id="provincia" type="text" name="provincia" value={sucursal.provincia} onChange={(e) => onInputChange(e)} required 
                        className={classNames({ 'p-invalid': enviado && !sucursal.provincia })} />
                        {enviado && !sucursal.provincia && <small className="p-invalid">La provincia es requerida.</small>}
                        </div>
                    </div>
                        <div className='divider p-mt-3'></div>
                            <div className='center'>Datos de contacto</div>
                        <div className='divider p-mb-3'></div>
                    <div className='p-grid p-fluid'>
                        <div className="p-col-12 p-md-6 p-field">
                            <label htmlFor="telefono">Telefono</label>
                            <InputText id="telefono" name="telefono" value={sucursal.telefono} onChange={(e) => onInputChange(e)} required 
                            className={classNames({ 'p-invalid': enviado && !sucursal.telefono })} />
                            {enviado && !sucursal.telefono && <small className="p-invalid">El telefono es requerido.</small>}
                        </div>
                        <div className="p-col-12 p-md-6 p-field">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" name="email" type="email" value={sucursal.email} onChange={(e) => onInputChange(e)} 
                            required className={classNames({ 'p-invalid': enviado && !sucursal.email })} />
                            {enviado && !sucursal.email && <small className="p-invalid">El email es requerida.</small>}
                        </div>
                    </div>
                    <div className='p-grid p-fluid'>
                        <div className='p-col-12 p-md-12 p-field'>
                            <label htmlFor='comentario'>Comentarios</label>
                            <InputTextarea name="comentario" id="comentario" value={comentario} 
                            onChange={(e)=> onInputChange(e)}
                            />
                        </div>
                    </div>
            </Dialog>
            </div>
        </div>
     );
}
 
export default Sucursales;