

const getRolName = rol => {
    switch(rol){
        case '5fd8d1be65f6bb2b1850b0f2':
            return 'Administrador'
        case '5fd8d1f371ec101d20abd5ef':
            return 'Empleado';
        default:
            return 'ERROR';
    }
}


export default getRolName