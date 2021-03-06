import React, { useState, useEffect, useRef } from 'react'
import clienteAxios from '../../../config/clienteAxios';
import { getPathname } from '../../../config/breadcrumb';
import { useLocation} from 'react-router-dom';
import { useParams, useHistory } from 'react-router-dom'
import { ScrollPanel } from 'primereact/scrollpanel';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Editor } from 'primereact/editor';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Types } from 'mongoose';
import { BreadCrumb } from 'primereact/breadcrumb'

const EditarIncidentePropiedad = () => {
    const location = useLocation();
    //
    const { ObjectId } = Types;
    const { id } = useParams();
    let history = useHistory();
    const myToast = useRef(null);
    const [ incidente, setIncidente ] = useState(null);
    const [ editando, setEditando ] = useState(false);
    const [ companies, setCompanies ] = useState(null);
    const [ sucursales, setSucursales ] = useState(null);
    const [ lugares, setLugares ] = useState(null);
    const [ sectores, setSectores ] = useState(null);
    const [ dataForm, setDataForm ] = useState({
        empresa: '',
        lugar: '',
        sucursal: '',
        sector: '',
        titulo: '',
        tipoIncidente: '',
        gravedad: '',
        investigacion: ''
    });
    const [ enviado, setEnviado ] = useState(false);
    const [ optionsIncident, setOptionsIncidente ] = useState([
        {label: 'Ambiente', value: 'Ambiente'},
        {label: 'Propiedad', value: 'Propiedad'}
    ]);
    const [ optionsGravedad, setOptionsGravedad ] = useState([
        {label: 'Sin daño', value: 'Sin daño'},
        {label: 'Leve', value: 'Leve'},
        {label: 'Moderado', value: 'Moderado'},
        {label: 'Mayor', value: 'Mayor'},
        {label: 'Catastrófico', value: 'Catastrofico'}
    ])
    const itemsBread = [
        {label: 'Incidentes', url: `${getPathname()}/incidentes`},
        {label: 'Editar incidente propiedad'}
    ];
    useEffect(()=>{
        if(!companies){
            getCompanies()
        }

    }, []);

    //! GET IF IS EDITING OR CREATING NEW
    
    useEffect(()=>{
        if(!id || id === undefined || id === null ){
            setEditando(false);
        }else{
            setEditando(true);
            if(ObjectId.isValid(id) && !incidente){
                getIncidente(id);
            }else{
                history.push('/incidentes/propiedad');
            }
        }
    }, [,editando,id])

    //! Funcs

    const showToast = (severityValue, summaryValue, detailValue) => {   
        myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
    }

    const getIncidente = async (id) => {
        const resp = await clienteAxios.get(`/incidentespropiedad/${id}`);
        let incidenteDb = resp.data.incidente[0];
        console.log('incidente db');
        console.log(incidenteDb);
        console.log('data form:');
        console.log(dataForm);
        if(incidenteDb){
            setIncidente(incidenteDb);
            setDataForm({
                ...dataForm,
                empresa: incidenteDb.compania,
                sucursal: incidenteDb.sucursal,
                lugar: incidenteDb.lugar,
                sector: incidenteDb.sector,
                titulo: incidenteDb.titulo,
                tipoIncidente: incidenteDb.tipoIncidente,
                gravedad: incidenteDb.gravedad,
                investigacion: incidenteDb.investigacion
            });
            getSucursalesEmpresa(incidenteDb.compania);
            getLugaresEmpresa(incidenteDb.compania);
        }else{
            history.push('/incidentes/propiedad');
        }
    }

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
        let allResp = resp.data;
        let puestos = allResp.puestos[0];
        let lugares = allResp.lugares[0];
        let sectores = allResp.sectores[0];

        let dataLugares = [];
        if(allResp.lugares.length > 0){
            for(let i = 0; i < lugares.length; i++){
                dataLugares.push({label: lugares[i].nombreLugar, value: lugares[i]._id});
            }
            setLugares(dataLugares);
        }
        let dataSectores = [];
        if(allResp.sectores.length > 0){
            for(let i = 0; i < sectores.length; i++){
                dataSectores.push({label: sectores[i].nombreSector, value: sectores[i]._id});
            }
            setSectores(dataSectores);
        }
    }

    const onChangeCompanie = e => {
        setDataForm({
            ...dataForm,
            empresa: e.value
        });
        getSucursalesEmpresa(e.value);
        getLugaresEmpresa(e.value);
    }

    const handleSubmitForm = async e => {
        if(!dataForm.empresa || !dataForm.lugar || !dataForm.sucursal || !dataForm.sector 
            || !dataForm.titulo || !dataForm.tipoIncidente || !dataForm.gravedad || !dataForm.investigacion){
                showToast('error', '¡Error!', 'Complete todos los campos primero.');
            }
        else{
            const resp = await clienteAxios.post('/incidentespropiedad/', dataForm);
            console.log(resp.data);
        }
        setEnviado(true);
    }

    const renderFirstLineCompanie = (
        <div className='p-fluid p-grid p-mr-1 p-ml-1'>
            <div className='p-sm-5 p-col-12'>
                <h6 style={{paddingBottom: '0.4em'}}>Compañía / Empresa</h6>
                <Dropdown 
                    options={companies}
                    value={dataForm.empresa}
                    name='companie'
                    onChange={(e)=> onChangeCompanie(e)}
                />
                {(enviado && !dataForm.empresa) && <small style={{color: 'red'}}>* La empresa o compañía es requerida. </small>}
            </div>
            <div className='p-sm-2 p-col-12'></div>
            <div className='p-sm-5 p-col-12'>

            <h6 style={{paddingBottom: '0.4em'}}>Lugar</h6>
                <Dropdown 
                    options={lugares}
                    value={dataForm.lugar}
                    disabled={dataForm.empresa ? false : true}
                    name='lugar'
                    onChange={(e)=> setDataForm({...dataForm, lugar: e.value})}
                />
                {(enviado && !dataForm.lugar) && <small style={{color: 'red'}}>* El lugar es requerido. </small>}
            </div>
        </div>
    );
    const renderSecondLineCompanie = (
        <div className='p-fluid p-grid p-mr-1 p-ml-1'>
            <div className='p-sm-5 p-col-12'>
                <h6 style={{paddingBottom: '0.4em'}}>Sucursal</h6>
                <Dropdown 
                    name='sucursal'
                    disabled={sucursales ? false : true}
                    options={sucursales}
                    value={dataForm.sucursal}
                    onChange={(e)=> setDataForm({...dataForm, sucursal: e.value})}
                />
                {(enviado && !dataForm.sucursal) && <small style={{color: 'red'}}>* La sucursal es requerida. </small>}
            </div>
            <div className='p-sm-2 p-col-12'></div>
            <div className='p-sm-5 p-col-12'>
                <h6 style={{paddingBottom: '0.4em'}}>Sector</h6>
                <Dropdown 
                    name='sector'
                    value={dataForm.sector}
                    options={sectores}
                    onChange={(e)=> setDataForm({...dataForm, sector: e.value})}
                    disabled={ dataForm.empresa ? false : true}
                />
                {(enviado && !dataForm.sector) && <small style={{color: 'red'}}>* El sector es requerido. </small>}
            </div>
        </div>
    )
    const renderFirstLine = (
        <div className='p-grid p-fluid p-mr-1 p-ml-1'>
            <div className='p-sm-12 p-col-12'>
                <h6 style={{paddingBottom: '0.4em'}}>Título</h6>
                <InputText 
                    value={dataForm.titulo}
                    name='titulo'
                    onChange={(e) => setDataForm({...dataForm, titulo: e.target.value})}
                    placeholder='Ej. Explosión de vidrios'
                />
                {(enviado && !dataForm.titulo) && <small style={{color: 'red'}}>* El título es requerido. </small>}
            </div>
            <div className='p-sm-12 p-col-12'>
                <h6 style={{paddingBottom: '0.4em'}}>Tipo de incidente</h6>
                <Dropdown 
                    value={dataForm.tipoIncidente}
                    name='tipoIncidente'
                    onChange={(e) => setDataForm({...dataForm, tipoIncidente: e.value})}
                    options={optionsIncident}
                    placeholder='Seleccionar...'
                />
                {(enviado && !dataForm.tipoIncidente) && <small style={{color: 'red'}}>* El tipo de incidente es requerido. </small>}
            </div>
        </div>
    )
    const renderSecondLine = (
        <div className='p-fluid p-grid p-mr-1 p-ml-1'>
            <div className='p-md-12 p-col-12'>
                <h6 style={{paddingBottom: '0.4em'}}>Gravedad</h6>
                <Dropdown 
                    options={optionsGravedad}
                    value={dataForm.gravedad}
                    onChange={(e) => setDataForm({...dataForm, gravedad: e.value})}
                    name='gravedad'
                    placeholder='Seleccionar...'
                />
                {(enviado && !dataForm.gravedad) && <small style={{color: 'red'}}>* La gravedad es requerida. </small>}
            </div>
            <hr style={{marginTop: '1.5em', marginBottom: '1.5em'}}/>
            <div className='p-md-12 p-col-12'>
                <h6 style={{paddingBottom: '0.4em'}}>Investigación del incidente</h6>
                <Editor 
                    value={dataForm.investigacion}
                    onTextChange={(e) => setDataForm({...dataForm, investigacion: e.htmlValue})}
                    name='investigacion'
                    style={{
                        height: '15em'
                    }}
                />
                {(enviado && !dataForm.investigacion) && <small style={{color: 'red'}}>* Ingrese al menos 50 caractéres de investigación. </small>}
            </div>
        </div>
    )

    const renderThirdLine = (
        <div className='p-grid p-fluid p-ml-1 p-mr-1'>
            <Toast 
                ref={myToast}
            />
                <div className='p-md-5 p-col-12'>
                    <h6 style={{paddingBottom: '0.4em'}}>Anexar archivo PDF</h6>
                    {/* <label htmlFor='pdfFiles'>Anexar archivo PDF</label> */}
                    <FileUpload 
                        mode='advanced'
                        name='pdfFiles'
                        url='./'
                        accept='.pdf'
                    />
                </div>        
                <div className='p-md-2 p-col-12'></div>
                <div className='p-md-5 p-col-12'>
                    <h6 style={{paddingBottom: '0.4em'}}>Anexar archivo PDF</h6>
                    {/* <label htmlFor='imageFiles'>Anexar imagenes</label> */}
                    <FileUpload 
                        mode='advanced'
                        name='imageFiles'
                        url='./'
                        multiple
                        accept='image/*'
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
    const RenderWhiteSpace = ({pb}) => {
        return(
            <div style={{
                paddingBottom: pb
            }}>
            </div>
        )
    }

    return(
        <div>
            <BreadCrumb model={itemsBread} home={{icon: 'pi pi-home', url: `${getPathname()}/`}} />
        <div className='p-mt-4'>
            <div className='p-text-center'>
                {editando ? <h5>Editando incidente {dataForm.titulo}</h5> : <h5>Carga de incidente a la propiedad/ambiente</h5>}
            </div>
            <ScrollPanel>
                <div className='p-mt-3 card'>
                    {renderFirstLineCompanie}
                    <hr style={{marginTop: '1.5em', marginBottom: '1.5em'}}/>
                    {renderSecondLineCompanie}
                </div>
                <div className='p-mt-3 card'>
                    {renderFirstLine}
                    <hr style={{marginTop: '1.5em', marginBottom: '1.5em'}}/>
                    {renderSecondLine}
                    <hr style={{marginTop: '1.5em', marginBottom: '1.5em'}}/>
                    {renderThirdLine}
                    <RenderWhiteSpace 
                        pb='4.5em'
                    />
                    <Button 
                        label='Guardar'
                        icon='pi pi-plus'
                        disabled={true}
                        onClick={(e) => handleSubmitForm(e)}
                        style={{width: '90%' ,marginLeft: '5%', marginRight: '5%', marginBottom: '2em'}}
                    />
                    <Button 
                        label='Salir'
                        icon='pi pi-times'
                        className='button p-button-warning'
                        onClick={(e) => history.push('/incidentes/')}
                        style={{width: '90%' ,marginLeft: '5%', marginRight: '5%', marginBottom: '2em'}}
                    />
                </div>
                {renderBlankSpace}
            </ScrollPanel>
        </div>
        </div>
    )
}


export default EditarIncidentePropiedad;