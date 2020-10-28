import React, {Fragment} from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
//!Styles
import 'primereact/resources/themes/mdc-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
//*Routes
import Inicio from './components/Routes/Inicio/Inicio';
import Inspecciones from './components/Routes/Inspecciones/Inspecciones';
import Capacitaciones from './components/Routes/Capacitaciones/Capacitaciones';
import Vencimientos from './components/Routes/Vencimientos/Vencimientos';
import Calendario from './components/Routes/Calendario/Calendario';
//*Auth
import Login from './components/Auth/Login';

//*Layout components
import Appbar from './components/Layout/Appbar';
import { Card } from 'primereact/card';

function App() {
  return (
    <Fragment>
      <BrowserRouter>
      <Route path='/login' exact component={Login} />
      <Appbar />
        <Switch>
          <Route path='/' exact component={Inicio} />
          <Route path='/inspecciones' exact component={Inspecciones} />
          <Route path='/capacitaciones' exact component={Capacitaciones} />
          <Route path='/vencimientos' exact component={Vencimientos} />
          <Route path='/calendario' exact component={Calendario} />
        </Switch>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
