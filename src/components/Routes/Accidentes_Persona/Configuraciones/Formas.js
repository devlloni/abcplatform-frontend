import React from 'react';
import classNames from 'classnames';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner'
import { Dialog } from "primereact/dialog";
import useWindowSize from '../../../../hooks/useWindowSize';
import clienteAxios from '../../../../config/clienteAxios';

const Formas = ({showToast}) => {

    //? General Component Configs
    const PAGE_NAME = 'Formas'
    const TEMPLATE_NAME = 'Forma'

    const myToast = React.useRef(null);
    const {  width } = useWindowSize();

    const [ data, setData ] = React.useState(null);
    const [ enviado, setEnviado ] = React.useState(false);
    const [ globalFilter, setGlobalFilter ] = React.useState('');
    const [ showDialog, setShowDialog ] = React.useState(false);
    const [ formData, setFormData ] = React.useState({
        nombreaccidente: '',
        _id: ''
    });
    const { nombreaccidente, _id } = formData;

    //* --------- FUNCTIONS & HOOKS -------- */

    React.useEffect( () => {
        if(!data){
            getData();
        }
    },[])

    const reiniciarData = () => {
        setFormData({
            nombreaccidente: '',
            _id: ''
        });
    }
    const hideDialog = () => {
        setShowDialog(false);
        reiniciarData();
    }
    const onInputChange = e => {
       setFormData({
           ...formData,
           [e.target.name] : e.target.value
       });
    }
    const editForm = rawData => {
        setFormData(rawData);
        setShowDialog(true);
    }

    const getData = async () => {
        const resp = await clienteAxios.get('/generaldata/formasaccidente');
        setData(resp.data.formasaccidentes)
    }

    const handleEdit = async () => {
        const resp = await clienteAxios.post('/generaldata/formasaccidente/edit', formData);
        if(resp.status === 200){
            setShowDialog(false);
            reiniciarData();
            getData()
            return showToast('success', '¡Genial!', 'Editado con éxito');
        }else{
            return showToast('error', '¡Oops!', 'Ocurrió un error en el servidor');
        }
    }

    const handleNewData = async () => {
        if(nombreaccidente){
            if(formData._id){
                return handleEdit();
            }
            else{
                const resp = await clienteAxios.post('/generaldata/formasaccidente/', {
                    nombreaccidente: formData.nombreaccidente
                });
                if(resp.status === 200){
                    if(resp.data.code === 1){
                        reiniciarData();
                        setShowDialog(false);
                        getData();
                        return showToast('success', '¡Perfecto!','¡Genial! La forma fué cargado con éxito.', )
                    }else{
                        reiniciarData();
                        setShowDialog(false);
                        return showToast('error', '¡Ooops!', resp.data.msg )
                    }
                }else{
                    return showToast('error', '¡Oops!', 'Completa todos los campos');
                }
            }
        }
    }

    const handleDelete = async (rawdata) => {
        if(rawdata._id && rawdata._id.length > 0){
            const resp = await clienteAxios.post('/generaldata/formasaccidente/delete', { id : rawdata._id });
            if(resp.status === 200){
                getData();
                return showToast('success', '¡Perfecto!', `'[${rawdata.nombreaccidente}]' eliminado con éxito.`);
            }
        }
    }

    //* ---------  RENDER COMPONENTS -------- */

    const RenderToolbar = () => {
        return(
            <div className="p-grid p-fluid" style={{
                marginTop: '1em',
                marginLeft: '0.3em'
            }}>
                <div className='p-col-3'>
                    <Button 
                    label="Nuevo" 
                    icon={ width < 320 ? '' : "pi pi-plus" }
                    className="p-button-success p-mr-2" 
                    onClick={()=> setShowDialog(true)} 
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
        )
    }

    const TableHeader = (
        <div className="table-header">
                Contenido de formas cargadas
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Filtros globales" />
                </span>
        </div>
    )
    //Columns
    const Column1BodyTemplate = rawData => {
        return(
            <React.Fragment>
                <span className='p-column-title'></span>
                {rawData.nombreaccidente}
            </React.Fragment>
        )
    }
    const Column2BodyTemplate = rawData => {
        return(
            <React.Fragment>
                <span className='p-column-title'></span>
                {rawData._id}
            </React.Fragment>
        )
    }
    //Action
    const actionBody = (rawData) => {
        return(
            <div className='p-text-center'>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editForm(rawData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={(e) => handleDelete(rawData)} />
            </div>
        );
    }

    const headerdialog = (
        <div className='center'>Detalles de {TEMPLATE_NAME}</div>
    )
    const dialogFooter = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={()=> hideDialog()} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={()=> handleNewData()} />
        </div>
    );
    //! RENDER RETURN HOME.JS


    return ( 
    <React.Fragment>
        <h5 className='center'>{PAGE_NAME}</h5>
        <Toast ref={myToast} />

        <div className='card'>
            <RenderToolbar />  
        </div>

        <div className='datatable-filter-demo'>
                    <div className='card'>
                 {data ? 
                 (
                    <DataTable
                    value={data}
                    className='p-datatable-responsive-demo'
                    paginator rows={4} header={TableHeader}
                    globalFilter={globalFilter}
                 >
                    <Column field="nombreaccidente" header="Nombre del accidente" body={Column1BodyTemplate}
                        filter={true} filterPlaceholder={'Buscar por Forma'}
                    />
                    <Column field="_id" header="ID" body={Column2BodyTemplate}
                        filter={true} filterPlaceholder={'Buscar por ID'}
                    />
                    <Column body={actionBody} />
                 </DataTable>
                 ):
                 (
                    <div className='center p-mt-6 p-mb-6'>
                        <ProgressSpinner />
                    </div>
                 )}
                <Dialog
                    visible={showDialog}
                    style={ width < 993 ? {width: '450px'} : {width: '750px'}}
                    header={headerdialog}
                    modal className='p-fluid'
                    footer={dialogFooter}
                    onHide={()=> hideDialog()}
                >
                    <div className='p-grid p-fluid'>
                        <div className='p-col-12'>
                            <InputText 
                                value={formData.nombreaccidente}
                                name='nombreaccidente'
                                id='nombreaccidente'
                                className={classNames({ 'p-invalid': enviado && !formData.nombreaccidente })}
                                onChange={(e) => onInputChange(e)}
                                placeholder="Nombre del accidente"
                            />
                            {enviado && !nombreaccidente && <small className="p-invalid">Nombre es obligatorio.</small>}
                        </div>
                    </div>
                    <div className='p-grid p-fluid'>
                        <div className='p-col-12'>
                            <InputText 
                                value={formData._id}
                                name="_id"
                                disabled={true}
                                placeholder="_id"
                                className={classNames({ 'p-invalid': enviado && !_id })}
                                onChange={(e) => onInputChange(e)}
                            />
                            {/* {enviado && !_id && <small className="p-invalid">El ID es obligatorio.</small>} */}
                        </div>
                    </div>
                </Dialog>
                </div>
            </div>

    </React.Fragment> 
    );
}
 
export default Formas;