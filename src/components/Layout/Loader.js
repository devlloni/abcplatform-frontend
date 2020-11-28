import React from 'react';
import './Loader.css';

const Loader = () => {
    return (
    <div 
    style={
        {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff'
        }
    }
    >
        <div className="loader-center"></div>
    </div>
    );
}
 
export default Loader;