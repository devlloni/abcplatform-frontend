import React, {Fragment} from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
//!Styles
import './assets/css/materialize.css';
import 'primereact/resources/themes/mdc-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './assets/css/general.css';
//*Routes
import Inicio from './components/Routes/Inicio/Inicio';
import Inspecciones from './components/Routes/Inspecciones/Inspecciones';
import Capacitaciones from './components/Routes/Capacitaciones/Capacitaciones';
import Vencimientos from './components/Routes/Vencimientos/Vencimientos';
import Calendario from './components/Routes/Calendario/Calendario';
  //Administrator section
    //Compañías
// import Companies from './components/Routes/Companies/Companies';
import Companie from './components/Routes/Companies/Companie';
import NewCompanie from './components/Routes/Companies/NewCompanie';
//*Empleados
import Empleados from './components/Routes/Empleados/Empleados';
//*Auth
import RutaPrivada from './components/Routes/RutaPrivada';
import NotFound from './components/Routes/NotFound';
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';
//*Layout components
import Appbar from './components/Layout/Appbar';
//* Context & States
import AuthState from './context/auth/authState';

function App() {

  return (
    <Fragment>
      <AuthState>
        <BrowserRouter>
        <Route path='/login' exact component={Login} />
        <Route path='/registro' exact component={Register} />
        <Appbar />
          <Switch>
            <RutaPrivada exact path='/' component={Inicio} />
            {/* <Route path='/' exact component={Inicio} /> */}
            <RutaPrivada path='/inspecciones' exact component={Inspecciones} />
            <RutaPrivada path='/capacitaciones' exact component={Capacitaciones} />
            <RutaPrivada path='/vencimientos' exact component={Vencimientos} />
            <RutaPrivada path='/calendario' exact component={Calendario} />
            <RutaPrivada path='/companies' exact component={Companie} adminRequired={4} />
            <RutaPrivada path='/empleados' exact component={Empleados} adminRequired={4}/>
            <RutaPrivada component={NotFound} />
            {/* <RutaPrivadaAdmin path='/companies' exact adminRequired={4}  component={Companies} /> */}
          </Switch>
        </BrowserRouter>
      </AuthState>
    </Fragment>
  );
}

export default App;
