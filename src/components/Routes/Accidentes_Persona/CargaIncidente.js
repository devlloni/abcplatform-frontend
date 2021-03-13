import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { localeEs } from '../../../helpers/locale';
import { Tooltip } from 'primereact/tooltip'
import { Button } from 'primereact/button';
import { AutoComplete } from 'primereact/autocomplete';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar'
import { Checkbox } from 'primereact/checkbox'
import { ScrollPanel } from 'primereact/scrollpanel';
import clienteAxios from '../../../config/clienteAxios';
import moment from 'moment';
import styled from 'styled-components';
import { Toast } from 'primereact/toast';
import { Fieldset } from 'primereact/fieldset';
import { Editor } from 'primereact/editor';
import crs from 'crypto-random-string';
import cryptoRandomString from 'crypto-random-string';

const Divisor = styled.hr`
    margin-top: '1.5em';
    margin-bottom: 1.5em;
    color: black;
`;

const CargaIncidente = () => {
    let history = useHistory();
    const [ sucursal, setSucursal ] = useState('');
    const [ diagnosticos, setDiagnosticos] = useState([
        {naturalezalesion: '', zonacuerpo: ''}
    ])
    const [ dataForm, setDataForm ] = useState({
        nombre: '',
        usuario: '',
        compania: '',
        // puesto: '',
        lugar: '',
        denuncia: '',
        tipo: '',
        numerosiniestro: '',
        fechadenuncia: '',
        fechaincidente: '',
        horaincidente: '',
        gravedad: '',
        horaingreso: '',
        sector: '',
        turno: '',
        jefeacargo: '',
        testigos: '',
        estabaenpuesto: true,
        trabajohabitual: true,
        recalificacion: false,
        forma: '',
        agentematerial: '',
        naturaleza: '',
        zonacuerpo: '',
        fechaalta: '',
        diasbaja: '',
        codigo: '',
        titulo: '', //Story/ABC-22
        investigacion: '',
        causasraiz: '',
        causasinmediatas: '',
        causasbasicas: '',
        causasgestion: '',
        descripcioncausainmediata: '',
        diagnostico: [
            { naturalezalesion: '', zonacuerpo: ''}
        ]

    });
    const [ submitForm, setSubmitForm ] = useState(false);
    const [ selectedEmpleado, setSelectedEmpleado ] = useState(null);
    const [ empleados, setEmpleados ] = useState(null);
    const [ companias, setCompanias ] = useState(null);
    //
    const [ enviarMail, setEnviarMail ] = useState(false);
    const [ formEnviado, setFormEnviado ] = useState(false);
    //
    const [ compania, setCompania ] = useState('');
    const [ lugares, setLugares ] = useState(null);
    const [ puestos, setPuestos ] = useState(null);
    const [ sectores, setSectores ] = useState(null);
    const [ agentesMateriales, setAgentesMateriales ] = useState(null);
    const [ zonaCuerpo, setZonaCuerpo ] = useState(null);
    const [ naturalezaLesion, setNaturalezaLesion ] = useState(null);
    const [ formas, setFormas ] = useState(null);
    //
    const [ causasBasicas, setCausasBasicas ] = useState(null);
    const [ causasGestion, setCausasGestion ] = useState(null);
    const [ causasInmediatas, setCausasInmediatas ] = useState(null);

    const [ filteredEmpleados, setFilteredEmpleados ] = useState(null);
    //*
    const [ denunciasConfig, setDenunciasConfig ] = useState([
        {label: 'Denunciado', value: 'Denunciado'},
        {label: 'No denunciado', value: 'No denunciado'},
        {label: 'Autodenuncia', value: 'Autodenuncia'}
    ]);
    const [ clasificacionConfig, setClasificacionConfig ] = useState([
        {label: 'Accidente de Trabajo', value: 'Accidente de Trabajo'},
        {label: 'Accidente In Itinere', value: 'Accidente In Itinere'}
    ]);
    const [ gravedadConfig, setGravedadConfig ] = useState([
        {label: 'Leve', value: 'Leve'},
        {label: 'Moderado', value: 'Moderado'},
        {label: 'Grave', value: 'Grave'},
        {label: 'Mortal', value: 'Mortal'}
    ])
    const [ sinoConfig, setSinoConfig ] = useState([
        {label: 'Si', value: true},
        {label: 'No', value: false}
    ])
    useEffect(  ()=>{
        if(!empleados){
            getEmpleados();
        }
        if(!companias){
            getCompanies();
        }
        if(!formas || !naturalezaLesion || !agentesMateriales || !zonaCuerpo){
            getGeneralData();
        }
        
    }, []);

    const myToast = useRef(null);
    const showToast = (severityValue, summaryValue, detailValue) => {   
    myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
  }

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
        let sucursal = resp.data;
        return sucursal;        
    }

    const getDataByCompanie = async (companieId) => {
        const resp = await clienteAxios.get(`/companias/dataByCompanie/${companieId}`);
        let allResp = resp.data;
        let puestos = allResp.puestos[0];
        let lugares = allResp.lugares[0];
        let sectores = allResp.sectores[0];
        // console.log(allResp);
        let dataPuestos = [];
        if(allResp.puestos.length > 0){
            for(let i = 0; i < puestos.length; i++){
                dataPuestos.push({label: puestos[i].nombrePuesto, value: puestos[i]._id});
            }
            setPuestos(dataPuestos);
        }
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
        // setLugares(dataLugares);
        // setPuestos(dataPuestos);
    }

    const postNewIncidente = async e => {
        e.preventDefault();
        //!Validaciones
        if(
            !dataForm.usuario || dataForm.usuario.trim() === '' ||
            !dataForm.compania || dataForm.compania.trim() === '' ||
            // !dataForm.puesto || dataForm.puesto.trim() === '' ||
            !dataForm.lugar || dataForm.lugar.trim() === '' ||
            !dataForm.denuncia || dataForm.denuncia.trim() === '' ||
            !dataForm.tipo || dataForm.tipo.trim() === '' ||
            !dataForm.numerosiniestro || dataForm.numerosiniestro.trim() === '' ||
            !dataForm.fechadenuncia || 
            !dataForm.fechaincidente || 
            !dataForm.horaincidente || 
            !dataForm.gravedad || dataForm.gravedad.trim() === '' ||
            !dataForm.horaingreso || dataForm.horaingreso.trim() === '' ||
            !dataForm.sector || dataForm.sector.trim() === '' ||
            !dataForm.turno || dataForm.turno.trim() === '' ||
            !dataForm.jefeacargo || dataForm.jefeacargo.trim() === '' ||
            !dataForm.testigos || dataForm.testigos.trim() === '' ||
            
            !dataForm.forma || dataForm.forma.trim() === '' ||
            !dataForm.agentematerial || dataForm.agentematerial.trim() === '' ||
            // !dataForm.naturaleza || dataForm.naturaleza.trim() === '' ||
            // !dataForm.zonacuerpo || dataForm.zonacuerpo.trim() === '' ||
            // !dataForm.fechaalta ||
            // !dataForm.codigo || dataForm.codigo.trim() === '' ||
            !dataForm.titulo || dataForm.titulo.trim() === '' ||
            !dataForm.investigacion || dataForm.investigacion.trim() === '' ||
            !dataForm.causasraiz || dataForm.causasraiz.trim() === '' ||
            !dataForm.causasinmediatas || dataForm.causasinmediatas.trim() === '' ||
            !dataForm.causasbasicas || dataForm.causasbasicas.trim() === '' ||
            !dataForm.causasinmediatas || dataForm.causasinmediatas.trim() === '' ||
            !diagnosticos[0].zonacuerpo || !diagnosticos[0].naturalezalesion
        ){
            return showToast('error', '¡Revisa bien!', 'Verifica que todos los campos estén completos.');
        }else{
            setSubmitForm(true);
            let dat = dataForm;
            dat.diagnosticos = diagnosticos;
            console.log(dat);
            const resp = await clienteAxios.post('/incidentespersona/', dat);
            if(resp.status === 200){
                console.log(resp.data);
                showToast('success', '¡Exito!', `La incidencia a ${dat.nombre} fué cargada con éxito.`)
                setTimeout(()=>{
                    return history.push(`/incidentes/persona/${resp.data.incidente._id}`)
                    // console.log(`enviando a /incidentes/persona/${resp.data.incidente._id}`);
                }, 2000);
            }else{
                return showToast('error', '¡Error!', 'Ocurrió un error en el servidor...');
            }
            // return showToast('success', '¡Genial!', 'Se cargó el incidente.');
        }
        
    }

    const getGeneralData = async () => {
        const resp = await clienteAxios.get('/generaldata/allData');
        let allResp = resp.data;
        let formas = allResp.formas;
        let agentesmateriales = allResp.agentesmateriales;
        let zonacuerpo = allResp.zonacuerpo;
        let naturaleza = allResp.naturaleza;
        let causasbasicas = allResp.causasbasicas;
        let causasinmediatas = allResp.causasinmediatas;
        let causasgestion = allResp.causasgestion;

        //
        let dataCausasBasicas = [];
        if(allResp.causasbasicas.length > 0){
            for(let i = 0; i < causasbasicas.length; i++){
                dataCausasBasicas.push({label: causasbasicas[i].nombrecausasbasicas, value: causasbasicas[i]._id});
            }
            setCausasBasicas(dataCausasBasicas);
        }
        let dataCausasGestion = [];
        if(allResp.causasgestion.length > 0){
            for(let i = 0; i < causasgestion.length; i++){
                dataCausasGestion.push({label: causasgestion[i].nombrecausasgestion, value: causasgestion[i]._id});
            }
            setCausasGestion(dataCausasGestion);
        }
        let dataCausasInmediatas = [];
        if(allResp.causasinmediatas.length > 0){
            for(let i = 0; i < causasinmediatas.length; i++){
                dataCausasInmediatas.push({label: causasinmediatas[i].nombrecausasinmediatas, value: causasinmediatas[i]._id})
            }
            setCausasInmediatas(dataCausasInmediatas)
        }
        let dataFormas = [];
        if(allResp.formas.length > 0){
            for(let i = 0; i < formas.length; i++){
                dataFormas.push({label: formas[i].nombreaccidente, value: formas[i]._id});
            }
            setFormas(dataFormas);
        }
        let dataAgentes = [];
        if(allResp.agentesmateriales.length > 0){
            for(let i = 0; i < agentesmateriales.length; i++){
                dataAgentes.push({label: agentesmateriales[i].nombreagentematerial, value: agentesmateriales[i]._id});
            }
            setAgentesMateriales(dataAgentes);
        }
        let dataNaturaleza = [];
        if(allResp.naturaleza.length > 0){
            for(let i = 0; i < naturaleza.length; i++){
                dataNaturaleza.push({label: naturaleza[i].nombrenaturalezalesion, value: naturaleza[i]._id});
            }
            setNaturalezaLesion(dataNaturaleza);
        }
        let dataZonaCuerpo = [];
        if(allResp.zonacuerpo.length > 0){
            for(let i = 0; i < zonacuerpo.length; i++){
                dataZonaCuerpo.push({label: zonacuerpo[i].nombrezonacuerpo, value: zonacuerpo[i]._id});
            }
            setZonaCuerpo(dataZonaCuerpo);
        }
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
    
    const onChangeFechaAlta = e => {
        if(e.value && dataForm.fechaincidente){
            let fechaAlta = moment(e.value);
            let fechaAccidente = moment(dataForm.fechaincidente);
            // let diferencia = fechaAccidente.diff(fechaAlta, 'days');
            let diferencia = fechaAlta.diff(fechaAccidente, 'days');
            setDataForm({
                ...dataForm,
                fechaalta: e.value,
                diasbaja: diferencia
            });
        }else if(e.value){
            setDataForm({
                ...dataForm,
                fechaalta: e.value
            });
        }
    }

    const restartDataGral = () => {
        setCompania(null);
        setSucursal(null);
        setLugares(null);
        setPuestos(null);
    }

    const handleCamposChange = e => {
        setDataForm({
            ...dataForm,
            [e.target.name] : e.target.value
        });
    }

    const handleNewDiagnostico = () => {
        setDiagnosticos([...diagnosticos, {naturalezalesion: '', zonacuerpo: ''}]);
    }

    const handleDeleteDiagnostico = index => {
        let diagnos = [...diagnosticos];
        let diagnosRemoved = diagnos.filter((d, i) => i !== index);
        setDiagnosticos(diagnosRemoved);
    }

    const onChangeEmpleado = async empleado => {
        if(!companias || !empleado){
            return;
        }
        else{
            if(typeof(empleado) === 'object'){
                let codigo = 'dsaxax';
                
                 //!Handle companie
                let companiaSeleccionada = companias.filter(comp=>{
                    return comp._id === empleado.compania
                });
                if(companiaSeleccionada.length>0){
                    let code= `ip-${companiaSeleccionada[0].razonSocial.substr(0,[3]).toLowerCase()}-${cryptoRandomString({length: 5, type:'numeric'})}`
                    setDataForm({
                        ...dataForm,
                        usuario: empleado._id,
                        nombre: empleado.nombreCompleto,
                        compania: empleado.compania,
                        codigo: code
                    });
                    setCompania(companiaSeleccionada[0]);
                    getDataByCompanie(companiaSeleccionada[0]._id);
                   
                    
                }else{
                   return
                }
                //!Handle sucursales.
                if(('branchoffice' in empleado)){
                    if(empleado.branchoffice !== null || empleado.branchoffice !== undefined){
                        let sucursalObtained = await getSucursal(empleado.branchoffice);
                        //
                        if(sucursalObtained || sucursalObtained !== null || sucursalObtained !== undefined){
                            setSucursal(sucursalObtained);
                            
                        }
                    }
                }
            }
            //!Handle user
            
           
            
            
            // 
            
            //!Restart the config
            
        }
    }
    //*Helpers

    //*Components

    const renderFirstLineUser = (
        <div className='p-grid p-fluid p-mr-1 p-ml-1'>
                    <div className='p-sm-4 p-col-12'>
                        <label htmlFor='nombreyapellido'>Nombre y apellido del empleado</label>
                        <span className="p-input-icon-right">
                            <i className="pi pi-search" />
                            <AutoComplete 
                                dropdown
                                name='nombreyapellido'
                                itemTemplate={itemTemplate}
                                value={selectedEmpleado}
                                onChange={(e)=> handleEmpleadoChange(e)}
                                field='nombreCompleto'
                                suggestions={filteredEmpleados}
                                completeMethod={searchEmpleado}
                            />
                        </span>
                        {formEnviado && !selectedEmpleado ? <small style={{color: 'red'}}>El empleado es obligatorio.</small> : ''}
                    </div>
                    <div className='p-sm-4 p-col-12'>
                        <label htmlFor='compania'>Pertenece a la empresa</label>
                        <InputText 
                            name='compania'
                            placeholder='Nombre de empresa'
                            value={compania ? compania.razonSocial : ''}
                            onChange={(e)=> handleCamposChange(e)}
                            disabled={true}
                        />
                    </div>
                    <div className='p-sm-4 p-col-12'>
                        <label htmlFor='sucursal'>Sucursal en la que trabaja</label>
                        <InputText 
                            name='sucursal'
                            value={sucursal ? sucursal.nombre : ''}
                            onChange={(e)=>e.preventDefault()}
                            placeholder='Sucursal'
                            disabled={true}
                        />
                    </div>
                </div>
    )

    const renderSecondLineUser = (
        <div className='p-grid p-fluid p-mr-1 p-ml-1'>
                    <div className='p-sm-5 p-col-6'>
                        <label htmlFor='provincia'>Provincia</label>
                        <InputText 
                            name='provincia'
                            placeholder='Provincia...'
                            value={
                                selectedEmpleado && (selectedEmpleado.provincia !== undefined || selectedEmpleado.provincia !== null ) ? selectedEmpleado.provincia : ''
                            }
                            disabled={true}
                        />
                    </div>
                    <div className='p-sm-5 p-col-5'>
                        <label htmlFor='ubicacion'>Ubicación</label>
                        <InputText 
                            name='ubicacion'
                            placeholder='Ubicación'
                            value={
                                selectedEmpleado && (selectedEmpleado.localidad !== undefined || selectedEmpleado.localidad !== null ) ? selectedEmpleado.localidad : ''
                            }
                            disabled={true}
                        />
                    </div>
                    <div className='p-sm-2 p-col-12'>
                        <label htmlFor='_id'>Código / ID </label>
                        <InputText 
                            name='_id'
                            placeholder='Código'
                            value={
                                dataForm.codigo
                            }
                            disabled={true}
                        />
                    </div>
                </div>
            );

    const renderFirstLine = (
        <div className='p-grid p-fluid p-mr-1 p-ml-1'>
            <div className='p-sm-4 p-col-12'>
                        <label htmlFor='artCompanie'>A.R.T</label>
                        <InputText 
                            name='artCompanie'
                            disabled={true}
                            value={compania ? compania.artCompanie : ''}
                            onChange={(e)=> e.preventDefault()}
                        />
            </div>
            <div className='p-sm-4 p-col-12'>
                <label htmlFor='denuncia'>Tipo de denuncia</label>
                <Dropdown 
                    placeholder='Tipo de denuncia'
                    name='denuncia'
                    options={denunciasConfig}
                    value={dataForm.denuncia}
                    onChange={(e)=>{
                        setDataForm({
                            ...dataForm,
                            denuncia: e.value
                        });
                    }}
                />
                {formEnviado && !dataForm.denuncia ? <small style={{color: 'red'}}>El tipo de denuncia es obligatorio.</small> : ''}
            </div>
            <div className='p-sm-4 p-col-12'>
                <label htmlFor='tipo'>Tipo de accidente</label>
                <Dropdown 
                    placeholder='Tipo de accidente'
                    name='tipo'
                    options={clasificacionConfig}
                    value={dataForm.tipo}
                    onChange={(e)=>{
                        setDataForm({
                            ...dataForm,
                            tipo: e.value
                        });
                    }}
                />
                {formEnviado && !dataForm.tipo ? <small style={{color: 'red'}}>El tipo de accidente es obligatorio.</small> : ''}
            </div>
        </div>
    )

    

    const renderSecondLine = (
        <div className='p-grid p-fluid p-mr-1 p-ml-1'key='renderSecondLine'>
            <div className='p-sm-6 p-col-12'>
                <label htmlFor='fechadenuncia'>Fecha de denuncia</label>
                <Calendar 
                    id='fechadenuncia'
                    key='fechadenuncia'
                    placeholder={ dataForm.fechaincidente ? 'Fecha de denuncia' : 'Primero setee la fecha del accidente'}
                    name='fechadenuncia'
                    dateFormat='dd/mm/yy'
                    disabled={ dataForm.fechaincidente ? false : true }
                    locale={localeEs}
                    minDate={ dataForm.fechaincidente }
                    value={dataForm.fechadenuncia}
                    onChange={(e) => setDataForm({
                        ...dataForm,
                        fechadenuncia: e.value
                    })}
                />
                {formEnviado && !dataForm.fechadenuncia ? <small style={{color: 'red'}}>La fecha de denuncia es obligatoria.</small> : ''}
                {dataForm.fechaincidente ? '' : <small>Recuerde que primero debe setear la fecha del incidente</small>}
            </div>
            <div className='p-sm-6 p-col-12'>
                <label htmlFor='numerosiniestro'>Nro. de siniestro</label>
                <InputText 
                    name='numerosiniestro'
                    value={dataForm.numerosiniestro}
                    disabled={ dataForm.denuncia === 'Denunciado' ? false : true}
                    onChange={(e)=> {
                        setDataForm({
                            ...dataForm,
                            numerosiniestro: e.target.value
                        });
                    }}
                    placeholder='N° de siniestro'
                    type='number'
                />
                {formEnviado && !dataForm.numerosiniestro ? <small style={{color: 'red'}}>El número de siniestro es obligatorio.</small> : ''}
            </div>
        </div>
    )

    const renderThirdLine = (
        <div className='p-grid p-fluid p-mr-1 p-ml-1'>
            <div className='p-sm-4 p-col-12'>
                <label htmlFor='fechaincidente'>Fecha de accidente</label>
                <Calendar 
                    placeholder='Fecha de accidente'
                    name='fechaincidente'
                    dateFormat='dd/mm/yy'
                    locale={localeEs}
                    value={dataForm.fechaincidente}
                    onChange={(e)=>setDataForm({...dataForm, fechaincidente: e.value})}
                />
                {formEnviado && !dataForm.fechaincidente ? <small style={{color: 'red'}}>La fecha del incidente es obligatoria.</small> : ''}
            </div>
            <div className='p-sm-4 p-col-12'>
                <label htmlFor='horaincidente'>Hora del accidente</label>
                <InputText 
                    value={dataForm.horaincidente}
                    onChange={(e) => setDataForm({...dataForm, horaincidente: e.target.value})}
                    placeholder="Hora del accidente"
                    type='time'
                    name='horaincidente'
                />
                {formEnviado && !dataForm.horaincidente ? <small style={{color: 'red'}}>La hora del incidente es obligatoria.</small> : ''}
            </div>
            <div className='p-sm-4 p-col-12'>
                <label htmlFor='lugares'>Seleccione lugar</label>
                <Dropdown 
                    name='lugares'
                    value={dataForm.lugar}
                    options={lugares}
                    disabled={ lugares ? false : true}
                    onChange={(e)=> setDataForm({...dataForm, lugar: e.value})}
                    placeholder='¿En qué lugar se encontraba?'
                />
                {formEnviado && !dataForm.lugar ? <small style={{color: 'red'}}>El lugar es obligatorio.</small> : ''}
            </div>
        </div>
    );
    const renderFourthyLine = (
        <div className='p-grid p-fluid p-mr-1 p-ml-1'>
             <div className='p-sm-4 p-col-12'>
                <label htmlFor='gravedad'>Gravedad del accidente</label>
                <Dropdown 
                    placeholder='Tipo de gravedad'
                    name='gravedad'
                    options={gravedadConfig}
                    value={dataForm.gravedad}
                    onChange={(e)=>{
                        setDataForm({
                            ...dataForm,
                            gravedad: e.value
                        });
                    }}
                />
                {formEnviado && !dataForm.gravedad ? <small style={{color: 'red'}}>La gravedad es obligatoria.</small> : ''}
            </div>
            <div className='p-sm-4 p-col-12'>
                <label htmlFor='horaingreso'>Hora de ingreso</label>
                <InputText 
                    type='time'
                    name='horaingreso'
                    value={dataForm.horaingreso}
                    onChange={(e)=>setDataForm({...dataForm, horaingreso: e.target.value})}
                    placeholder="Hora de ingreso"
                />
                {formEnviado && !dataForm.horaingreso ? <small style={{color: 'red'}}>La hora del ingreso es obligatoria.</small> : ''}
            </div>
            <div className='p-sm-4 p-col-12'>
                        <label htmlFor='sector'>Seleccione sector</label>
                        <Dropdown 
                            name='sector'
                            value={dataForm.sector}
                            options={sectores}
                            disabled={ sectores ? false : true}
                            onChange={(e)=> setDataForm({...dataForm, sector: e.value})}
                            placeholder='¿En qué sector se encontraba?'
                        />
                        {formEnviado && !dataForm.sector ? <small style={{color: 'red'}}>El sector es obligatorio.</small> : ''}
            </div>
        </div>
    )
    //HS tribute (?
    const renderFiveLine = (
        <div className='p-grid p-fluid p-mr-1 p-ml-1'>
            <div className='p-sm-3 p-col-12'>
                <label htmlFor='turno'>Turno</label>
                <InputText 
                    tooltip='Turno del empleado'
                    value={dataForm.turno}
                    onChange={(e)=> setDataForm({...dataForm, turno: e.target.value})}
                    placeholder='Turno del empleado'
                    name='turno'
                />
                {formEnviado && !dataForm.turno ? <small style={{color: 'red'}}>El turno es obligatorio.</small> : ''}
            </div>
            <div className='p-sm-3 p-col-12'>
                <label htmlFor='jefeacargo'>Jefe a cargo</label>
                <InputText 
                    tooltip='Jefe a cargo del empleado'
                    value={dataForm.jefeacargo}
                    onChange={(e)=> setDataForm({...dataForm, jefeacargo: e.target.value})}
                    placeholder='Jefe a cargo'
                    name='jefeacargo'
                />
                {formEnviado && !dataForm.jefeacargo ? <small style={{color: 'red'}}>El jefe a cargo es obligatorio.</small> : ''}
            </div>
            <div className='p-sm-3 p-col-12'>
                <label htmlFor='testigos'>Testigos</label>
                <InputText 
                    tooltip='Testigos del accidente'
                    value={dataForm.testigos}
                    onChange={(e)=> setDataForm({...dataForm, testigos: e.target.value})}
                    placeholder='Testigos'
                    name='testigos'
                />
                {/* {formEnviado && !dataForm.testigos ? <small style={{color: 'red'}}>Los testigos son obligatorios (min 1).</small> : ''} */}
            </div>
            <div className='p-sm-1 p-col-6'>
                <label htmlFor='estabaenpuesto'>¿Era su puesto?</label>
                <Dropdown 
                    value={dataForm.estabaenpuesto}
                    onChange={(e)=> setDataForm({...dataForm, estabaenpuesto: e.value})}
                    options={sinoConfig}
                    name='estabaenpuesto'
                />
            </div>
            <div className='p-sm-2 p-col-6'>
                <label htmlFor='trabajohabitual'>¿Trabajo habitual?</label>
                <Dropdown 
                    value={dataForm.trabajohabitual}
                    onChange={(e)=> setDataForm({...dataForm, trabajohabitual: e.value})}
                    options={sinoConfig}
                    name='trabajohabitual'
                />
                
            </div>
        </div>
    );

    const renderSixtLine = (
        <div className='p-grid p-fluid p-mr-1 p-ml-1'>
            <div className='p-sm-3 p-col-12'>
                <label htmlFor='fechaalta'>Fecha de alta</label>
                <Calendar 
                    locale={localeEs}
                    dateFormat='dd/mm/yy'
                    value={dataForm.fechaalta}
                    onChange={(e)=> onChangeFechaAlta(e)}
                    name='fechaalta'
                />
                {/* {formEnviado && !dataForm.fechaalta ? <small style={{color: 'red'}}>La fecha de alta es obligatoria.</small> : ''} */}
            </div>
            <div className='p-sm-3 p-col-12'>
                <label htmlFor='diasbaja'>Dias de baja</label>
                <InputText 
                    value={dataForm.diasbaja}
                    // disabled={true}
                    onChange={(e)=> e.preventDefault()}
                    // onChange={(e)=> setDataForm({...dataForm, fechaalta: e.value})}
                    name='diasbaja'
                />
            </div>
            <div className='p-sm-3 p-col-12'>
                <label htmlFor='recalificacion'>Recalificacion</label>
                <Dropdown 
                    value={dataForm.recalificacion}
                    options={sinoConfig}
                    onChange={(e)=> setDataForm({...dataForm, recalificacion: e.value})}
                    name='recalificacion'
                />
                {/* {formEnviado && !dataForm.recalificacion ? <small style={{color: 'red'}}>Este dato es obligatorio.</small> : ''} */}
            </div>
            <div className='p-sm-3 p-col-12'>
                {/* <label htmlFor='enviarmail'>¿Enviar mail a responsables de la empresa?</label>
                 <InputSwitch 
                    style={{
                        position: 'absolute',
                        marginTop: '3%',
                        marginLeft: '-10%'
                    }}
                    checked={enviarMail}
                    onChange={(e)=> setEnviarMail(e.value)}
                    name='enviarmail'
                />
                <div style={{
                    marginTop: '4%',
                    textAlign: 'right',
                    marginRight: '40%',
                    fontSize: '1em',
                    fontWeight: '500'
                }}>{ enviarMail ? 'Si' : 'No' }</div> */}
            </div>
        </div>
    );

    const renderSevenLine = (
        <div className='p-grid p-fluid p-mr-1 p-ml-1'>
            <div className='p-sm-5 p-col-12'>
                <label htmlFor='forma'>Forma</label>
                <Dropdown 
                    value={dataForm.forma}
                    options={formas}
                    onChange={(e)=> setDataForm({
                        ...dataForm,
                        forma: e.value
                    })}
                    // onChange={(e)=> setDataForm({...dataForm, fechaalta: e.value})}
                    name='forma'
                />
                {formEnviado && !dataForm.forma ? <small style={{color: 'red'}}>Este dato es requerido.</small> : ''}
            </div>
            <div className='p-sm-5 p-col-12'>
                <label htmlFor='agentematerial'>Agente Material</label>
                <Dropdown 
                    value={dataForm.agentematerial}
                    options={agentesMateriales}
                    onChange={(e)=> setDataForm({
                        ...dataForm,
                        agentematerial: e.value
                    })}
                    name='agentematerial'
                />
                {formEnviado && !dataForm.agentematerial ? <small style={{color: 'red'}}>Este dato es requerido.</small> : ''}
            </div>
        </div>
    );

    const handleChangeNaturaleza = (e,i) => {
        //e=event || i=index of diagnosticos[]
        let diagnosCopy = [...diagnosticos];
        diagnosCopy[i].naturalezalesion = e.target.value;
        setDiagnosticos(diagnosCopy);
    }

    const handleChangeZona = (e,i) => {
        //e=event || i=index of diagnosticos[]
        let diagnosCopy = [...diagnosticos];
        diagnosCopy[i].zonacuerpo = e.target.value;
        setDiagnosticos(diagnosCopy);
    }

    const RenderDiagnostico = ({index}) => {
        return(
            <div>
            <div className='p-grid p-fluid p-mr-1 p-ml-1'>
                <div className='p-sm-6 p-col-12'>
                    <label htmlFor='naturaleza'>Naturaleza de la lesión {index}</label>
                    <Dropdown 
                        name='naturaleza'
                        options={naturalezaLesion}
                        disabled= { naturalezaLesion ? false : true}
                        value={diagnosticos[index].naturalezalesion}
                        onChange={(e)=> handleChangeNaturaleza(e, index)}
                    />
                    {formEnviado && !diagnosticos[index].naturalezalesion ? <small style={{color: 'red'}}>Este dato es obligatorio.</small> : ''}
                </div>
                <div className='p-sm-6 p-col-12'>
                    <label htmlFor='zonacuerpo'>Zona de cuerpo afectada</label>
                    <Dropdown 
                        name='zonacuerpo'
                        options={zonaCuerpo}
                        value={diagnosticos[index].zonacuerpo}
                        onChange={(e) => handleChangeZona(e, index)}
                    />
                    {formEnviado && !diagnosticos[index].zonacuerpo ? <small style={{color: 'red'}}>Este dato es obligatorio.</small> : ''}
                </div>
            </div>
            <div className='p-grid p-fluid'>
                <div className='p-md-6 p-col-12'>
                    
                </div>
                <div className='p-md-4 p-col-12'></div>
                <div className='p-md-2 p-col-12'>
                    <Button 
                        label='Eliminar diagnóstico'
                        icon='pi pi-times'
                        className='p-button-warning'
                        disabled={ index === 0 ? true : false}
                        onClick={(e) => handleDeleteDiagnostico(index)}
                    />
                </div>
            </div>
        </div>
        )
    }

    const renderDiagnostico1 = (
        <div>
            
            <div className='p-grid p-fluid p-mr-1 p-ml-1'>
                <div className='p-sm-6 p-col-12'>
                    <label htmlFor='naturaleza'>Naturaleza de la lesión</label>
                    <Dropdown 
                        name='naturaleza'
                        options={naturalezaLesion}
                        value={dataForm.naturaleza}
                        onChange={(e) => setDataForm({... dataForm, naturaleza: e.value})}
                    />
                    {formEnviado && !dataForm.naturaleza ? <small style={{color: 'red'}}>Este dato es obligatorio.</small> : ''}
                </div>
                <div className='p-sm-6 p-col-12'>
                    <label htmlFor='zonacuerpo'>Zona de cuerpo afectada</label>
                    <Dropdown 
                        name='zonacuerpo'
                        options={zonaCuerpo}
                        value={dataForm.zonacuerpo}
                        onChange={(e) => setDataForm({... dataForm, zonacuerpo: e.value})}
                    />
                    {formEnviado && !dataForm.zonacuerpo ? <small style={{color: 'red'}}>Este dato es obligatorio.</small> : ''}
                </div>
            </div>
        </div>
    );

    const renderIncidenteInfo = (
        <div>
            <div className='p-grid p-fluid p-mr-1 p-ml-1'>
                <div className='p-md-12 p-col-12'>
                    <label htmlFor='titulo'>Título del incidente</label>
                    <InputText 
                        value={dataForm.titulo}
                        name="titulo"
                        onChange={(e)=> setDataForm({...dataForm, titulo: e.target.value})}
                        placeholder='Ingrese un título semidescriptivo al incidente.'
                    />
                    {formEnviado && !dataForm.titulo ? <small style={{color: 'red'}}>El título del incidente es obligatorio.</small> : ''}
                </div>
                <div className='p-md-12 p-col-12'>
                    <label htmlFor='investigacion'>Descripción del incidente</label>
                    <Editor 
                        value={dataForm.investigacion}
                        onTextChange={(e) => setDataForm({...dataForm, investigacion: e.htmlValue})}
                        name='investigacion'
                        style={{
                            height: '15em'
                        }}
                    />
                    {formEnviado && !dataForm.investigacion ? <small style={{color: 'red'}}>Por favor, comente algo acerca de la investigación.</small> : ''}
                </div>
            </div>
        </div>
    );
    const renderAnalisisIncidente = (
        <div>
            <div className='p-grid p-fluid p-mr-1 p-ml-1'>
                <div className='p-col-12'>
                    <label htmlFor='causasinmediatas'>Causas inmediatas</label>
                    <Dropdown 
                        name="causasinmediatas"
                        value={dataForm.causasinmediatas}
                        options={causasInmediatas}
                        onChange={(e)=> setDataForm({...dataForm, causasinmediatas: e.value})}
                        placeholder="Sin elección"
                    />
                    {formEnviado && !dataForm.causasinmediatas ? <small style={{color: 'red'}}>Este dato es obligatorio.</small> : ''}
                </div>
                <div className='p-col-12'>
                    <label htmlFor='causasinmediatas'>Causas inmediatas</label>
                    <InputText 
                        name="descripcioncausainmediata"
                        value={dataForm.descripcioncausainmediata}
                        onChange={(e)=> setDataForm({...dataForm, descripcioncausainmediata: e.target.value})}
                        placeholder="Describe brevemente la causa inmediata realizada."
                    />
                </div>
                <div className='p-col-12'>
                    <label htmlFor='causasbasicas'>Causas basicas</label>
                    <Dropdown 
                        name="causasbasicas"
                        options={causasBasicas}
                        value={dataForm.causasbasicas}
                        onChange={(e)=> setDataForm({...dataForm, causasbasicas: e.value})}
                        placeholder="Sin elección"
                    />
                    {formEnviado && !dataForm.causasbasicas ? <small style={{color: 'red'}}>Este dato es obligatorio.</small> : ''}
                </div>
                <div className='p-col-12'>
                    <label htmlFor='causasgestion'>Causas de gestión</label>
                    <Dropdown 
                        options={causasGestion}
                        name="causasgestion"
                        value={dataForm.causasgestion}
                        onChange={(e)=> setDataForm({...dataForm, causasgestion: e.value})}
                        placeholder="Sin elección"
                    />
                    {formEnviado && !dataForm.causasgestion ? <small style={{color: 'red'}}>Este dato es obligatorio.</small> : ''}
                </div>
                <div className='p-md-12 p-col-12'>
                    <label htmlFor='causasraiz'>Descripción de la causa raíz</label>
                    <Editor 
                        value={dataForm.causasraiz}
                        onTextChange={(e) => setDataForm({...dataForm, causasraiz: e.htmlValue})}
                        name='causasraiz'
                        style={{
                            height: '15em'
                        }}
                    />
                    {formEnviado && !dataForm.causasraiz ? <small style={{color: 'red'}}>Por favor, comente algo acerca de las causas raíz.</small> : ''}
                </div>
            </div>
        </div>
    )

    const renderBlankSpace = (
        <div style={{
            paddingBottom: '5em'
        }}>
        </div>
    )

    return ( 
        <div className='p-mt-4'>
            <Toast 
                ref={myToast}
            />
            <div className='p-text-center'><h4>Incidente de persona</h4></div>
            <ScrollPanel>
            <Fieldset legend='Información de la persona' toggleable>
                {renderFirstLineUser}
                {renderSecondLineUser}
            </Fieldset>

            <div className='p-mt-3 card'>
                <Fieldset legend='General' toggleable>
                    {renderFirstLine}

                    {renderSecondLine}
                </Fieldset>
                <div style={{ marginTop: '0.7em', marginBottom: '0.7em'}}></div>
                <Fieldset legend='Información del accidente' toggleable>
                    {renderThirdLine}
                    {renderFourthyLine}
                    {renderFiveLine}
                    {renderSixtLine}
                </Fieldset>
                <div style={{ marginTop: '0.7em', marginBottom: '0.7em'}}></div>
                <Fieldset toggleable legend='Codificación de datos de siniestro'>
                    {renderSevenLine}
                </Fieldset>

                {/* <hr style={{marginTop: '1.5em'}} className='p-mb-2'/> */}
                <div style={{ marginTop: '0.7em', marginBottom: '0.7em'}} className='p-text-center'>
                    <h5> Diagnósticos </h5>
                </div>
                { diagnosticos.map((d,i)=> {
                    return (<Fieldset key={i} toggleable legend={`Diagnóstico #${i}`}>
                    <RenderDiagnostico index={i} />
                    </Fieldset>)
                })}
                <Button 
                    style={{width: '90%', marginTop: '1%', marginBottom: '1%', marginLeft: '5%', marginRight: '5%'}}
                    label='Agregar diagnostico'
                    icon='pi pi-plus'
                    color='#444'
                    // disabled={true}
                    onClick={(e) => handleNewDiagnostico()}
                />

                <Fieldset toggleable legend="Incidente">
                    {renderIncidenteInfo}
                </Fieldset>
                <div style={{ marginTop: '0.7em', marginBottom: '0.7em'}}></div>
                <Fieldset toggleable legend="Análisis del incidente">
                    {renderAnalisisIncidente}
                </Fieldset>
                    <div className='p-grid p-fluid p-mt-4'>
                        <div className='p-md-4 p-col-1'>
                            
                        </div>
                        <div className='p-md-4 p-col-1'>
                           
                        </div>
                        <div className='p-md-4 p-col-12'>
                            <Button 
                                label='Guardar'
                                icon='pi pi-save'
                                className='p-button-primary'
                                disabled={ submitForm ? true : false}
                                onClick={(e) => {
                                    setFormEnviado(true)
                                    postNewIncidente(e);
                                }}
                            />
                        </div>
                    </div>
                    {renderBlankSpace}
                
            </div>
            </ScrollPanel>
        </div>
     );
}
 
export default CargaIncidente;