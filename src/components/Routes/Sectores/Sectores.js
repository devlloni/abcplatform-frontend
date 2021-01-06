import React, {Fragment, useState, useEffect, useRef} from 'react';
import useWindowSize from '../../../hooks/useWindowSize';
import clienteAxios from '../../../config/clienteAxios';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Table } from '@fullcalendar/daygrid';

const Sectores = () => {
    document.title = "ABC | Sectores";
    const { width } = useWindowSize();

    const [ sectores, setSectores ] = useState(null);
    const [ sectorDialog, setSectorDialog ] = useState(false);
    const [ enviado, setEnviado ] = useState(false);
    const [ sector, setSector ] = useState({
        id: '',
        nombreSector: '',
        idCompania: ''
    });
    const [ globalFilter, setGlobalFilter ] = useState('');
    const [ companias, setCompanias ] = useState(null);
    const [ selectedSector, setSelectedSector ] = useState(null);

    const { nombreSector, idCompania } = sector;

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
    }, []);

    const reiniciarSector = () => {
        setSector({
            id: null,
            idCompania: '',
            nombreSector: ''
        });
        return;
    }

    const showSectorDialog = e => {
        setSectorDialog(true);
    }

    const submitEditSector = async (sector) => {

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
            try {
                const respuesta = await clienteAxios.post('/companias/sectores', sector);
                if(respuesta.status === 200){
                    getSectores();
                    setEnviado(false);
                    setSectorDialog(false);
                    reiniciarSector();
                    return showToast('success', '¡Sector cargado con éxito!', 'El sector fué cargado correctamente en la base de datos.');
                }
            } catch (error) {
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
    }

    const editSector = sector => {
        setSector({
            sector
        });
        setSectorDialog(true);
    }

    const dialogSectorFooter = () => {
        return(
                <React.Fragment>
                    <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={()=> hideDialog()} />
                    <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={()=> submitNewSector()} />
                </React.Fragment>
        );
    }

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
            <div>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editSector(rawData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={(e) => e.preventDefault()} />
            </div>
        );
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
            });
        }
        return(
            <Fragment>
                <span className='p-column-title'></span>

                {comp ? comp : ''}
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
                        <Column field='idCompanie' header='Companía asociada' body={idBodyTemplate}
                            filter={true} filterPlaceholder='Buscar por Companía.'
                        />
                    </DataTable>
                ):
                (<div className='center p-mt-6 p-mb-6'>
                    <ProgressSpinner />
                </div>)
                }
            </div>
        </div>
     );
}
 
export default Sectores;