import React, {useState} from 'react';
import { FullCalendar, FullCalendarProps } from 'primereact/fullcalendar';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import { ColorPicker } from 'primereact/colorpicker';
import { INITIAL_EVENTS, createEventId } from '../../../assets/utils/event-utils';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Badge } from 'primereact/badge'
import { Tag } from 'primereact/tag';

let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
const Calendario = () => {
    const [ showDialog, setShowDialog ] = useState(false);
    const [ addDate, setAddDate ] = useState('');
    const [ addTitle, setAddTitle ] = useState('');
    const [ addTime, setAddTime ] = useState('');
    const [ addColor, setAddColor ] = useState('333');
    const [ colorString, setColorString ] = useState('#333');
    const [ makingEvent, setMakingEvent ] = useState(false);
    const [ eventAllDay, setEventAllDay ] = useState(false);
    const [ events, setEvents ] = useState([
          {
            id: createEventId(),
            title: 'All-day event',
            start: todayStr,
            color: `#${addColor}`
          },
          {
            id: createEventId(),
            title: 'Timed event',
            start: todayStr + 'T12:00:00',
            color: `purple`
          }, //Formato: Año - Mes - Dia,
          {

          }
    ]);
    const [ options, setOptions ] = useState({
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        locale: esLocale,
        headerToolbar: {
            left: 'prev,next,today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        editable: true,
        selectable: true,
        dateClick: (e) =>{
            handleDateClick(e);
        }
    })

    const handleDateClick = (e) => {
        setAddDate(
            e.dateStr
        )
        setShowDialog(true);
    }
    const footerDialog = (
        <div>
            <Button label="Aceptar" icon="pi pi-check" onClick={()=> handleNewEvent()} />
            <Button label="Salir" icon="pi pi-times"  onClick={()=>setShowDialog(false)}/>
        </div>
    )
    const handleNewEvent = () => {
        if(!addTitle || addTitle.length < 1){
            return alert('Por favor, ingrese un título');
        }
        else{
            if(eventAllDay){
                setEvents([
                    ...events,
                    {
                        id: createEventId(),
                        title: addTitle,
                        start: addDate,
                        color: `#${addColor}`
                    }
                ]);
            }
            else{
                setEvents([
                    ...events,
                    {
                        id: createEventId(),
                        title: addTitle,
                        start: addDate + `T${addTime}:00:00`,
                        color: `#${addColor}`
                    }
                ])
            }
            //Returning with blank states
            setAddDate(null);
            setAddTitle(null);
            setAddTime(null);
            setShowDialog(false);
        }
    }

    const handleEventClick = (clickInfo) => {
        alert('a');
    }
    const handleTitleChange = e => {
            setAddTitle(e.target.value);
    }
    const handleTimeChange = e => {
        setAddTime(e.target.value)
    }
    const handleChangeColor = e => {
        setAddColor(e.value);
        setColorString(`#${e.value}`)
    }

    const handleInputChangeColor = e => {
        let string = e.target.value;
        if(string.length === 4 || string.length === 7){
            setColorString(string);
            let st = string.substring(1);
            console.log(st)
            setAddColor(st);
        }
        else{
            setColorString(string);
            
        }
    }

    return ( 
    <div className='container' style={styles.container}>
        <FullCalendar 
        events={events} 
        options={
            options
        }
        
        
        weekends={true}
        dateClick={(e)=>alert(e.dateStr)} 
        />
        <Dialog header={`Agregar un evento (${addDate})`} visible={showDialog} 
            style={{ width: '75vw' }} 
            footer={footerDialog} 
            onHide={() => setShowDialog(false)}
        >

            <div className='p-grid p-fluid'>
                <div className='p-col-12 p-sm-12' style={{marginBottom:'1em'}}>
                    {/* <h6>Título</h6> */}
                    
                    <label htmlFor="in">Título</label>
                    <InputText 
                        name='titulo'
                        style={{height: '80%', fontSize: '1.3em'}}
                        className=''
                        placeholder='Título de la tarea'
                        value={addTitle}
                        autoComplete={'off'}
                        onChange={(e)=>{handleTitleChange(e)}}
                    />
                    
                </div>
            </div>
            <div className='p-grid p-fluid'>
                <div className='p-col-6 p-sm-6' style={{marginBottom:'1em'}}>
                        <h6>¿Dura todo el día?</h6>
                    </div>
                    <div className='p-col-6 p-sm-6'>
                        <InputSwitch 
                            checked={eventAllDay} 
                            onChange={(e)=>setEventAllDay(e.value)}
                            tooltip={ eventAllDay ? 'Si' : 'No' }
                        />
                </div>
            </div>
            <hr />
            <div className='p-grid p-fluid'>
                <div className='p-col-12 p-sm-6' style={{marginBottom:'1em'}}>
                        <label htmlFor='descripcion'>Agregar descripción</label>
                        <InputTextarea
                            placeholder='Agregar descripción del evento'
                            style={{height: '93%'}}
                            name='descripcion'
                        />
                    </div>
                    <div className='p-col-12 p-sm-6 p-text-center'>
                    <div className='p-grid p-fluid'>
                        <div className='p-col-12 p-md-6'>
                            <ColorPicker
                                style={{marginTop: '1em'}}
                                value={addColor}
                                onChange={(e)=> handleChangeColor(e)}
                                defaultColor={addColor}
                                inline
                            ></ColorPicker>
                        </div>
                        <div className='p-col-12 p-md-6'>
                            <div className='p-mt-3'>
                                <Tag value='Texto de ejemplo'
                                    style={{backgroundColor: `#${addColor}`}}
                                />
                            </div>
                            <br />
                            <label htmlFor='htmlColor'>Código HTMl del color</label>
                            <InputText 
                                name='htmlColor'
                                value={colorString}
                                style={{paddingLeft: '0.2em'}}
                                onChange={(e)=> handleInputChangeColor(e)}
                            />
                        </div>
                    </div>
                </div>
            </div>



        </Dialog>
        
    </div>
    );
}

const OldDialog = (
    // <Dialog header={`Agregar un evento (${addDate})`} visible={showDialog} style={{ width: '50vw' }} footer={footerDialog} onHide={() => setShowDialog(false)}>
    //         <h5>Agregar evento</h5>
    //         <div className='row'>
    //             <form
    //                 onSubmit={(e)=>e.preventDefault()}
    //             >
    //                 <div className='input-field'>
    //                     <input id='inputTitle' disabled={makingEvent} 
    //                     value={addTitle}
    //                     className='col-12 validate' 
    //                     placeholder='Título del evento'
    //                     onChange={(e)=>handleTitleChange(e)}
    //                     />
    //                     {/* <label htmlFor='inputTitle'>Título del evento</label> */}
    //                 </div>
    //                 <div className='input-field'>
    //                     <div className='col-6'>
    //                         <p>¿Dura todo el día?</p>
    //                         <InputSwitch 
    //                         checked={eventAllDay} 
    //                         onChange={(e)=>setEventAllDay(e.value)}
    //                         tooltip={ eventAllDay ? 'Si' : 'No' }
    //                         />
    //                     </div>
    //                     <div className='col-6'>
    //                         <input type='number' 
    //                         value={addTime}
    //                         onChange={(e)=>handleTimeChange(e)}
    //                         className='validate' 
    //                         disabled={eventAllDay} 
    //                         placeholder={'Horario del evento'} />
    //                     </div>
    //                 </div>
    //                 <div className='row'>
    //                     <div className='card col-6'>
    //                     <ColorPicker
    //                         value={addColor}
    //                         onChange={(e)=> handleChangeColor(e)}
    //                         defaultColor={addColor}
    //                         tooltip={'Color para el evento'}
    //                         inline
    //                     ></ColorPicker>
    //                     </div>
    //                     <div className='card col-6' style={
    //                         {backgroundColor: `#${addColor}`}
    //                     }>
    //                         <div className='center'>{addTitle ? (addTitle) : 'Texto de ejemplo'}</div>
    //                     </div>
    //                 </div>
    //             </form>
    //         </div>
    //     </Dialog>
    <div></div>
)

const styles = {
    container:{
        marginTop: '15px'
    }
}
 
export default Calendario;