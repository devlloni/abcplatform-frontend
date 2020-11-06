import React from 'react';
import Swal from 'sweetalert2';
import Spinner from '../../Layout/Spinner';
import '../Login/Login.css';
import Wave from '../../../assets/img/wave.png';
import bgImg from '../../../assets/img/bg_on_phone.svg';
import avatarImg from '../../../assets/img/profile_pic.svg';
const Register = () => {
    
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
                        onSubmit={(e)=> e.preventDefault()}
                    >
                        <img 
                            src={avatarImg}
                        />
                        <h2 className='title mb4'> Registro </h2>

                        <div className='input-form-dello'>
                            <div className='input-field'>
                                <i className="fa fa-user fa-xs prefix"></i>
                                <input 
                                    id="usernameInput" 
                                    name="username"
                                    type="text" 
                                    className="validate" 
                                />
                                <label htmlFor="usernameInput">Nombre de usuario</label>
                            </div>
                        </div>
                        <div className='input-form-dello'>
                            <div className='input-field'>
                                <i className="fa fa-lock fa-xs prefix"></i>
                                <input 
                                    id="passwordInput" 
                                    name="password"
                                    type="password"
                                    className='validate'
                                />
                                <label htmlFor="passwordInput">Contraseña</label>
                            </div>
                        </div>
                        <a className='forgot-password' href="!#">Olvidaste tu contraseña?</a>
                        <button className='btnDello' type='submit'>
                            Registrarse
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
 
export default Register;