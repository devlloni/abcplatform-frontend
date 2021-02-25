import React, { useState } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import AccidentesPropiedadHome from './Accidentes_Propiedad/AccidentesPropiedadHome';
import AccidentesPersonaHome from './Accidentes_Persona/VistaAccidentes';

const AccidentesVista = () => {
    const [ items, setItems ] = React.useState([
        // {label: 'Inicio', icon: 'pi pi-fw pi-home', component: 'Home'},
        {label: 'Incidentes Persona', icon: 'fas fa-digital-tachograph', component: 'IncidentesPersona'},
        {label: 'Incidentes Propiedad', icon: 'fas fa-list', component: 'IncidentesPropiedad'},
        {label: 'Incidentes Ambiente', icon: 'fas fa-file-medical-alt', component: 'IncidentesAmbiente'}
    ]);
    const [ activeItem, setActiveItem ] = React.useState(
    
    );
    const ItemActive = item => {
        let comp = item?.item?.component;
        console.log(comp);
        switch(comp){
            case 'IncidentesPropiedad':
                return <AccidentesPropiedadHome />
            case 'IncidentesPersona':
                return <AccidentesPersonaHome />
            default :
                return <AccidentesPersonaHome />
        }
    }
    return ( 
        <div className="datatable-responsive-demo" style={{
            margin: '0.8em'
        }}>
            <TabMenu 
                model={items}
                activeItem={activeItem}
                onTabChange={ (e) => setActiveItem(e.value)}
            />
            <div className="datatable-crud-demo"style={
                {paddingBottom: '50px',marginTop: '0.8em', marginLeft: '0.8em', marginRight: '0.8em'}
            }>
                
                <ItemActive 
                    item={activeItem}
                />

            </div>
        </div>
     );
}
 
export default AccidentesVista;