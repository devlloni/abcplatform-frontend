import React, {useState} from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../../config/clienteAxios'; 
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';

const NewCompanie = () => {

    //*States
    const [ datos, setDatos ] = useState({
        razonSocial: '',
        fantasieName: '',
        cuitCompanie: null,
        addressCompanie: '',
        cityCompanie: '',
        stateCompanie: '',
        ciiuCompanie: '',
        artCompanie: '',
        emailCompanie: '',
        phoneCompanie: ''
    });

    const { razonSocial, fantasieName, cuitCompanie, addressCompanie, cityCompanie,
            stateCompanie,ciiuCompanie, artCompanie, emailCompanie, phoneCompanie 
        } = datos;

    //?FUNCIONES
    const handleSubmit = e => {
        e.preventDefault();
        //*Validación de formulario.
        if( !razonSocial || razonSocial.trim() === ''   ||
            !fantasieName || fantasieName.trim() === '' ||
            !addressCompanie || addressCompanie.trim() === '' ||
            !cityCompanie || cityCompanie.trim() === '' ||
            !stateCompanie || stateCompanie.trim() === '' ||
            !ciiuCompanie || ciiuCompanie.trim() === '' ||
            !artCompanie || artCompanie.trim() === '' ||
            !emailCompanie || emailCompanie.trim() === '' ||
            !phoneCompanie || phoneCompanie.trim() === '' ||
            !cuitCompanie || cuitCompanie.trim() === '')
            {  
                return Swal.fire('¡Error!', 'Complete todos los campos', 'error');
            }
        //* Cargamos la compañía
        const respuesta = clienteAxios.post('/companias', datos);
        console.log(respuesta);
        Swal.fire('¡Genial!', 'Compañía cargada con éxito!', 'success');
        setDatos({
            razonSocial: '',
            fantasieName: '',
            cuitCompanie: null,
            addressCompanie: '',
            cityCompanie: '',
            stateCompanie: '',
            ciiuCompanie: '',
            artCompanie: '',
            emailCompanie: '',
            phoneCompanie: ''
        })
    }
    
    const handleInputChange = e => {
        setDatos({
            ...datos,
            [e.target.id]: e.target.value
        });
    }

    return ( 
        <div style={styles.container}>
            <div className='row container'>
                <form className='col s12'
                    onSubmit={(e)=>handleSubmit(e)}
                >

                    <div className="row">
                        <div className="input-field col s6">
                            <input 
                                id="razonSocial"
                                name="razonSocial"
                                type="text"
                                value={razonSocial}
                                onChange={(e)=>handleInputChange(e)}
                                className="validate" 
                            />
                            <label htmlFor="razonSocial">Razón social</label>
                        </div>
                        <div className="input-field col s6">
                        <span className="p-float-label">
                            <InputText id="fantasieName" 
                                value={fantasieName}
                                type='text'
                                onChange={(e)=> handleInputChange(e)} 
                            />
                            <label htmlFor="fantasieName">Nombre de fantasía</label>
                        </span>
                        </div>
                    </div>

                    <div className="row">
                        <div className="input-field col s6">
                            {/* <input 
                                id="cuitCompanie" 
                                name="cuitCompanie"
                                type="number"
                                value={cuitCompanie}
                                onChange={(e)=>handleInputChange(e)}
                                className="validate" 
                            />*/}
                            <label htmlFor="cuitCompanie">CUIT</label> 
                            <InputMask id="cuitCompanie" mask="999-99-9999" />
                        </div>
                        <div className="input-field col s6">
                            <input 
                                id="addressCompanie" 
                                name="addressCompanie"
                                type="text"
                                value={addressCompanie}
                                onChange={(e)=>handleInputChange(e)}
                                className="validate" 
                            />
                            <label htmlFor="addressCompanie">Domicilio</label>
                        </div>
                    </div>   
            
                    <div className="row">
                        <div className="input-field col s6">
                            <input 
                                id="cityCompanie" 
                                name="cityCompanie"
                                type="text" 
                                value={cityCompanie}
                                onChange={(e)=>handleInputChange(e)}
                                className="validate" 
                            />
                            <label htmlFor="cityCompanie">Localidad</label>
                        </div>
                        <div className="input-field col s6">
                            <input 
                                id="stateCompanie" 
                                name="stateCompanie"
                                type="text" 
                                value={stateCompanie}
                                onChange={(e)=>handleInputChange(e)}
                                className="validate" 
                            />
                            <label htmlFor="stateCompanie">Provincia</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s6">
                            <input 
                                id="ciiuCompanie" 
                                name="ciiuCompanie"
                                type="number" 
                                value={ciiuCompanie}
                                onChange={(e)=>handleInputChange(e)}
                                className="validate" 
                            />
                            <label htmlFor="ciiuCompanie">C.I.I.U</label>
                        </div>
                        <div className="input-field col s6">
                            <input 
                                id="artCompanie" 
                                name="artCompanie"
                                type="number" 
                                value={artCompanie}
                                onChange={(e)=>handleInputChange(e)}
                                className="validate" 
                            />
                            <label htmlFor="artCompanie">A.R.T</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s6">
                            <input 
                                id="emailCompanie" 
                                name="emailCompanie"
                                type="email" 
                                value={emailCompanie}
                                onChange={(e)=>handleInputChange(e)}
                                className="validate" 
                            />
                            <label htmlFor="emailCompanie">Dirección de correo electrónico</label>
                        </div>
                        <div className="input-field col s6">
                            <input 
                                id="phoneCompanie" 
                                name="phoneCompanie"
                                type="number" 
                                value={phoneCompanie}
                                onChange={(e)=>handleInputChange(e)}
                                className="validate" 
                            />
                            <label htmlFor="phoneCompanie">Teléfono de contacto</label>
                        </div>
                    </div>

                    <div className='center'>
                        <button className='btn btn-block green'>
                            Agregar compañía
                        </button>
                    </div>
                </form>
            </div>
        </div>
     );
}
const styles = {
    container: {
        margin: '1em'
    },
    titlePage:{
        fontSize: '2.5em'
    }
};
 
export default NewCompanie;