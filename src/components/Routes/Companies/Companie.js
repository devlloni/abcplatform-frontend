import React, {Suspense, Fragment, useState, useEffect, useRef} from 'react';
// import { Link } from 'react-router-dom';
import clienteAxios from '../../../config/clienteAxios';
import classNames from 'classnames'
import useWindowSize from '../../../hooks/useWindowSize';
//prime Components
import { Toast } from 'primereact/toast';
import { InputMask } from 'primereact/inputmask';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';

const Companie = () => {
    document.title = "ABC | Compañías"
    const { width } = useWindowSize();
// NEW STYLE, CRUD STYLE WITH PRIMEREACT COMPONENTS
    //?STATES
    const [ companies, setCompanies ] = useState(null);
    const [ companieDialog, setCompanieDialog ] = useState(false);
    const [ deleteDialog, setDeleteDialog ] = useState(false);
    const [ selectedCompanie, setSelectedCompanie ] = useState(null);
    const [ selectedCompanies, setSelectedCompanies ] = useState(null);
    const [ globalFilter, setGlobalFilter ] = useState('');
    const [ enviado, setEnviado ] = useState(false);
    const [ companie, setCompanie ] = useState({
        id: null,
        razonSocial: '',
        fantasieName: '',
        cuitCompanie: '',
        addressCompanie: '',
        cityCompanie: '',
        stateCompanie: '',
        ciiuCompanie: '',
        artCompanie: '',
        emailCompanie: '',
        phoneCompanie: ''
    });

    const emptyCompanie = {
        id: null,
        razonSocial: '',
        fantasieName: '',
        cuitCompanie: '',
        addressCompanie: '',
        cityCompanie: '',
        stateCompanie: '',
        ciiuCompanie: '',
        nroContratoCompanie: '',
        artCompanie: '',
        emailCompanie: '',
        phoneCompanie: ''
    }
    //?EFFECTS
    useEffect( ()=>{
        getCompanies();
        // if(!companies){
        //     test();
        // }
    }, [])
    const getCompanies =  async ( ) => {
        const token = localStorage.getItem('token');
        const resp = await clienteAxios.get('/companias', {
            headers: {
                "x-auth-token":token
            }
        });
        setCompanies(resp.data);
    }
    //!Functions

    const onInputChange = e => {
        setCompanie({
            ...companie,
            [e.target.name] : e.target.value
        })
    }

    const myToast = useRef(null);
    const showToast = (severityValue, summaryValue, detailValue) => {   
        myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
    }

    const submitEditCompanie = async comp => {
        const resp = await clienteAxios.post('/companias/update', comp);
        if(resp.status === 200 && resp.data.msg === 'ok'){
            setCompanieDialog(false);
            reiniciarCompania();
            getCompanies();
            return showToast('success', '¡Exito!', 'Companía actualizada correctamente.');
        }
    }

    const submitNewCompanie = async e => {
        setEnviado(true);
        //*Validaciones
        if( !companie.razonSocial || //companie.razonSocial.trim() === ''   ||
            !companie.fantasieName || //companie.fantasieName.trim() === '' ||
            !companie.addressCompanie || //companie.addressCompanie.trim() === '' ||
            !companie.cityCompanie || //companie.cityCompanie.trim() === '' ||
            !companie.stateCompanie || //companie.stateCompanie.trim() === '' ||
            !companie.ciiuCompanie ||
            !companie.artCompanie || //companie.artCompanie.trim() === '' ||
            !companie.emailCompanie || //ompanie.emailCompanie.trim() === '' ||
            !companie.phoneCompanie || //companie.phoneCompanie.trim() === '' ||
            !companie.cuitCompanie  )// companie.cuitCompanie.trim() === '')
            {  
                return showToast('error', 'Error message', '¡Completa todos los campos!')
            }
        else{
            if(companie._id){
                //Actualizando compañía
                return submitEditCompanie(companie);
                // return showToast('warn', 'Warn message', 'Accion deshabilitada momentaneamente, actualización disponible pronto.');

            }
            else{
                
                    const respuesta = await clienteAxios.post('/companias', companie);
                    if(respuesta.status === 200){
                        // test();
                        setEnviado(false);
                        setCompanie(emptyCompanie);
                        setCompanieDialog(false);
                        getCompanies();
                        return showToast('success', 'Success message', '¡Compañía agregada a la base de datos!');
                    }
                    else{
                    return showToast('error', 'Error message', 'Error inesperado, por favor intentelo nuevamente en unos minutos.');
                }
            }
            
        }
    }

    const hideDeleteCompanie = () => {
        setDeleteDialog(false);
        setSelectedCompanie(null);
        // setCompanie({
        //     id: null,
        //     razonSocial: '',
        //     fantasieName: '',
        //     cuitCompanie: '',
        //     addressCompanie: '',
        //     cityCompanie: '',
        //     stateCompanie: '',
        //     ciiuCompanie: '',
        //     artCompanie: '',
        //     emailCompanie: '',
        //     phoneCompanie: ''
        // })
    }

    const editCompanie = companie => {
        setCompanie(companie);
        setCompanieDialog(true);
    }

    const confirmDeleteCompanie = companie => {
        setDeleteDialog(true);
        setSelectedCompanie(companie);
    }

    const DeleteCompanie = async () => {
        if(selectedCompanie && selectedCompanie){
            let id = selectedCompanie._id;
            const respuesta = await clienteAxios.post(`/companias/delete`, {id});
            if(respuesta.status === 200){
                setDeleteDialog(false);
                getCompanies();
                return showToast('success', 'Success message', `${selectedCompanie.razonSocial} fué eliminada satisfactoriamente. (${selectedCompanie._id})`)
            }
            else{
                setDeleteDialog(false);
                return showToast('error', 'Error message', 'Ocurrió un error inesperado de parte del servidor. Por favor, aguarde.');
            }
        }
        else{
            return;
        }
    }

    const openNew = () => {
        setEnviado(false);
    //     setCompanie(emptyCompanie);
        setCompanieDialog(true);
    }
    const hideDialog = () => {
        setEnviado(false);
        setCompanieDialog(false);
        reiniciarCompania();
    }

    const reiniciarCompania = () => {
        setCompanie({
            id: null,
            razonSocial: '',
            fantasieName: '',
            cuitCompanie: '',
            addressCompanie: '',
            cityCompanie: '',
            stateCompanie: '',
            ciiuCompanie: '',
            artCompanie: '',
            emailCompanie: '',
            phoneCompanie: ''
        })
    }

    const leftToolbarTemplate = () =>{
        return(
            <Fragment>
                <Button 
                    label="Nueva" 
                    icon="pi pi-plus" 
                    className="p-button-success p-mr-2" 
                    onClick={(e)=> openNew()} 
                />
                <Button 
                    label="Eliminar" 
                    icon="pi pi-trash" 
                    className="p-button-danger" 
                    disabled={!selectedCompanies || !selectedCompanies.length}
                    onClick={(e)=> setDeleteDialog(true)}
                    // disabled={!this.state.selectedProducts || !this.state.selectedProducts.length} 
                />
            </Fragment>
        )
    }
    const rightToolbarTemplate = () => {
        return (
            <Fragment>
                <FileUpload 
                    mode="basic" 
                    accept="image/*" 
                    maxFileSize={1000000} 
                    label="Importar" 
                    chooseLabel="Import" 
                    className="p-mr-2 p-d-inline-block" 
                />
                <Button 
                    label="Exportar" 
                    icon="pi pi-upload" 
                    className="p-button-help" 
                    onClick={(e)=>e.preventDefault()} 
                />
            </Fragment>
        )
    }

    const dialogCompanieFooter = () => {
        return(
                <React.Fragment>
                    <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={()=> hideDialog()} />
                    <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={()=>submitNewCompanie()} />
                </React.Fragment>
        )
    }

    const deleteCompanieDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={()=>hideDeleteCompanie()} />
            <Button label="Sí" icon="pi pi-check" className="p-button-text" onClick={()=> DeleteCompanie()} />
        </React.Fragment>
    )
    

    const header = (
        <div className="row">
                <span className="p-input-icon-left col-8">
                    <i className="pi pi-search" />
                    <InputText 
                        type="search"
                        onInput={(e) => setGlobalFilter(e.target.value)} 
                        placeholder="Buscar..." 
                    />
                </span>
        </div>
    )
    

    const actionBody = (rawData) => {
        return(
            <div >
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={(e) => editCompanie(rawData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={(e) => confirmDeleteCompanie(rawData)} />
            </div>
        )
    }

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const correoBodyTemplate = rowData => {
        return (
            <Fragment>
                <span className="p-column-title"></span>
                {rowData.emailCompanie}
            </Fragment>
        )
     }

     const razonSocialBodyTemplate = rowData => {
        return (
            <Fragment>
                <span className="p-column-title"></span>
                {rowData.razonSocial}
            </Fragment>
        )
     }

     const cuitBodyTemplate = rowData => {
         return (
            <Fragment>
            <span className="p-column-title"></span>
            {rowData.cuitCompanie}
            </Fragment>
         )
     }
     const ciiuBodyTemplate = rowData => {
        return (
           <Fragment>
           <span className="p-column-title"></span>
           {rowData.ciiuCompanie}
           </Fragment>
        )
    }
     const nombreFantasiaBodyTemplate = rowData => {
         return(
            <Fragment>
            <span className="p-column-title"></span>
            {rowData.fantasieName}
            </Fragment>
         )
     }



    return ( 
        <div className="datatable-responsive-demo" style={{
            margin: '0.8em'
        }}>
                <Toast ref={myToast} />
                <h3 className='center'>Compañías</h3>
                <div className="card">
                    <div className="p-grid p-fluid" style={{
                                marginTop: '1em',
                                marginLeft: '0.3em'
                            }}>
                        <div className='p-col-3'>
                            <Button 
                            
                            label="Nueva" 
                            icon={ width < 320 ? '' : "pi pi-plus" }
                            className="p-button-success p-mr-2" 
                            onClick={(e)=> openNew()} 
                            />
                        </div>
                        <div className='p-col-3'>
                        <Button 
                            label="Eliminar" 
                            icon="pi pi-trash" 
                            className="p-button-danger" 
                            disabled={!selectedCompanies || !selectedCompanies.length}
                            onClick={(e)=> setDeleteDialog(true)}
                        />
                        </div>
                        <div className='p-col-3 p-offest-3'>
                            {/* p-offset-3 */}
                        <Button 
                            label="Exportar" 
                            icon="pi pi-upload" 
                            className="p-button-help" 
                            onClick={(e)=>e.preventDefault()} 
                        />
                        </div>
                    </div>
                    {/* DATATABLE */}
                    {companies ? (
                        <DataTable  value={companies} className="p-datatable-responsive-demo" paginator rows={4} header="Compañías">
                        <Column field="razonSocial" header="Razón social" body={razonSocialBodyTemplate} />
                        
                        {width > 370 ? (
                            <Column field="cuitCompanie" header="C.U.I.T" body={cuitBodyTemplate} />
                        ): null }
                        {width > 560 ? (
                            <Column field="ciiu" header="C.I.I.U" body={ciiuBodyTemplate} />
                        ): null }
                        {/* <Column field="fantasieName" header="Nombre de Fantasía" body={nombreFantasiaBodyTemplate} /> */}
                        
                        {width > 992 ? (
                        <Column field="emailCompanie" header="E-Mail" body={correoBodyTemplate} />
                        )
                        : null
                        }
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
                    )}
                </div>
                {/*//!!//!! DIALOGS*/}
                    <Dialog
                        visible={companieDialog}
                        style={ width < 993 ? {width:'450px'} : {width: '750px'} } 
                        header={(<div className='center'>Detalles de la compañía</div>)} 
                        modal className="p-fluid" 
                        footer={dialogCompanieFooter()} 
                        onHide={()=>hideDialog()}
                    >
                <div className='p-grid p-fluid'>
                    <div className="p-col-12 p-md-6 p-field">
                        <label htmlFor="razonSocial">Razón social</label>
                        <InputText id="razonSocial" name="razonSocial" value={companie.razonSocial} onChange={(e) => onInputChange(e)} required autoFocus 
                        className={classNames({ 'p-invalid': enviado && !companie.razonSocial })} />
                        {enviado && !companie.razonSocial && <small className="p-invalid">Razón social es requerida.</small>}
                    </div>
                    <div className="p-col-12 p-md-6 p-field">
                        <label htmlFor="fantasieName">Nombre de fantasía</label>
                        <InputText id="fantasieName" name="fantasieName" value={companie.fantasieName} onChange={(e) => onInputChange(e)} 
                        required className={classNames({ 'p-invalid': enviado && !companie.fantasieName })} />
                        {enviado && !companie.fantasieName && <small className="p-invalid">Nombre de fantasía es requerido.</small>}
                    </div>
                </div>
                <div className='p-grid p-fluid'>
                    <div className="p-col-12 p-md-6 p-field">
                        <label htmlFor="stateCompanie">Provincia</label>
                        <InputText id="stateCompanie" name="stateCompanie" value={companie.stateCompanie} onChange={(e) => onInputChange(e)} required autoFocus 
                        className={classNames({ 'p-invalid': enviado && !companie.stateCompanie })} />
                        {enviado && !companie.stateCompanie && <small className="p-invalid">Provincia es requerida.</small>}
                    </div>
                    <div className="p-col-12 p-md-6 p-field">
                        <label htmlFor="cityCompanie">Ciudad</label>
                        <InputText id="cityCompanie" name="cityCompanie" value={companie.cityCompanie} onChange={(e) => onInputChange(e)} 
                        required className={classNames({ 'p-invalid': enviado && !companie.cityCompanie })} />
                        {enviado && !companie.cityCompanie && <small className="p-invalid">Ciudad es requerida.</small>}
                    </div>
                </div>
                <div className='divider mt3'></div>
                <div className='center'>Datos privados</div>
                <div className='divider mb3'></div>
                    <div className="p-field">
                        <label htmlFor="cuitCompanie">C.U.I.T</label>
                        <InputMask mask='99-99999999-9' id="cuitCompanie" name="cuitCompanie" value={companie.cuitCompanie} onChange={(e) => onInputChange(e)} 
                        required className={classNames({ 'p-invalid': enviado && !companie.cuitCompanie })} />
                        {enviado && !companie.cuitCompanie && <small className="p-invalid">El C.U.I.T es requerido.</small>}
                    </div>
                <div className='p-grid p-fluid'>
                    <div className="p-col-12 p-md-6 p-field">
                        <label htmlFor="artCompanie">A.R.T</label>
                        <InputText id="artCompanie" type="text" name="artCompanie" value={companie.artCompanie} onChange={(e) => onInputChange(e)} 
                        required className={classNames({ 'p-invalid': enviado && !companie.artCompanie })} />
                        {enviado && !companie.artCompanie && <small className="p-invalid">A.R.T es requerido.</small>}
                    </div>
                    <div className="p-col-12 p-md-6 p-field">
                        <label htmlFor="nroContratoCompanie">Nro. Contrato</label>
                        <InputText id="nroContratoCompanie" type="number" name="nroContratoCompanie" value={companie.nroContratoCompanie} onChange={(e) => onInputChange(e)} required autoFocus 
                        className={classNames({ 'p-invalid': enviado && !companie.nroContratoCompanie })} />
                        {enviado && !companie.nroContratoCompanie && <small className="p-invalid">El Nro. de contrato es requerido.</small>}
                    </div>
                </div>
                <div className='p-grid p-fluid'>
                    <div className="p-col-12 p-md-6 p-field">
                        <label htmlFor="ciiuCompanie">C.I.I.U</label>
                        <InputText id="ciiuCompanie" name="ciiuCompanie" value={companie.ciiuCompanie} onChange={(e) => onInputChange(e)} required autoFocus 
                        className={classNames({ 'p-invalid': enviado && !companie.ciiuCompanie })} />
                        {enviado && !companie.ciiuCompanie && <small className="p-invalid">El C.I.I.U es requerido.</small>}
                    </div>
                    {/* <div className="p-col-12 p-md-6 p-field">
                        <label htmlFor="artCompanie">A.R.T</label>
                        <InputText id="artCompanie" type="number" name="artCompanie" value={companie.artCompanie} onChange={(e) => onInputChange(e)} 
                        required className={classNames({ 'p-invalid': enviado && !companie.artCompanie })} />
                        {enviado && !companie.artCompanie && <small className="p-invalid">A.R.T es requerido.</small>}
                    </div> */}
                </div>
                <div className='divider mt3'></div>
                <div className='center'>Datos de contacto</div>
                <div className='divider mb3'></div>
                <div className='p-grid p-fluid'>
                    <div className="p-col-12 p-md-4 p-field">
                        <label htmlFor="addressCompanie">Dirección de la compañía</label>
                        <InputText id="addressCompanie" name="addressCompanie" value={companie.addressCompanie} onChange={(e) => onInputChange(e)} required autoFocus 
                        className={classNames({ 'p-invalid': enviado && !companie.addressCompanie })} />
                        {enviado && !companie.addressCompanie && <small className="p-invalid">La dirección es requerida.</small>}
                    </div>
                    <div className="p-col-12 p-md-4 p-field">
                        <label htmlFor="phoneCompanie">Teléfono de contacto</label>
                        <InputText id="phoneCompanie" name="phoneCompanie" value={companie.phoneCompanie} onChange={(e) => onInputChange(e)} 
                        required className={classNames({ 'p-invalid': enviado && !companie.phoneCompanie })} />
                        {enviado && !companie.phoneCompanie && <small className="p-invalid">Un teléfono es requerido.</small>}
                    </div>
                    <div className="p-col-12 p-md-4 p-field">
                        <label htmlFor="emailCompanie">Correo de contacto</label>
                        <InputText id="emailCompanie" name="emailCompanie" value={companie.emailCompanie} onChange={(e) => onInputChange(e)} 
                        required className={classNames({ 'p-invalid': enviado && !companie.emailCompanie })} />
                        {enviado && !companie.emailCompanie && <small className="p-invalid">El correo es requerido.</small>}
                    </div>
                </div>
            </Dialog>
            <Dialog visible={deleteDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteCompanieDialogFooter} onHide={()=> hideDeleteCompanie()}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                        {selectedCompanie && <span>¿Está seguro de que desea eliminar la compañía {selectedCompanie.razonSocial}?</span>}
                    </div>
            </Dialog>
        </div>

     );
}

const styles = { 
    container: {
        margin: '1em',
        maxHeight: '4em'
    },
    titlePage:{
        fontSize: '2.5em'
    },
    colNew:{
        backgroundColor: 'red'
    },
    colList:{
        backgroundColor: 'blue'
    },
    colTitle:{
        fontSize: '1.5em',
        fontStyle: 'italic'
    },
    buttonContainer:{
        alignItems: 'right',
        width: '100%'
    },
    buttonNew:{
        marginLeft: '25%'
    }
}
 
export default Companie;