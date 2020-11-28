import React, {Fragment, useState, useEffect, useRef} from 'react';

import { emptyEmpleado } from '../../../hooks/store/empleadoStore';
import clienteAxios from '../../../config/clienteAxios';
import classNames from 'classnames'
import useWindowSize from '../../../hooks/useWindowSize';
//prime Components
import { Toast } from 'primereact/toast';
import { InputMask } from 'primereact/inputmask';
import { Button } from 'primereact/button';
// import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';

// import { ProgressSpinner } from 'primereact/progressspinner';
const Empleados = () => {
    document.title = "ABC | Empleados"
    const { width } = useWindowSize();
    //
    const [ empleados, setEmpleados ] = useState(null);
    const [ empleadoDialog, setEmpleadoDialog ] = useState(false);
    const [ enviado, setEnviado ] = useState(false);
    const [ empleado, setEmpleado ] = useState({
        id: null,
        email: '',
        nombre: '',
        apellido: '',
        password: '',
        administrador: '',
        compania: '',
        direccion: '',
        localidad: '',
        provincia: '',
        cuil: '',
        telefonoContacto: ''
    });
    const [ companias, setCompanias ] = useState([]);
    const [ deleteDialog, setDeleteDialog ] = useState(false);
    const [ selectedEmpleado, setSelectedEmpleado ] = useState(false);
    const [ confirmApellido, setConfirmApellido ] = useState('');
    const [ puedeBorrar, setPuedeBorrar ] = useState(false);
    const [ showPass, setShowPass ] = useState(false);
    const { email, nombre, apellido, password, administrador, compania,
         direccion, localidad, provincia, cuil, telefonoContacto } = empleado;

    const getEmpleados = async () => {
        const resp = await clienteAxios.get('/usuarios/empleados');
        setEmpleados(resp.data.empleados);
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

    //Toast
    const myToast = useRef(null);
    const showToast = (severityValue, summaryValue, detailValue) => {   
        myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
    }
    useEffect(() => {
        if(!empleados){
            getEmpleados();
        }
        if(!companias || companias.length == 0){
            getCompanies();
        }
    }, [])


    //?  FUNCTIONS
    const showEmpleadoDialog = e => {
        setEmpleadoDialog(true);
    }
    const submitNewEmpleado = async () => {
        setEnviado(true);
        if( !email  || email.length === 0 ||
            !nombre || nombre.length === 0 || 
            !apellido || apellido.length === 0 ||
            !password || password.length === 0 ||
            !compania || compania.length === 0  ||
            // !direccion || direccion.length === 0 ||
            !localidad || localidad.length === 0  ||
            !provincia || provincia.length === 0  ||
            !cuil || cuil.length === 0  ||
            !telefonoContacto || telefonoContacto.length === 0  
            ){
                return showToast('error', '¡Error!', '¡Completa todos los campos!'); 
            }
            if(empleado._id){
                return showToast('warn', 'Precaucion', 'Función no implementada momentaneamente.');
            }else{
                const token = localStorage.getItem('token');
                empleado.administrador = 0;
                try {
                    const respuesta = await clienteAxios.post('/empleados', empleado, { headers: {
                        'x-auth-token': token
                    }});
                    if(respuesta.status === 200){
                        getEmpleados();
                        setEnviado(false);
                        setEmpleadoDialog(false);
                        setEmpleado(false);
                        return showToast('success', '¡Empleado ingresado!', 'El impleado fué ingresado correctamente.');
                    }
                } catch (error) {
                    return showToast('error', 'Error message', 'Error inesperado, por favor intentelo nuevamente en unos minutos.');
                }
            }
    }

    const DeleteEmpleado = async () => {
        if(!selectedEmpleado){
            return;
        }
        else{
            let id = selectedEmpleado._id;
            const respuesta = await clienteAxios.post(`/empleados/delete`, {id});
            if(respuesta.status === 200){
                getEmpleados();
                setDeleteDialog(false);
                showToast('success', 'Success message', `${selectedEmpleado.nombre} ${selectedEmpleado.apellido} fué eliminado satisfactoriamente. (${selectedEmpleado._id})`)
                return setSelectedEmpleado(null);
            }else{
                setDeleteDialog(false);
                return showToast('error', 'Error message', 'Ocurrió un error inesperado de parte del servidor. Por favor, aguarde.');
            }
            
        }
    }

    const hideDialog = e => {
        setEmpleadoDialog(false);
        setEnviado(false);
        setEmpleado({
            id: null,
            email: '',
            nombre: '',
            apellido: '',
            password: '',
            administrador: ''
        })
    }
    const hideDeleteDialog = e => {
        setDeleteDialog(false);
        setSelectedEmpleado(null);
        setEmpleado({
            id: null,
            email: '',
            nombre: '',
            apellido: '',
            password: '',
            administrador: ''
        })
    }
    
    const handleConfirmApellido = e => {
        setConfirmApellido(e.target.value);
        if(e.target.value === `${selectedEmpleado.nombre} ${selectedEmpleado.apellido}`){
            return setPuedeBorrar(true);
        }
        else{
            return setPuedeBorrar(false);
        }
    }

    const onInputChange = e => {
        setEmpleado({
            ...empleado,
            [e.target.name] : e.target.value
        });
    }

    const editEmpleado = empleado => {
        setEmpleado(empleado);
        // console.log(empleados);
        // let a = empleados.filter( emp => {
        //     return emp._id === empleado._id
        // });
        // console.log(a[0]);
        // setEmpleado(a[0]);
        setEmpleadoDialog(true);
    }

    //? RAW DATA FOR COLUMNS TEMPLATE

    const dialogCompanieFooter = () => {
        return(
                <React.Fragment>
                    <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={()=> hideDialog()} />
                    <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={()=>submitNewEmpleado()} />
                </React.Fragment>
        )
    }

    const confirmeDeleteEmpleado = empleado => {
        setSelectedEmpleado(empleado);
        setDeleteDialog(true);
    }

    const deleteEmpleadoDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={()=> hideDeleteDialog()} />
            <Button label="Sí" disabled={!puedeBorrar} icon="pi pi-check" className="p-button-text" onClick={()=> DeleteEmpleado()} />
        </React.Fragment>
    )
    const deleteEmpleadoDialogHeader = (
        
        <Fragment>
            {selectedEmpleado ? (
                <React.Fragment>
                ¿Está seguro de eliminar el empleado "{selectedEmpleado.nombre} {selectedEmpleado.apellido}" ?
                </React.Fragment>
            ):
            'Cargando...'}
        </Fragment>
        
    )

    const actionBody = (rawData) => {
        return(
            <div >
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editEmpleado(rawData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmeDeleteEmpleado(rawData)} />
            </div>
        )
    }

    const idBodyTemplate = rowData => {
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

     const apellidoBodyTemplate = rowData => {
        return (
            <Fragment>
                <span className="p-column-title"></span>
                {rowData.apellido}
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
        <div className="datatable-crud-demo"style={
            {paddingBottom: '50px',marginTop: '0.8em', marginLeft: '0.8em', marginRight: '0.8em'}
        }>
            <h5 className='center'>Empleados</h5>
            <Toast ref={myToast} />
            <div className="card">
                    <div className="p-grid p-fluid" style={{
                                marginTop: '1em',
                                marginLeft: '0.3em'
                            }}>
                            <div className='p-col-3'>
                                <Button 
                                label="Nuevo" 
                                icon={ width < 320 ? '' : "pi pi-plus" }
                                className="p-button-success p-mr-2" 
                                onClick={(e)=> showEmpleadoDialog()} 
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
                        <DataTable value={empleados} className="p-datatable-responsive-demo" paginator rows={4} header="Empleados">
                        <Column field="nombre" header="Nombre" body={nombreBodyTemplate} />
                        
                        {width > 370 ? (
                            <Column field="apellido" header="Apellido" body={apellidoBodyTemplate} />
                        ): null }
                        {width > 560 ? (
                            <Column field="email" header="E-Mail" body={emailBodyTemplate} />
                        ): null }
                        {/* <Column field="fantasieName" header="Nombre de Fantasía" body={nombreFantasiaBodyTemplate} /> */}
                        
                        {width > 992 ? (
                        <Column field="compania" header="Compañía" body={idBodyTemplate} />
                        )
                        : null
                        }
                        {width > 230 ? (
                            <Column style={ width < 560 ? {paddingLeft: '15%'} : {paddingLeft : '8%'}} body={actionBody}/>
                        )
                        :null
                        }
                    </DataTable>
                    {/*/ //!DIALOGS */}
                <Dialog
                        visible={empleadoDialog}
                        style={ width < 993 ? {width:'450px'} : {width: '750px'} } 
                        header={(<div className='center'>Detalles del empleado</div>)} 
                        modal className="p-fluid" 
                        footer={dialogCompanieFooter()} 
                        onHide={()=>hideDialog()}
                    >
                    <div className='p-grid p-fluid'>
                        <div className='p-col-12'>
                            <Dropdown 
                                value={empleado.compania} 
                                name="compania"
                                id="compania"
                                options={companias} 
                                className={classNames({ 'p-invalid': enviado && !empleado.compania })}
                                onChange={(e) => onInputChange(e)} 
                                placeholder="¿A qué compañía está asociado?"
                            />
                            {enviado && !empleado.compania && <small className="p-invalid">El nombre es requerido.</small>}
                        </div>
                    </div>    
                    <div className='p-grid p-fluid'>
                    <div className="p-col-12 p-md-6 p-field">
                        <label htmlFor="nombre">Nombre</label>
                        <InputText id="nombre" name="nombre" value={nombre} onChange={(e) => onInputChange(e)} required autoFocus 
                        className={classNames({ 'p-invalid': enviado && !empleado.nombre })} />
                        {enviado && !empleado.nombre && <small className="p-invalid">El nombre es requerido.</small>}
                    </div>
                    <div className="p-col-12 p-md-6 p-field">
                        <label htmlFor="apellido">Apellido</label>
                        <InputText id="apellido" name="apellido" value={empleado.apellido} onChange={(e) => onInputChange(e)} 
                        required className={classNames({ 'p-invalid': enviado && !empleado.apellido })} />
                        {enviado && !empleado.apellido && <small className="p-invalid">El apellido es requerido.</small>}
                    </div>
                    </div>
                <div className='p-grid p-fluid'>
                    <div className="p-col-12 p-md-6 p-field">
                        <label htmlFor="email">E-Mail</label>
                        <InputText id="email" type="email" name="email" value={empleado.email} onChange={(e) => onInputChange(e)} required 
                        className={classNames({ 'p-invalid': enviado && !empleado.email })} />
                        {enviado && !empleado.email && <small className="p-invalid">El email es requerido.</small>}
                    </div>
                    <div className="p-col-12 p-md-6 p-field">
                        <label htmlFor="password">Contraseña</label>
                        <InputText tooltipOptions={{
                            position: 'bottom'
                        }}
                        tooltip="Ésta clave es temporal, el empleado deberá cambiarla." 
                        disabled={empleado._id ? true : false}
                        type={empleado._id ? 'password' : 'text'}
                        id="password" name="password" value={empleado.password} onChange={(e) => onInputChange(e)} 
                        required className={classNames({ 'p-invalid': enviado && !empleado.password })} />
                        {enviado && !empleado.password && <small className="p-invalid">La contraseña es requerida.</small>}
                        </div>
                    </div>
                        <div className='divider p-mt-3'></div>
                            <div className='center'>Datos de contacto</div>
                        <div className='divider p-mb-3'></div>
                    <div className='p-grid p-fluid'>
                        <div className="p-col-12 p-md-6 p-field">
                            <label htmlFor="localidad">Localidad</label>
                            <InputText id="localidad" name="localidad" value={localidad} onChange={(e) => onInputChange(e)} required 
                            className={classNames({ 'p-invalid': enviado && !empleado.localidad })} />
                            {enviado && !empleado.localidad && <small className="p-invalid">La localidad es requerida.</small>}
                        </div>
                        <div className="p-col-12 p-md-6 p-field">
                            <label htmlFor="provincia">Provincia</label>
                            <InputText id="provincia" name="provincia" value={empleado.provincia} onChange={(e) => onInputChange(e)} 
                            required className={classNames({ 'p-invalid': enviado && !empleado.provincia })} />
                            {enviado && !empleado.provincia && <small className="p-invalid">La provincia es requerida.</small>}
                        </div>
                    </div>
                    {/*  */}
                    <div className='p-grid p-fluid'>
                        <div className="p-col-12 p-md-6 p-field">
                            <label htmlFor="cuil">C.U.I.L</label>
                            <InputMask mask='99-99999999-9' id="cuil" name="cuil" value={cuil} onChange={(e) => onInputChange(e)} 
                            required className={classNames({ 'p-invalid': enviado && !empleado.cuil })} />
                            {enviado && !empleado.cuil && <small className="p-invalid">El CUIL es requerido.</small>}
                        </div>
                        <div className="p-col-12 p-md-6 p-field">
                            <label htmlFor="telefonoContacto">Teléfono</label>
                            <InputText id="telefonoContacto" name="telefonoContacto" value={empleado.telefonoContacto} onChange={(e) => onInputChange(e)} 
                            required className={classNames({ 'p-invalid': enviado && !empleado.telefonoContacto })} />
                            {enviado && !empleado.telefonoContacto && <small className="p-invalid">El telefono es requerido.</small>}
                        </div>
                    </div>
            </Dialog>
            {/* DELETE DIALOG */}
            <Dialog visible={deleteDialog} style={{ width: '450px' }} header={deleteEmpleadoDialogHeader} modal footer={deleteEmpleadoDialogFooter} onHide={()=> hideDeleteDialog()}>
                    <div className="confirmation-content">
                        <div className='p-grid p-fluid p-mt-2'>
                            <div className='p-col-6 p-md-6 p-field'>
                            <span className="p-float-label">
                                <InputText id="confirmApellido" name="confirmApellido" value={confirmApellido} onChange={(e) => handleConfirmApellido(e)} />
                                <label htmlFor="username">Empleado</label>
                            </span>
                            </div>
                            <div className='p-col-6 p-md-6 p-field'>
                                <small>Escriba el nombre completo del empleado para confirmar.</small>
                            </div>
                        </div>
                    </div>
            </Dialog>
                </div>
        </div>
     );
}
 
export default Empleados;