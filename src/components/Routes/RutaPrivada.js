import React, {Fragment, useEffect, useContext, Suspense, useState, useRef} from 'react';
import { Route, Redirect } from 'react-router-dom';
import Loader from '../Layout/Loader';
import AuthContext from '../../context/auth/authContext';
import { Toast } from 'primereact/toast';

const RutaPrivada = ({ path, exact = false, component: Component, ...props }) => {
    //Check if the route has adminRequired
    const myToast = useRef(null);
    let isRequired = props.adminRequired ? true : false;
    const authContext = useContext(AuthContext);
    const { autenticado, cargando, usuario, usuarioAutenticado } = authContext;
    
    const [ user, setUser ] = useState(null);
    const [ autorizado, setAutorizado ] = useState(false);
    useEffect( ()=> {
        if(!user || user === null){
            fetchDataUser()
        }
    }, []);

    //Effect for user
    useEffect( ()=> {
        if(!usuario || usuario !== null){
            if(!cargando && autenticado){
                setUser(usuario.usuario);
                
                if(user && isRequired && !cargando){
                    if(user.administrador < props.adminRequired){
                        setAutorizado(false);
                    }
                    else{
                        setAutorizado(false);
                    }
                }
            }
        }
    }, [usuario, cargando, user])

    const showToast = (severityValue, summaryValue, detailValue) => {   
        myToast.current.show({severity: severityValue, summary: summaryValue, detail: detailValue});   
      }

    const fetchDataUser = async () => {
        await usuarioAutenticado();
    }

    const condicionAdmin = () => {
        // if(!autenticado || cargando || props.adminRequired > user.administrador){
        if(autenticado || !cargando && props.adminRequired > user.administrador){
            return true;
        }
        else{
            return false;
        }
    }
    

    return(
        <div>
            <Toast 
              ref={myToast}
            />
            {
                user === null && autenticado ? (<Loader />) : (
                    <Fragment>
                        {
                            isRequired ? 
                            ( 
                                <Suspense>
                                <Route 
                                {... props}
                                showToast={showToast}
                                exact={exact}
                                path={path}
                                render={props=> !condicionAdmin() ?
                                (<Redirect to='/' />)
                                :
                                (<Component {...props} />)
                                } />
                                </Suspense>
                            )
                            :
                            (
                                <Suspense>
                                <Route 
                                {... props}
                                exact={exact}
                                path={path}
                                render={props=> !autenticado && !cargando ?
                                (<Redirect to='/login' />)
                                :
                                ( <Component {...props} /> )
                                } />
                                </Suspense>
                            )
                        }
                    </Fragment>
                )
            }
            </div>
    )

}

export default RutaPrivada;