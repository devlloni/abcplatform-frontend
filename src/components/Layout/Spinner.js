import React from 'react';

const Spinner = ({color}) => {
    let bgColor = color || 'green'
    return ( 
        <div className="preloader-wrapper small active p-mt-2">
            <div className={`spinner-layer spinner-${bgColor}-only`}>
                <div className="circle-clipper left">
                    <div className="circle"></div>
                </div><div className="gap-patch">
                    <div className="circle"></div>
                </div><div className="circle-clipper right">
                    <div className="circle"></div>
                </div>
            </div>
        </div> 
);
}
 
export default Spinner;