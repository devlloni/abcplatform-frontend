import React, { useState, useEffect } from 'react'
import clienteAxios from '../../../config/clienteAxios';

import { ScrollPanel } from 'primereact/scrollpanel';
import { Dropdown } from 'primereact/dropdown';

const CargaIncidentePropiedad = () => {

    const [ companies, setCompanies ] = useState(null);
    const [ sucursales, setSucursales ] = useState(null);
    const [ lugares, setLugares ] = useState(null);
    const [ sectores, setSectores ] = useState(null);
    const [ dataForm, setDataForm ] = useState({
        empresa: '',
        lugar: '',
        sucursal: '',
        sector: ''
    });
    const [ enviado, setEnviado ] = useState(false);
    useEffect(()=>{
        if(!companies){
            getCompanies()
        }

    }, [])

    //! Funcs

    const getCompanies = async () => {
        const resp = await clienteAxios.get('/companias');
        console.log(resp.data);
        let dataCompanies = [];
        let companias = resp.data;
        for(let i = 0; i < companias.length; i++){
            dataCompanies.push({label: companias[i].razonSocial, value: companias[i]._id});
        }
        setCompanies(dataCompanies);
    }

    const getSucursalesEmpresa = async (empresaId) => {
        const resp = await clienteAxios.get(`/branchoffices/companie/${empresaId}`);
        let sucursales = resp.data.branchoffices;
        if(sucursales.length > 0){
            let sucursalesData = [];
            for(let i = 0; i < sucursales.length; i++){
                sucursalesData.push({label: sucursales[i].nombre, value: sucursales[i]._id});
            }
            setSucursales(sucursalesData);
        }else{
            return;
        }
    }
    
    const getLugaresEmpresa = async (empresaId) => {
        const resp = await clienteAxios.get(`/companias/dataByCompanie/${empresaId}`);
        console.log(resp.data);
    }

    const onChangeCompanie = e => {
        setDataForm({
            ...dataForm,
            empresa: e.value
        });
        getSucursalesEmpresa(e.value);
        getLugaresEmpresa(e.value);
    }

    const renderFirstLineCompanie = (
        <div className='p-fluid p-grid p-mr-1 p-ml-1'>
            <div className='p-sm-5 p-col-12'>
                <label htmlFor='companie'>Compañía / Empresa</label>
                    <Dropdown 
                        options={companies}
                        value={dataForm.empresa}
                        name='companie'
                        onChange={(e)=> onChangeCompanie(e)}
                    />
            </div>
            <div className='p-sm-2 p-col-12'></div>
            <div className='p-sm-5 p-col-12'>
                <label htmlFor='lugar'>Lugar</label>
                    <Dropdown 
                        options={companies}
                        value={dataForm.empresa}
                        name='lugar'
                        onChange={(e)=> setDataForm({...dataForm, empresa: e.value})}
                    />
            </div>
        </div>
    );
    const renderSecondLineCompanie = (
        <div className='p-fluid p-grid p-mr-1 p-ml-1'>
            <div className='p-sm-5 p-col-12'>
                <label htmlFor='sucursal'>Sucursal</label>
                <Dropdown 
                    name='sucursal'
                    disabled={sucursales ? false : true}
                    options={sucursales}
                    value={dataForm.sucursal}
                    onChange={(e)=> setDataForm({...dataForm, sucursal: e.value})}
                />
            </div>
            <div className='p-sm-2 p-col-12'></div>
            <div className='p-sm-5 p-col-12'>
                <label htmlFor='sucursal'>Sucursal</label>
                <Dropdown 
                    name='sucursal'
                />
            </div>
        </div>
    )

    const renderBlankSpace = (
        <div style={{
            paddingBottom: '10em'
        }}>
        </div>
    )

    return(
        <div className='p-mt-4'>
            <div className='p-text-center'><h4>Incidentes de la propiedad</h4></div>
            <ScrollPanel>
                <div className='p-mt-3 card'>
                    {renderFirstLineCompanie}
                    <hr style={{marginTop: '1.5em', marginBottom: '1.5em'}}/>
                    {renderSecondLineCompanie}
                </div>
                {renderBlankSpace}
            </ScrollPanel>
        </div>
    )
}


export default CargaIncidentePropiedad;