import React from 'react';
import { Helmet } from 'react-helmet';

const UseTitle = ({title}) => {
    return ( 
        <div>
            <Helmet>
                <title>ABC | {title ? title : 'Plataforma H&S'}</title>
            </Helmet>
        </div>
     );
}
 
export default UseTitle;