import React from 'react';
import { Route, RouteProps, useHistory } from 'react-router-dom';
import authContext from '../../context/auth/authContext';

const RutasPrivadas = (props) => {
    let token = null;
    const { usuario, autenticado, cargando, usuarioAutenticado } = React.useContext(authContext);
    const [ user, setUser ] = React.useState(null);
    let history = useHistory();
    const fetchDataUser = async () => {
        await usuarioAutenticado();
    }

    React.useEffect( ()=>{
        token = localStorage.getItem('token');
        if(token !== null){
            if( (!user || user === null) && token !== null){
                fetchDataUser();
            }
            if((!autenticado) && !cargando){
                history.push('/login');
            }else{
                setUser(usuario);
                return <Route {...props} />
            }
        }else{
            history.push('/login')
        }
    }, [props?.location?.pathname] )
}
 
export default RutasPrivadas;