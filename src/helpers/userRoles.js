

const getRolName = rol => {
    switch(rol){
        case '5fd8d1be65f6bb2b1850b0f2':
            return 'Administrador'
        case '5fd8d1f371ec101d20abd5ef':
            return 'Empleado';
        case '5feb8776222710257cf387f8':
            return 'Encargado';
        default:
            return 'ERROR';
    }
}


export default getRolName