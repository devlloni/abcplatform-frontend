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

const AgentesMateriales = ({showToast}) => {
    const myToast = React.useRef(null);
    const {  width } = useWindowSize();

    const [ data, setData ] = React.useState(null);
    const [ enviado, setEnviado ] = React.useState(false);
    const [ globalFilter, setGlobalFilter ] = React.useState('');
    const [ showDialog, setShowDialog ] = React.useState(false);
    const [ formData, setFormData ] = React.useState({
        nombreagentematerial: '',
        _id: ''
    });
    const { nombreagentematerial, _id } = formData;

    //* --------- FUNCTIONS & HOOKS -------- */

    React.useEffect( ()=>{
        if(!data){
            getData();
        }
    }, [])

    const reiniciarData = () => {
        setFormData({
            nombreagentematerial: '',
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

    //Get the data
    const getData = async () => {
        const resp = await clienteAxios.get('/generaldata/agentesmateriales');
        setData(resp.data.agentesMateriales)
    }
    const handleEdit = async () => {
        const resp = await clienteAxios.post('/generaldata/agentesmateriales/edit', formData);
        if(resp.status === 200){
            setShowDialog(false);
            reiniciarData();
            getData()
            return showToast('success', '¡Genial!', 'Editado con éxito');
        }else{
            return showToast('error', '¡Oops!', 'Ocurrió un error en el servidor');
        }
    }
    //Completar data
    const handleNewData = async () => {
        if(nombreagentematerial && nombreagentematerial.length > 4){
            if(formData._id){
                return handleEdit();
            }else{
                const resp = await clienteAxios.post('/generaldata/agentesmateriales', {
                    nombreagentematerial: formData.nombreagentematerial
                });
            if(resp.status === 200){
                if(resp.data.code === 1){
                    reiniciarData();
                    setShowDialog(false);
                    getData();
                    return showToast('success', '¡Perfecto!','¡Genial! El agente fué cargado con éxito.', )
                }else{
                    reiniciarData();
                    setShowDialog(false);
                    return showToast('error', '¡Ooops!', resp.data.msg )
                }
                
            }else{
                return showToast('error', '¡Oops!', 'Ocurrió un error en el servidor.');
            }
            }
        }else{
            return showToast('error', '¡Oops!', 'Completa todos los campos');
        }
        
    }
    const handleDelete = async (rawdata) => {
        console.log(rawdata)
        if(rawdata._id && rawdata._id.length > 0){
            const resp = await clienteAxios.post('/generaldata/agentesmateriales/delete', {id: rawdata._id});
            if(resp.status === 200){
                getData();
                return showToast('success', '¡Perfecto!', `['${rawdata.nombreagentematerial}]' eliminado con éxito.`);
            }
        }else{
            return showToast('error', '¡Error!','intente con otro item')
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
                            onClick={(e)=> e.preventDefault()} 
                        />
                    </div>
            </div>
        )
    }

    const TableHeader = (
        <div className="table-header">
                Contenido de agentes materiales cargados
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
                {rawData.nombreagentematerial}
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
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => handleDelete(rawData)} />
            </div>
        );
    }

    const headerdialog = (
        <div className='center'>Detalles de Agente Material</div>
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
        <h5 className='center'>Agentes Materiales</h5>
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
                    <Column field="nombreagentematerial" header="Nombre de agente material" body={Column1BodyTemplate}
                        filter={true} filterPlaceholder={'Buscar por Nombre'}
                    />
                    <Column field="_id" header="_id" body={Column2BodyTemplate}
                        filter={true} filterPlaceholder={'Buscar por _id'}
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
                                value={formData.nombreagentematerial}
                                name='nombreagentematerial'
                                id='nombreagentematerial'
                                className={classNames({ 'p-invalid': enviado && !formData.nombreagentematerial })}
                                onChange={(e) => onInputChange(e)}
                                placeholder="Nombre del agente material"
                            />
                            {enviado && !nombreagentematerial && <small className="p-invalid">nombreagentematerial es obligatorio.</small>}
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
                            {enviado && !_id && <small className="p-invalid">nombreagentematerial es obligatorio.</small>}
                        </div>
                    </div>
                </Dialog>
                </div>
            </div>

    </React.Fragment> 
    );
}
 
export default AgentesMateriales;