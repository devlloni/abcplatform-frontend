import React from 'react';
import { Editor } from 'primereact/editor';

const Inspecciones = () => {

    const [ terminos, setTerminos ] = React.useState('Terminos y condiciones de la capacitación realizada');

    return ( 
        <div className='container' style={styles.container}>
            <div className="row">
                <form className="col s12">
                <div className="row">
                    <div className="input-field col s6">
                    <input id="first_name" type="text" className="validate" />
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
                <div className="row mt-4">
                    <div className="col s12">
                        <Editor 
                            value={terminos}
                            onTextChange={(e)=> setTerminos(e.htmlValue)}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col'></div>
                    <div className='col'>
                        <button className='btn btn-block teal darken-1'> Guardar cambios</button>
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
    },
    
}
 
export default Inspecciones;