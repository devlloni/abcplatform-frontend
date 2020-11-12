import React from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const Inicio = () => {
    const header = <img alt="Card" src='showcase/demo/images/usercard.png'/>;
    const footer = <span>
        <Button label="Save" icon="pi pi-check" style={{marginRight: '.25em'}}/>
        <Button label="Cancel" icon="pi pi-times" className="p-button-secondary"/>
    </span>;
    return ( 
        <Card style={styles.card} footer={footer} header={header}>
            Content
        </Card>
     );
}

const styles = {
    card: {
        margin: '15px'
    }
}

export default Inicio;