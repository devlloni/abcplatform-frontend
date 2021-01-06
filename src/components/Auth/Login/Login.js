import React, { useState, useContext, useEffect } from 'react';
import Swal from 'sweetalert2';
import Spinner from '../../Layout/Spinner';
import { InputText } from 'primereact/inputtext';
import { Tooltip } from 'primereact/tooltip';

import './Login.css';
import Wave from '../../../assets/img/wave.png';
import bgImg from '../../../assets/img/bg_on_phone.svg';
import avatarImg from '../../../assets/img/profile_pic.svg';

//!Auth
import AuthContext from '../../../context/auth/authContext';
import tokenAuth from '../../../config/tokenAuth';

const token = localStorage.getItem('token');
if(token){
    tokenAuth(token);
}

const Login = (props) => {
    //Get the context
    const authContext = useContext(AuthContext);
    const { mensaje, autenticado, iniciarSesion, usuarioAutenticado } = authContext;
 
    // Effect de autenticacion
    useEffect( ()=>{
        if(autenticado){
            props.history.push('/');
        }
    }, [ autenticado, props.history] );

    // States & Hooks
    const [ submitLogin, setSubmitLogin ] = useState(false);
    const [ data, setData ] = useState({
        email: '',
        password: ''
    });
    const [ showPass, setShowPass ] = useState(false);
    const [ error, setError ] = React.useState(false);
    const { email, password } = data;

    useEffect( ()=> {
        if(mensaje){
            Swal.fire('Oops..', mensaje, 'error');
            setData({
                ...data,
                password: ''
            })
        }  
    }, [mensaje])

    //HandleLogin
    const handleLogin = e => {
        e.preventDefault();
        //Validaciones
        if(email === '' || !email || password === '' || !password){
            setError(true);
            
            return Swal.fire('Ooops', 'Algo anda mal... Por favor, rellene todos los campos.', 'error');
            
        }else{
            setSubmitLogin(true);
            try {
                setTimeout( ()=>{
                    iniciarSesion({email: email, password: password})
                    setSubmitLogin(false);
                }, 2000);
            } catch (error) {
                setError(true);
                setData({
                    email:'',
                    password:''
                })
            }

            setError(false);
            
            
        }
    }

    //Handle changes on inputs
    const handleChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }
    return ( 
        <div>
            <img 
                className="wave" src={Wave}
            />
            <div className="container-login">
                <div className="img">
                    <img 
                        src={bgImg}
                    />
                </div>
                <div className='login-content'>
                    <form
                        className='form-login'
                        onSubmit={(e)=> handleLogin(e)}
                    >
                        <img 
                            src={avatarImg}
                        />
                        <h2 className='title mb4'> Bienvenido de nuevo </h2>

                        <div className='input-form-dello'>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user"></i>
                                </span>
                                <InputText 
                                    name="email"
                                    type="email"
                                    id="usernameInput"
                                    disabled={submitLogin}
                                    value={email}
                                    onChange={(e)=> handleChange(e)}
                                    style={ {height: '100%'}} 
                                    placeholder="correo@ejemplo.com" 
                                />
                            </div>
                        </div>
                        <div className='input-form-dello'>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon" style={{
                                    backgroundColor: showPass ? '#EA856F' : '#ffffff',
                                    cursor: 'pointer'
                                    }}
                                    onClick={()=> setShowPass(!showPass)}
                                    tooltip={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    <i className="pi pi-lock"></i>
                                </span>
                                <InputText
                                id="passwordInput"
                                name="password"
                                type={showPass ? 'text' : 'password'}
                                disabled={submitLogin}
                                value={password}
                                onChange={(e)=> handleChange(e)}
                                style={ {height: '100%'}} 
                                placeholder="*******" 
                                />
                            </div>
                        </div>
                        <a className='forgot-password' href="!#">Olvidaste tu contraseña?</a>
                        <button className='btnDello' type='submit' disabled={submitLogin}>
                            {submitLogin ? (
                                <Spinner 
                                color="yellow"
                            />
                            ):
                            'Login'
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
 
export default Login;
