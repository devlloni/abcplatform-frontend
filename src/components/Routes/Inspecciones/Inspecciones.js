import React from 'react';

const Inspecciones = () => {
    return ( 
        <div className='container' style={styles.container}>
            <div className="row">
                <form className="col s12">
                <div className="row">
                    <div className="input-field col s6">
                    <input placeholder="" id="first_name" type="text" className="validate" />
                    <label htmlFor="first_name">First Name</label>
                    </div>
                    <div className="input-field col s6">
                    <input id="last_name" type="text" className="validate" />
                    <label htmlFor="last_name">Apellido</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12">
                    <input disabled id="disabled" type="text" className="validate" />
                    <label htmlFor="disabled">Disabled</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12">
                    <input id="password" type="password" className="validate" />
                    <label htmlFor="password">Contraseña</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12">
                    <input id="email" type="email" className="validate" />
                    <label htmlFor="email">Email</label>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                    This is an inline input field:
                    <div className="input-field inline">
                        <input id="email_inline" type="email" className="validate" />
                        <label htmlFor="email_inline">Email</label>
                        <span className="helper-text" data-error="wrong" data-success="right">Helper text</span>
                    </div>
                    </div>
                </div>
                </form>
            </div>
        </div>
     );
}

const styles = {
    container:{
        marginTop: '20px'
    }
}
 
export default Inspecciones;