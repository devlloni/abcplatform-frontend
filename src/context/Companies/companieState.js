import React, {useReducer} from 'react';
import CompanieContext from './companieContext';
import CompanieReducer from './companieReducer';
import clienteAxios from '../../config/clienteAxios';

    //Importamos los types.
    import { 
        SUCCESFUL_GET_COMPANIES,
        ERROR_GET_COMPANIES
    } from './companieTypes';

const CompanieState = props => {

    const initialState = {
        currentCompanie: null,
        companies: null,
        msg: null,
        loadingCompanies: true,
        loadingCurrent: true,
    }

    const [ state, dispatch ] = useReducer(CompanieReducer, initialState);

    //Retornar el usuario autenticado.

    const getCompanies = async () => {
        const resp = await clienteAxios.get('/companias');
        console.log(resp.data);
        if(resp.status === 200){
            dispatch({
                type: SUCCESFUL_GET_COMPANIES,
                payload: resp.data
            });
        }else{
            dispatch({
                type: ERROR_GET_COMPANIES
            });
        }
    }

    //* Provider
    return (
        <CompanieContext.Provider
            value={{
                currentCompanie: state.currentCompanie,
                companies: state.companie,
                msg: state.msg,
                loadingCompanies: state.loadingCompanies,
                loadingCurrent: state.loadingCurrent,
                getCompanies
            }}
        >
            {props.children}
        </CompanieContext.Provider>
    )
}

export default CompanieState;
