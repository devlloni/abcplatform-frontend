import React from 'react';
import { Toast } from 'primereact/toast';
import { TabMenu } from 'primereact/tabmenu';
import OldHome from './oldHome';
import Inicio from './CargaIncidente';
import AgentesMateriales from './Configuraciones/AgentesMateriales';
import CausasBasicas from './Configuraciones/CausasBasicas';
import CausasGestion from './Configuraciones/CausasGestion';
import CausasInmediatas from './Configuraciones/CausasInmediatas';
import Formas from './Configuraciones/Formas';
import NaturalezaLesion from './Configuraciones/NaturalezaLesion';
import ZonasAfectadas from './Configuraciones/ZonasAfectadas';

const AccidentesPersona = () => {

    const [ items, setItems ] = React.useState([
        // {label: 'Inicio', icon: 'pi pi-fw pi-home', component: 'Home'},
        {label: 'Formas', icon: 'fas fa-digital-tachograph', component: 'Formas'},
        {label: 'Agentes Materiales', icon: 'fas fa-list', component: 'AgentesMateriales'},
        {label: 'Nat. Lesión', icon: 'fas fa-file-medical-alt', component: 'NaturalezaLesion'},
        {label: 'Zona Accidente', icon: 'fas fa-file-medical', component: 'ZonasAfectadas'},
        {label: 'Causas Inmediatas', icon: 'fas fa-clipboard-list', component: 'CausasInmediatas'},
        {label: 'Causas Basicas', icon: 'fas fa-list-ol', component: 'CausasBasicas'},
        {label: 'Causas Gestión', icon: 'fas fa-th-list', component: 'CausasGestion'},
    ]);
    const [ activeItem, setActiveItem ] = React.useState(
    
    );

    const myRef = React.useRef(null);
    const showToast = (severityValue, summaryValue, detailValue) => {   
        myRef.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
    }
    const ItemActive = (item) => {
        let comp = item?.item?.component;
        console.log(comp);
        switch(comp){
            case 'AgentesMateriales':
                return <AgentesMateriales showToast={showToast} />
            case 'CausasBasicas':
                return <CausasBasicas showToast={showToast} />
            case 'CausasGestion': 
                return <CausasGestion showToast={showToast} />
            case 'CausasInmediatas':
                return <CausasInmediatas showToast={showToast} />
            case 'Formas':
                return <Formas showToast={showToast} />
            case 'NaturalezaLesion':
                return <NaturalezaLesion showToast={showToast} />
            case 'ZonasAfectadas':
                return <ZonasAfectadas showToast={showToast} />
            default:
                // return <OldHome showToast={showToast} setActiveItem={setActiveItem} />
                return <Formas showToast={showToast} setActiveItem={setActiveItem} />
        }
    }

    return ( 
        <div>
            <Toast ref={myRef} />
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
        </div>
     );
}
 
export default AccidentesPersona;