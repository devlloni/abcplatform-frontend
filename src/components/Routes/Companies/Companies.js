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

const Companies = () => {
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
        artCompanie: '',
        emailCompanie: '',
        phoneCompanie: ''
    }
    //?EFFECTS
    useEffect( ()=>{
        test();
        // if(!companies){
        //     test();
        // }
    }, [])
    const test =  async ( ) => {
        const resp = await clienteAxios.get('/companias');
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

    const submitNewCompanie = async e => {
        setEnviado(true);
        //*Validaciones
        if( !companie.razonSocial || companie.razonSocial.trim() === ''   ||
            !companie.fantasieName || companie.fantasieName.trim() === '' ||
            !companie.addressCompanie || companie.addressCompanie.trim() === '' ||
            !companie.cityCompanie || companie.cityCompanie.trim() === '' ||
            !companie.stateCompanie || companie.stateCompanie.trim() === '' ||
            !companie.ciiuCompanie || companie.ciiuCompanie.trim() === '' ||
            !companie.artCompanie || companie.artCompanie.trim() === '' ||
            !companie.emailCompanie || companie.emailCompanie.trim() === '' ||
            !companie.phoneCompanie || companie.phoneCompanie.trim() === '' ||
            !companie.cuitCompanie || companie.cuitCompanie.trim() === '')
            {  
                return showToast('error', 'Error message', '¡Completa todos los campos!')
            }
        else{
            try {
                const respuesta = await clienteAxios.post('/companias', companie);
                if(respuesta.status === 200){
                    test();
                    setEnviado(false);
                    setCompanie(emptyCompanie);
                    setCompanieDialog(false);
                    return showToast('success', 'Success message', '¡Compañía agregada a la base de datos!');
                }
            } catch (error) {
                return showToast('error', 'Error message', 'Error inesperado, por favor intentelo nuevamente en unos minutos.');
            }
        }
    }

    const hideDeleteCompanie = () => {
        setDeleteDialog(false);
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
                test();
                setDeleteDialog(false);
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
            <Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={(e) => editCompanie(rawData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={(e) => confirmDeleteCompanie(rawData)} />
            </Fragment>
        )
    }


    return ( 
        <div className="datatable-crud-demo" 
            style={
                {
                    paddingBottom: '50px',
                    marginTop: '100px'
                }
            }>
            {companies ? (
                <Fragment>
            <Toast ref={myToast} />
            <div className='center'> <h3>Compañías</h3> </div>
           
            <div className='card'>
                <Toolbar className="p-mb-4" 
                    left={leftToolbarTemplate()} 
                    right={rightToolbarTemplate()}
                ></Toolbar>
                <DataTable 
                        value={companies}
                        className='p-datatable-responsive-demo'
                        selection={selectedCompanies}
                        style={{minHeight: '1000px'}}
                        onSelectionChange={(e) => {
                            console.log(e);
                            setSelectedCompanies(e.value)
                        }}
                        globalFilter={globalFilter}
                        lazy
                        //ref={(el) => this.dt = el} value={this.state.products} selection={this.state.selectedProducts} onSelectionChange={(e) => this.setState({ selectedProducts: e.value })}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} compañías"
                        header={header}
                    >
                        <Column selectionMode="multiple"  headerStyle={{ width: '3rem' }}></Column>
                        <Column field="razonSocial" header="Razón social"></Column>
                        <Column field="fantasieName" header="Nombre de fantasía" sortable></Column>
                        <Column field="cuitCompanie" header="CUIT"></Column>
                        <Column field="ciiuCompanie" header="CIIU" sortable></Column>
                        <Column field="artCompanie" header='A.R.T' sortable></Column>
                        <Column field="emailCompanie" header="Contacto"></Column>
                        <Column body={actionBody}></Column>
                </DataTable>
                
            </div>
            <div className='card'>
                <div className='card-title'>Titulo del cuadro</div>
                <div className='card-content'>
                <InputText 
                    type='text'
                    placeholder="Prueba de ingreso de texto debajo de coso"
                />
                </div>
                
            </div>
            
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
                        <label htmlFor="ciiuCompanie">C.I.I.U</label>
                        <InputText id="ciiuCompanie" name="ciiuCompanie" value={companie.ciiuCompanie} onChange={(e) => onInputChange(e)} required autoFocus 
                        className={classNames({ 'p-invalid': enviado && !companie.ciiuCompanie })} />
                        {enviado && !companie.ciiuCompanie && <small className="p-invalid">El C.I.I.U es requerido.</small>}
                    </div>
                    <div className="p-col-12 p-md-6 p-field">
                        <label htmlFor="artCompanie">A.R.T</label>
                        <InputText id="artCompanie" name="artCompanie" value={companie.artCompanie} onChange={(e) => onInputChange(e)} 
                        required className={classNames({ 'p-invalid': enviado && !companie.artCompanie })} />
                        {enviado && !companie.artCompanie && <small className="p-invalid">A.R.T es requerido.</small>}
                    </div>
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
            {/* DIALOG DELETE */}
            <Dialog visible={deleteDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteCompanieDialogFooter} onHide={()=> hideDeleteCompanie()}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                        {selectedCompanie && <span>¿Está seguro de que desea eliminar la compañía {selectedCompanie.razonSocial}?</span>}
                    </div>
            </Dialog>
            </Fragment>
            )
            :
            (
            <div style={{
                minHeight: '1000px',
                alignContent: 'center',
                alignItems: 'center',
                backgroundColor: 'red'
            }}>
                <ProgressSpinner />
            </div>)}
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
 
export default Companies;