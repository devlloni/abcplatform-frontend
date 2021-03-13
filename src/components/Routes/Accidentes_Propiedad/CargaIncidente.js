import React, { useState, useEffect, useRef } from 'react'
import clienteAxios from '../../../config/clienteAxios';
import { useParams, useHistory } from 'react-router-dom'
import { ScrollPanel } from 'primereact/scrollpanel';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Editor } from 'primereact/editor';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Checkbox } from 'primereact/checkbox'

const CargaIncidentePropiedad = (props) => {
    const baseUrl = 'http://localhost:5005/api';
    let history = useHistory();
    const { id } = useParams();
    const myToast = useRef(null);
    const uploader = useRef(null);
    const [ enviarMail, setEnviarMail ] = useState(false)
    const [ editando, setEditando ] = useState(false);
    const [ companies, setCompanies ] = useState(null);
    const [ sucursales, setSucursales ] = useState(null);
    const [ imagesSelected, setImagesSelected ] = useState(0);
    const [ lugares, setLugares ] = useState(null);
    const [ sectores, setSectores ] = useState(null);
    const [ filesUploaded, setFilesUploaded ] = useState(null);
    const [ yaSubioImagenes, setYaSubioImagenes ] = useState(false);
    const [ pdfSelected, setPdfSelected ] = useState(0);
    const [ pdfUploaded, setPdfUploaded ] = useState(null);
    const [ yaSubioPdf, setYaSubioPdf ] = useState(false);
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
        }
    }, [,editando,id])

    //! Funcs

    const showToast = (severityValue, summaryValue, detailValue) => {   
        myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
    }

    const getIncidente = async (id) => {
        const resp = await clienteAxios.get(`/incidentespropiedad/${id}`);
        console.log(resp);
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

    const handleUploadedFiles = e => {
        let json = JSON.parse(e.xhr.response);
        setFilesUploaded(json);
        setYaSubioImagenes(true);
    }

    const handleUploadedPdfs = e => {
        let json = JSON.parse(e.xhr.response);
        setPdfUploaded(json);
        setYaSubioPdf(true);
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
            //ABC-40
            if(!filesUploaded){
                dataForm.imagenes = [];
            }else{
                dataForm.imagenes = filesUploaded;
            }
            console.log(dataForm)
            if(!pdfUploaded){
                dataForm.files = [];
            }else{
                dataForm.files = pdfUploaded;
            }
            const resp = await clienteAxios.post('/incidentespropiedad/', dataForm);
            if(resp.status === 200 && resp.data.incidente){
                showToast('success', '¡Perfecto!', 'Incidente a la propiedad cargado con éxito.');
                history.push(`/incidentes/propiedad/${resp.data.incidente._id}`)

            }else{
                return showToast('warn', '¡Ooops!', 'Estamos enfrentando problemas en el servidor, intenta más tarde.');
            }
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
                    {yaSubioPdf && <p style={{color: 'green'}}>¡Archivos subidos con éxito!</p>}
                    <FileUpload 
                        disabled={yaSubioPdf}
                        mode='advanced'
                        multiple
                        name={pdfSelected > 1 ? 'pdfs' : 'pdf'}
                        url={ pdfSelected > 1 ? `${baseUrl}/files/multiple` : `${baseUrl}/files/simple`}
                        accept='application/pdf'
                        onSelect={(e)=>{
                            setPdfSelected(pdfSelected + e.files.length);
                        }}
                        onRemove={(e)=> setPdfSelected(pdfSelected - 1)}
                        onUpload={(e)=> {
                            setPdfSelected(0);
                            handleUploadedPdfs(e)
                        }}
                        chooseLabel="Elegir archivos"
                        uploadLabel="Subir archivos"
                    />
                    {yaSubioPdf && <small style={{color: 'red'}}>Ya subiste los PDF, ahora solo queda guardar el incidente.</small>}
                </div>         
                <div className='p-md-2 p-col-12'></div>
                <div className='p-md-5 p-col-12'>
                    <h6 style={{paddingBottom: '0.4em'}}>Anexar Imagenes</h6>
                    {/* <label htmlFor='imageFiles'>Anexar imagenes</label> */}
                    {yaSubioImagenes && <p style={{color: 'green'}}>¡Imagenes subidas con éxito!</p>}
                    <FileUpload 
                        disabled={yaSubioImagenes}
                        mode='advanced'
                        name={imagesSelected > 1 ? 'images' : 'image'}
                        url={ imagesSelected > 1 ? `${baseUrl}/imagenes/multiple` : `${baseUrl}/imagenes/simple`}
                        multiple
                        maxFileSize="1000000"
                        accept='image/*'
                        onSelect={(e)=>{
                            setImagesSelected(imagesSelected + e.files.length);
                        }}
                        onRemove={(e)=> setImagesSelected(imagesSelected - 1)}
                        onUpload={(e)=> {
                            setImagesSelected(0);
                            handleUploadedFiles(e)
                        }}
                        chooseLabel="Elegir archivos"
                        uploadLabel="Subir archivos"
                    />
                    {yaSubioImagenes && (<small style={{color: 'red'}}> Ya subiste las imagenes, ahora solo queda guardar el incidente. </small>)}
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
                    <div className='p-grid p-fluid'>
                        <div className='p-md-1 p-col-1'></div>
                        <div className='p-md-3 p-col-3'>
                            <Checkbox 
                                    name='enviarMail'
                                    checked={enviarMail}
                                    onChange={(e)=> {
                                        setEnviarMail(!enviarMail);
                                        console.log('images selected: ', imagesSelected)
                                    }}
                                />
                            <label style={{fontSize: '1em', marginLeft: '0.2em', color: 'black'}} htmlFor='enviarMail'>Envíar mail a empleados de la empresa</label>
                        </div>
                        <div className='p-md-8 p-col-8'>
                            <Button 
                            label='Guardar'
                            icon='pi pi-plus'
                            onClick={(e) => handleSubmitForm(e)}
                            style={{width: '90%' ,marginLeft: '5%', marginRight: '5%', marginBottom: '2em'}}
                            />
                        </div>
                    </div>
                </div>
                {renderBlankSpace}
            </ScrollPanel>
        </div>
    )
}


export default CargaIncidentePropiedad;