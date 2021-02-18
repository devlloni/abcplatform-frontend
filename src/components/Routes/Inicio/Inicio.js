import React, { useContext, useEffect, useState } from 'react';
import clienteAxios from '../../../config/clienteAxios';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import AuthContext from '../../../context/auth/authContext';
import Swal from 'sweetalert2';
import Loader from '../../Layout/Loader';

import { Chart } from 'primereact/chart';

const Inicio = () => {
    //*CONTEXT
    const authContext = useContext(AuthContext);
    const { autenticado, usuario, usuarioAutenticado, cargando } = authContext;

    //*STATE
    const [ logueado, setLogueado ] = useState(false);
    const [ userLogueado, setUserLogueado ] = useState(null)

    const [ generalData, setGeneralData ] = useState(null);

    //To test charts home.
    const [ chartData, setChartData ] = useState({
        labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [300, 50, 100],
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ]
                }]
    });
    const [ secondChart, setSecondChart ] = useState({
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: '#42A5F5',
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: '#FFA726',
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
    })
    const [ thirdChart, setThirdChart ] = useState({
        datasets: [{
            data: [
                11,
                16,
                7,
                3,
                14
            ],
            backgroundColor: [
                "#42A5F5",
                "#66BB6A",
                "#FFA726",
                "#26C6DA",
                "#7E57C2"
            ],
            label: 'My dataset'
        }],
        labels: [
            "Red",
            "Green",
            "Yellow",
            "Grey",
            "Blue"
        ]
    })
    const [ thirdOptions, setThirdOptions ] = useState({
        legend: {
            labels: {
                fontColor: '#495057'
            }
        },
        scale: {
            gridLines: {
                color: '#ebedef'
            }
        }
    })
    const [ secondOptions, setSecondOptions ] = useState({
        
            legend: {
                labels: {
                    fontColor: '#495057'
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        fontColor: '#495057'
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontColor: '#495057'
                    }
                }]
            }
        
    })
    const [ chartOptions, setChartOptions ] = useState({
        legend: {
            labels: {
                fontColor: '#495057'
            }
        }
    })

    useEffect( ()=>{
        usuarioAutenticado();
        if(autenticado && !cargando){
            setLogueado(true);
        }
        else{
            setLogueado(false);
        }
    }, [autenticado])

    // DATA ANALYTICS
    useEffect( ()=> {
        if(!generalData){
            getGeneralData();
        }
    }, [])

    const getGeneralData = async () => {
        const respuesta = await clienteAxios.get('/data/general');
        setGeneralData(respuesta.data);
    }

    const getMessages = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const messageUrl =  urlParams.get('st');
        if(messageUrl && messageUrl === 'unauthorized'){
          return Swal.fire('¡Error!', 'No está autorizado para acceder a la ruta indicada.', 'error');
        }
      }

    const footer = <span>
        <Button label="Save" icon="pi pi-check" style={{marginRight: '.25em'}}/>
        <Button label="Cancel" icon="pi pi-times" className="p-button-secondary"/>
    </span>;
    return ( 
        
        <div className='center' style={styles.containerHome}>
            {getMessages()}
            {logueado && usuario ? 
            (
                <div className='p-mr-5 p-ml-5'>
                    <div className='row'>
                        <div
                            style={{ marginTop: '1%', marginBottom: '2%' }}
                        >
                            <Card className='center'>
                            ¡Bienvenido nuevamente <strong>{usuario.usuario.nombre}</strong> !
                            {usuario.usuario.administrador > 0 ? (
                                <p>Ingresaste como Administrador nivel <strong>{usuario.usuario.administrador}</strong></p>
                            ):
                            null}
                            </Card>
                        </div>
                        <div className='p-fluid p-grid'>
                            <div className='p-col-3'>
                                {generalData ? (
                                    <Card style={{fontSize: '1.5em', backgroundColor: '#009688', color: '#fff'}} header={(<div className='p-pt-2'>Compañias</div>)} 
                                    subTitle={(<div style={{borderRadius: '3%'}} className='white'>
                                        {generalData.companies}
                                    </div>)}/>
                                ):
                                (<div className='center'>
                                    <ProgressSpinner />
                                </div>)
                                }
                            </div>
                            <div className='p-col-3'>
                                {generalData ? (
                                        <Card style={{fontSize: '1.5em', backgroundColor: '#3F51B5', color: '#fff'}} header={(<div className='p-pt-2'>Sucursales</div>)}
                                        subTitle={(<div style={{borderRadius: '3%'}} className='white'>
                                            {generalData.branchoffices}
                                        </div>)}/>
                                    ):
                               ( <div className='center'>
                                    <ProgressSpinner />
                                </div>)
                                }
                            </div>
                            <div className='p-col-3'>
                                {generalData ? (
                                        <Card style={{fontSize: '1.5em', backgroundColor: '#673AB7', color: '#fff'}} header={(<div className='p-pt-2'>Empleados</div>)} 
                                        subTitle={<div style={{borderRadius: '3%'}} className='white'>
                                            {generalData.empleados}
                                        </div>}/>
                                    ):
                               ( <div className='center'>
                                    <ProgressSpinner />
                                </div>)
                                }
                            </div>
                            <div className='p-col-3'>
                                {generalData ? (
                                        <Card style={{fontSize: '1.5em', backgroundColor: '#FF5722', color: '#fff'}} header={(<div className='p-pt-2'>Administradores</div>)}
                                        subTitle={
                                        <div style={{borderRadius: '3%'}} className='white'>
                                            {generalData.administradores}
                                        </div>}/>
                                    ):
                               ( <div className='center'>
                                    <ProgressSpinner />
                                </div>)
                                }
                            </div>
                        </div>
                    </div>
                    <div className='p-grid'>
                        <div className='p-col-4'>
                                <div className='card'>
                                    <p style={{fontSize: '1.5em'}}>Gráfico de inspecciones 2020</p>
                                    <br />
                                    <Chart 
                                        style={{paddingBottom: '2%'}}
                                        type='doughnut'
                                        data={chartData}
                                        options={chartOptions}
                                    />
                                </div>
                        </div>
                        <div className='p-col-4'>
                                <div className='card'>
                                <p style={{fontSize: '1.5em'}}>Gráfico de capacitaciones 2020</p>
                                <br />
                                <Chart 
                                style={{paddingBottom: '2%'}}
                                type="bar" 
                                data={secondChart} 
                                options={secondOptions} />
                                </div> 
                        </div>
                        <div className='p-col-4'>
                                <div className='card'>
                                <p style={{fontSize: '1.5em'}}>Gráfico de empleados 2020</p>
                                <br />
                                <Chart 
                                style={{paddingBottom: '2%'}}
                                type="polarArea" 
                                data={thirdChart} 
                                options={thirdOptions} />
                                </div> 
                        </div>
                    </div>
                </div>
            ) : 
            (
            <Loader />
            )}
            <div className='row'>
                <div className='col-4'>

                </div>
            </div>
        </div>
     );
}

const styles = {
    containerHome: {
        marginTop: '0.8em'
    },
    card: {
        margin: '15px'
    },
    image:{
        width: '45px',
        height: '45px'
    },
    welcomeTitle:{
        fontSize: '2em',
        fontStyle: 'italic'
    },
    spanName: {
        color: ''
    }
}

export default Inicio;