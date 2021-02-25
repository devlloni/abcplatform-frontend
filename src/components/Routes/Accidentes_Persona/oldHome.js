import React from 'react';
import styled from 'styled-components';

const OldHome = ({setActiveItem}) => {
    const colors = ['#F44336', '#E91E63', '#9C27B0', '#3F51B5', '#00BCD4', '#009688', '#FF5722', '#8BC34A', '#607D8B', '#E91E63'];
    
    const randomUIColor = () => {
        const colors = ['#F44336', '#E91E63', '#9C27B0', '#3F51B5', '#00BCD4', '#009688', '#FF5722', '#8BC34A', '#607D8B', '#E91E63'];
        let sale = (Math.random() * 10);
        console.log(colors[sale]);
        return colors[sale];
    }

    const ContainerGeneral = styled.div`
        margin-top: 1.3em
    `;
    const Card = styled.div`
    cursor: pointer;
    background-color: white;
    transition: background-color .5s ease-out;

    &:hover{
        background-color: ${colors[1]}};
        transition: background-color .5s ease-in;
    }
    `;
    const CardB = styled.div`
    cursor: pointer;
    background-color: white;
    transition: background-color .5s ease-out;

    &:hover{
        background-color: ${colors[2]}};
        transition: background-color .5s ease-in;
    }
    `;
    const CardC = styled.div`
    cursor: pointer;
    background-color: white;
    transition: background-color .5s ease-out;

    &:hover{
        background-color: ${colors[3]}};
        transition: background-color .5s ease-in;
    }
    `;
    const CardD = styled.div`
    cursor: pointer;
    background-color: white;
    transition: background-color .5s ease-out;

    &:hover{
        background-color: ${colors[4]}};
        transition: background-color .5s ease-in;
    }
    `;
    const CardE = styled.div`
    cursor: pointer;
    background-color: white;
    transition: background-color .5s ease-out;

    &:hover{
        background-color: ${colors[5]}};
        transition: background-color .5s ease-in;
    }
    `;
    const CardF = styled.div`
    cursor: pointer;
    background-color: white;
    transition: background-color .5s ease-out;

    &:hover{
        background-color: ${colors[6]}};
        transition: background-color .5s ease-in;
    }
    `;

    const CardG = styled.div`
    cursor: pointer;
    background-color: white;
    transition: background-color .5s ease-out;

    &:hover{
        background-color: ${colors[7]}};
        transition: background-color .5s ease-in;
    }
    `;

    return ( 
    <React.Fragment>
        <ContainerGeneral className='p-grid p-fluid'>
            <div className='p-sm-3 p-col-6'>
                <Card className='p-card' onClick={()=>setActiveItem( {label: 'Agentes Materiales', icon: 'fas fa-list', component: 'AgentesMateriales'})}>
                    <div className='p-card-title p-text-center'>
                        Agentes materiales
                    </div>
                    <div className='p-card-body'>
                        <div className='p-text-center'>
                            <i style={{fontSize: '4em'}} className='fab fa-medium-m'></i>
                        </div>
                    </div>
                </Card>
            </div>
            <div className='p-sm-3 p-col-6'>
                <CardB className='p-card' onClick={()=>setActiveItem( {label: 'Causas Basicas', icon: 'fas fa-list-ol', component: 'CausasBasicas'} )}>
                    <div className='p-card-title p-text-center'>
                        Causas Basicas
                    </div>
                    <div className='p-card-body'>
                        <div className='p-text-center'>
                            <i style= {{fontSize: '4em'}} className='fas fa-bold'></i>
                        </div>
                    </div>
                </CardB>
            </div>
            <div className='p-sm-3 p-col-6'>
                <CardC className='p-card' onClick={()=> setActiveItem({label: 'Causas Gestión', icon: 'fas fa-th-list', component: 'CausasGestion'})}>
                    <div className='p-card-title p-text-center'>
                        Causas Gestión
                    </div>
                    <div className='p-card-body'>
                        <div className='p-text-center'>
                            <i style={{fontSize: '4em'}} className='fab fa-cuttlefish'></i>
                        </div>
                    </div>
                </CardC>
            </div>
            <div className='p-sm-3 p-col-6'>
                <CardD className='p-card' onClick={()=> setActiveItem( {label: 'Causas Inmediatas', icon: 'fas fa-clipboard-list', component: 'CausasInmediatas'} )}>
                    <div className='p-card-title p-text-center'>
                        Causas Inmediatas
                    </div>
                    <div className='p-card-body'>
                        <div className='p-text-center'>
                            <i style={{fontSize: '4em'}} className='fas fa-leaf'></i>
                        </div>
                    </div>
                </CardD>
            </div>
        </ContainerGeneral>
        <ContainerGeneral className='p-grid p-fluid'>

        <div className='p-sm-4 p-col-6'>
            <CardE className='p-card' onClick={()=> setActiveItem( {label: 'Formas', icon: 'fas fa-digital-tachograph', component: 'Formas'} )}>
                <div className='p-card-title p-text-center'>
                    Formas
                </div>
                <div className='p-card-body'>
                    <div className='p-text-center'>
                        <i style={{fontSize: '4em'}} className='fab fa-foursquare'></i>
                    </div>
                </div>
            </CardE>
        </div>
        <div className='p-sm-4 p-col-6'>
            <CardF className='p-card' onClick={()=> setActiveItem( {label: 'Nat. Lesión', icon: 'fas fa-file-medical-alt', component: 'NaturalezaLesion'} )}>
                <div className='p-card-title p-text-center'>
                    Naturaleza de Lesión
                </div>
                <div className='p-card-body'>
                    <div className='p-text-center'>
                        <i style={{fontSize: '4em'}} className='fab fa-neos'></i>
                    </div>
                </div>
            </CardF>
        </div>
        <div className='p-sm-4 p-col-6'>
            <CardG className='p-card' onClick={()=> setActiveItem( {label: 'Zonas Afectadas', icon: 'fas fa-file-medical', component: 'ZonasAfectadas'} )}>
                <div className='p-card-title p-text-center'>
                    Zonas Afectadas
                </div>
                <div className='p-card-body'>
                    <div className='p-text-center'>
                        <i style={{fontSize: '4em'}} className='fab fa-neos'></i>
                    </div>
                </div>
            </CardG>
        </div>
        </ContainerGeneral>
    </React.Fragment> 
    );
}
 
export default OldHome;