import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import AuthContext from '../../../context/auth/authContext';
import Swal from 'sweetalert2';
import ProfilePic from '../../../assets/img/profile_pic.svg';

const Inicio = () => {
    //*CONTEXT
    const authContext = useContext(AuthContext);
    const { autenticado, usuario, usuarioAutenticado, cargando } = authContext;

    //*STATE
    const [ logueado, setLogueado ] = useState(false);
    const [ userLogueado, setUserLogueado ] = useState(null)

    useEffect( ()=>{
        usuarioAutenticado();
        if(autenticado && !cargando){
            setLogueado(true);
        }
        else{
            setLogueado(false);
        }
    }, [autenticado])

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
            {logueado ? (
                <p style={styles.welcomeTitle}>Bienvenido nuevamente <span style={styles.spanName}>{usuario.usuario.nombre} {usuario.usuario.apellido}</span></p>
            ) : (<h3>Cargando...</h3>)}
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