import React from 'react';
import Swal from 'sweetalert2';
import Spinner from '../../Layout/Spinner';
import './Login.css';
import Wave from '../../../assets/img/wave.png';
import bgImg from '../../../assets/img/bg_on_phone.svg';
import avatarImg from '../../../assets/img/profile_pic.svg';
const Login = () => {
    // Initializer();
    const [ submitLogin, setSubmitLogin ] = React.useState(false);
    const [ data, setData ] = React.useState({
        username: '',
        password: ''
    });
    const [ error, setError ] = React.useState(false);
    const { username, password } = data;
    //HandleLogin
    const handleLogin = e => {
        e.preventDefault();
        //Validaciones
        if(username === '' || !username || password === '' || !password){
            setError(true);
            
            return Swal.fire('Ooops', 'Algo anda mal... Por favor, rellene todos los campos.', 'error');
            
        }else{
            setError(false);
            setSubmitLogin(true);
            setTimeout( ()=>{
                setSubmitLogin(false);
                setData({
                    username:'',
                    password:''
                })
            }, 2000);
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
                            <div className='input-field'>
                                <i className="fa fa-user fa-xs prefix"></i>
                                <input 
                                    id="usernameInput" 
                                    name="username"
                                    type="text" 
                                    className="validate" 
                                    disabled={submitLogin}
                                    value={username}
                                    onChange={(e)=> handleChange(e)}
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
                                    disabled={submitLogin}
                                    value={password}
                                    onChange={(e)=> handleChange(e)}
                                />
                                <label htmlFor="passwordInput">Contraseña</label>
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