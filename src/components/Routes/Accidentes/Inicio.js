import React, {useState, useEffect} from 'react';

import { Button } from 'primereact/button';
import { AutoComplete } from 'primereact/autocomplete';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar'
import clienteAxios from '../../../config/clienteAxios';

const InicioPersona = () => {

    const [ dataForm, setDataForm ] = useState({
        nombre: '',
        companieId: '',
        medico: ''
    });
    const [ selectedEmpleado, setSelectedEmpleado ] = useState(null);
    const [ empleados, setEmpleados ] = useState(null);
    const [ companias, setCompanias ] = useState(null);
    const [ sucursales, setSucursales ] = useState(null); 
    //
    const [ compania, setCompania ] = useState('');
    const [ sucursal, setSucursal ] = useState('');
    const [ filteredEmpleados, setFilteredEmpleados ] = useState(null)
    useEffect(  ()=>{
        if(!empleados){
            getEmpleados();
        }
        if(!companias){
            getCompanies();
        }
        
        
    }, [])

    //!Funcs
    const getEmpleados = async () => {
        const resp = await clienteAxios.get('/usuarios/empleados');
        let data2 = resp.data.empleados;
        data2.map( item => {
            item.nombreCompleto = item.nombre + ' ' + item.apellido;
        });
        setEmpleados(data2);
    }
    const getCompanies = async () => {
        const resp = await clienteAxios.get('/companias');
        setCompanias(resp.data)
    }

    const getSucursal = async (companieId) => {
        const resp = await clienteAxios.get(`/branchoffices/${companieId}`);
        setSucursal(resp.data);
    }

    const searchEmpleado = event => {
        setTimeout( ()=>{
            let filteredEmpleados;
            if(!event.query.trim().length){
                filteredEmpleados = [...empleados];
            }else{
                filteredEmpleados = empleados.filter( empleado => {
                    return empleado.nombreCompleto.toLowerCase().startsWith(event.query.toLowerCase());
                })
            }
            setFilteredEmpleados(filteredEmpleados);
        },250);
    }
    const itemTemplate = item => {
        return(
            <div className='country-item'>
                <div>{item.nombreCompleto}</div>
            </div>
        )
    }
    const handleEmpleadoChange = e => {
        setSelectedEmpleado(e.value);
        onChangeEmpleado(e.value);
        if(e.value === ""){
            restartDataGral();
        }
    }
    
    const restartDataGral = () => {
        setCompania(null);
        setSucursal(null);
    }

    const onChangeEmpleado = empleado => {
        if(!companias || !empleado){
            console.log(empleado);
            return;
        }
        else{
            //!Handle companie
            let companiaSeleccionada = companias.filter(comp=>{
                return comp._id === empleado.compania
            });
            if(companiaSeleccionada.length>0){
                setCompania(companiaSeleccionada[0]);
                console.log(empleado)
            }else{
               return
            }
            // 
            //!Handle sucursales.
            if(('branchoffice' in empleado)){
                if(empleado.branchoffice !== null || empleado.branchoffice !== undefined){
                    getSucursal(empleado.branchoffice);
                }
            }
            //!Restart the config
            
        }
    }

    return ( 
        <div className='p-mt-4'>
            <div className='p-text-center'><h4>Incidentes de Persona</h4></div>
            <div className='p-mt-3 card'>
                <div className='p-grid p-fluid p-mr-1 p-ml-1'>
                    <div className='p-sm-4 p-col-12'>
                        <span className="p-input-icon-right">
                            <i className="pi pi-search" />
                            <AutoComplete 
                                dropdown
                                itemTemplate={itemTemplate}
                                value={selectedEmpleado}
                                onChange={(e)=> handleEmpleadoChange(e)}
                                field='nombreCompleto'
                                suggestions={filteredEmpleados}
                                completeMethod={searchEmpleado}
                            />
                        </span>
                    </div>
                    <div className='p-sm-4 p-col-12'>
                        <InputText 
                            placeholder='Nombre de empresa'
                            value={compania ? compania.razonSocial : ''}
                            onChange={(e)=> e.preventDefault()}
                            disabled={true}
                        />
                    </div>
                    <div className='p-sm-4 p-col-12'>
                        <InputText 
                            value={sucursal ? sucursal.nombre : ''}
                            onChange={(e)=>e.preventDefault()}
                            placeholder='Sucursal'
                            disabled={true}
                        />
                    </div>
                </div>
                <div className='p-grid p-fluid p-mr-1 p-ml-1'>
                    <div className='p-sm-5 p-col-6'>
                        <InputText 
                            placeholder='Medico a cargo'
                            value={dataForm.medico}
                            onChange={(e)=>{
                                setDataForm({...dataForm, medico: e.target.value})
                            }}
                        />
                    </div>
                    <div className='p-sm-5 p-col-5'>
                        <InputText 
                            placeholder='Ubicación'
                            value={
                                selectedEmpleado && (selectedEmpleado.localidad !== undefined || selectedEmpleado.localidad !== null ) ? selectedEmpleado.localidad : ''
                            }
                            disabled={true}
                        />
                    </div>
                    <div className='p-sm-2 p-col-1'>
                        <InputText 
                            placeholder='Código'
                            value={
                                selectedEmpleado && (selectedEmpleado._id !== undefined || selectedEmpleado._id !== null ) ? selectedEmpleado._id : ''
                            }
                            disabled={true}
                        />
                    </div>
                </div>
            </div>
            <div className='p-mt-3 card'>
                <div className='p-text-center'><h6 className='p-mt-4'>Datos</h6></div>
                <div className='p-grid p-fluid p-mr-1 p-ml-1'>
                    <div className='p-sm-4 p-col-12'></div>
                </div>
            </div>
        </div>
     );
}
 
export default InicioPersona;