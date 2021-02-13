import React, {Fragment, useState, useEffect, useContext} from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import Swal from 'sweetalert2';
import ProfilePicture from '../../assets/img/profile_pic.svg';
//*HOOKS
import useWindowSize from '../../hooks/useWindowSize';
import AuthContext from '../../context/auth/authContext';
import CriptoRandomString from 'crypto-random-string';
import { ScrollPanel } from 'primereact/scrollpanel';
const Appbar = (props) => {
  const authContext = useContext(AuthContext);
  const { cerrarSesion, autenticado, usuario, cargando, usuarioAutenticado } = authContext;
  const { width } = useWindowSize();

    //?States
    const [isSearching, setIsSearching] = useState(false);
    const [ dataSearching, setDataSearching ] = useState(null);
    const [ logueado, setLogueado ] = useState(false);
    const [ userLogueado, setUserLogueado ] = useState(null)
    const [isOnAuth, setIsOnAuth] = useState(false);
    const history = useHistory();
    let ruta = history.location.pathname;
    //Effect
    useEffect( ()=>{
        if(autenticado && !cargando && usuario){
          setLogueado(true);
          setUserLogueado(usuario.usuario);
        }
        else{
          setLogueado(false);
        }
      if(ruta.includes('/login') || ruta.includes('/registro'))
      {
        setIsOnAuth(true); 
      }
      else
      {
        setIsOnAuth(false);
      }
    }, [autenticado, cargando, usuario])
    // useEffect(()=>{

    //   if(ruta.includes('/login') || ruta.includes('/registro'))
    //   {
    //     setIsOnAuth(true); 
    //   }
    //   else
    //   {
    //     setIsOnAuth(false);
    //   }
    // },[history, props.history, autenticado])
    let instance;
    document.addEventListener("DOMContentLoaded", function () {
        var elems = document.querySelectorAll(".sidenav");
        instance = M.Sidenav.init(elems, {
          inDuration: 400
        });
        var elemCollapsibles = document.querySelectorAll('.collapsible');
        let instancia = M.Collapsible.init(elemCollapsibles, {});
      });

    const navSearch = (
      <nav style={
        {backgroundColor: '#E5C217'}
      }
      >
          <div className="nav-wrapper">

            <form
              autoComplete="off"
              onSubmit={(e)=> e.preventDefault()}
            >
              <div className="input-field">
                <input
                  onChange={(e)=> onInputChange(e)}
                  onBlur={(e)=> onSearchLeave(e)}
                  id="search" 
                  type="search"
                  autoComplete="off"
                  className="autocomplete"
                  required 
                />
                <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
                <i onClick={(e)=> onCloseSearch(e)} className="material-icons">close</i>
              </div>
            </form>
          </div>
        </nav>
    );
    const navMenu = (
    <div>
      <nav
        style={
          {backgroundColor: '#E5C217'}
        }
      >
        <div className="nav-wrapper">
            <Link to='/' className="brand-logo" style={
              width < 993 ? {cursor: 'default'} : {marginLeft: '2.5em'}
            }>ABC</Link>
            <div className='icon-menu-container'>
              <a href="#" onClick={(e)=>{
                e.preventDefault();
                clickOnHamburguer(e);
              }}
              className='hamburguer-sidenav'
              style={ {position: 'absolute', marginLeft: '1em'} }
              data-target="mobile-demo"><i className="material-icons">menu</i></a>
            </div>
            {/* <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a> */}
            <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li><a onClick={(e)=> clickSearch(e)} href="!#"><i className="material-icons">search</i></a></li>
                <li><a href="!#" onClick={(e)=>handleCerrarSesion(e)}> 
                      <i className='fas fa-sign-out-alt' style={{fontSize: '1em'}}></i> Cerrar sesión</a>
                </li>
            </ul>
        </div>
      </nav>
      </div>
    )

    const clickSearch = e => {
        e.preventDefault();
        setIsSearching(true);
        //Set focus to input
        setTimeout( () => {
          document.getElementById("search").focus();
          autoCompleteInit();
        }, 100);
    }
    const autoCompleteInit = () => {
      var elems = document.querySelectorAll('.autocomplete');
      var instances = M.Autocomplete.init(elems, {
        data: {
          "Calendario": null,
          "Vencimientos": null,
          "Inspecciones": 'https://placehold.it/250x250',
          "Capacitaciones": null,
          "Empleados": null,
          "Companies": null,
          "Sucursales": null
        },
        onAutocomplete: function (texto, otraCosa){
          history.push(`/${texto}`);
          setIsSearching(false);
        }
      })
    }

    const onCloseSearch = e => {
      if(!dataSearching){
        setIsSearching(false);
      }
    }

    const onSearchLeave = e => {
      if(e.target.value < 1){
        setIsSearching(false);
      }
    }

    const onInputChange = e => { 
      e.preventDefault();
      if(e.target.value < 1){
        setDataSearching(null);

      }
      else{
        setDataSearching(e.target.value);
      }
    }

    const clickOnSidenav = e => {
        let instance = M.Sidenav.init(document.querySelectorAll('.sidenav'), {
          outDuration: 400,
          inDuration: 400
        });
        instance[0].close();
    }
    const clickOnHamburguer = e => {
      let instance = M.Sidenav.init(document.querySelectorAll('.sidenav'), {
        outDuration: 400,
        inDuration: 400
      });
      instance[0].open();
    }

    const handleCerrarSesion = e => {
      e.preventDefault();
      // clickOnSidenav();
      // cerrarSesion();
      //!start
      Swal.fire({
        title: 'Cerrar sesión',
        text: '¿Está seguro de cerrar sesión?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, cerrar sesión.',
        cancelButtonText: 'No, me quedaré.'
      }).then((result) => {
        if (result.value) {
          clickOnSidenav();
          cerrarSesion();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          clickOnSidenav();
          return;
        }
      })
      //!end
    }

    const ItemListIncidentes = () => {
      let elements = [ ];
      elements.push(<li key={CriptoRandomString({length: 10, type: 'numeric'})}></li>)
      if(userLogueado){
        if(userLogueado.administrador >= 3){
          elements.push([
            <li key={CriptoRandomString({length: 10, type: 'numeric'})} className='sidenav-li'>
              <Link onClick={(e=> clickOnSidenav(e))} className='item-nav' to='/incidentes/persona'>
                <i className='fas fa-user-injured'></i>
                Incidentes Persona
              </Link>
            </li>
          ]);
          elements.push([
            <li key={CriptoRandomString({length: 10, type: 'numeric'})} className='sidenav-li'>
              <Link onClick={(e)=> clickOnSidenav(e)} className='item-nav' to='/incidentes/propiedad'>
                <i className='fas fa-house-damage'></i>
                Incidentes Propiedad
              </Link>
            </li>
          ]);
          elements.push([
            <li key={CriptoRandomString({length: 10, type: 'numeric'})} className='sidenav-li'>
              <Link onClick={(e)=> clickOnSidenav(e)} className='item-nav' to='/incidentes/ambiente'>
                <i className='fab fa-envira'></i>
                Incidentes Ambiente
              </Link>
            </li>
          ]);
        }
      }
      return( userLogueado ? elements : <li>Cargando...</li> )
    }
    
    const ItemListAdmin = () => {
      let elements = []
      elements.push(<li key={CriptoRandomString({length: 8, type: 'numeric'})}></li>)
      if(userLogueado){
        if(userLogueado.administrador >= 4){
          elements.push ([
            <li key={CriptoRandomString({length: 8, type: 'numeric'})} className='sidenav-li'>
              <Link onClick={(e)=> clickOnSidenav(e)} className='item-nav' to='/empleados'>
                <i className='fas fa-users'></i>
                Empleados
              </Link>
            </li>,
            <li key={CriptoRandomString({length: 8, type: 'numeric'})} className='sidenav-li'>
              <Link onClick={(e)=> clickOnSidenav(e)} className='item-nav' to='/companies'>
                <i className="fas fa-building"></i>
                Compañías
              </Link>
            </li>,
            <li key={CriptoRandomString({length: 8, type: 'numeric'})} className='sidenav-li'>
              <Link onClick={(e)=> clickOnSidenav(e)} className='item-nav' to='/sucursales'>
                <i className="fas fa-store-alt"></i>
                Sucursales
              </Link>
            </li>,
            <li key={CriptoRandomString({length: 8, type: 'numeric'})} className='sidenav-li'>
            <Link onClick={(e)=> clickOnSidenav(e)} className='item-nav' to='/sectorestrabajo'>
              <i className="fas fa-vector-square"></i>
              Sectores de Trabajo
            </Link>
            </li>,
            <li key={CriptoRandomString({length: 8, type: 'numeric'})} className='sidenav-li'>
            <Link onClick={(e)=> clickOnSidenav(e)} className='item-nav' to='/lugarestrabajo'>
              <i className="fas fa-map-pin"></i>
              Lugares de Trabajo
            </Link>
            </li>,
            <li key={CriptoRandomString({length: 8, type: 'numeric'})} className='sidenav-li'>
            <Link onClick={(e)=> clickOnSidenav(e)} className='item-nav' to='/puestostrabajo'>
              <i className="fas fa-briefcase"></i>
              Puestos de Trabajo
            </Link>
            </li>
            ]
          )
        }
        return( userLogueado ? elements : <li>Cargando...</li> )
      }else{
        return (elements)
      }
     
    }

    return ( 
        <div style={
          {display: isOnAuth || !logueado ? 'none' : 'block'}
        }>
        {isSearching ? navSearch : navMenu}
        <ul className="sidenav" id="mobile-demo">
          <div className='sidebar-header'>
            <div className='row'>
              <div className='col header-left'><span>ABC</span> Platform</div>
                <div className='col header-right'>
                    <div className='sidebar-header-picture'>
                      <Link onClick={(e)=> clickOnSidenav(e)} to='/cuenta'>
                        <img 
                          src={ProfilePicture}
                          alt="Foto de perfil"
                        />
                      </Link>
                    </div>
                </div>
              </div>
              <div className='sidebar-header-account'>
                <span>{logueado ? 
                (`${userLogueado.nombre} ${userLogueado.apellido}`)  
                : ('Cargando...')
              }
              
              </span>
              </div>
            </div>
              {/* a */}
              <li className="">
                <ul className="collapsible collapsible-accordion">
                  <li>
                    <hr></hr>
                    <a className="collapsible-header"> <i className='fa fa-user'></i> Mi cuenta <i className="material-icons">arrow_drop_down</i></a>
                    
                    <div className="collapsible-body nav-accordion-body">
                      <ul>
                        <ScrollPanel>
                        <li className='sidenav-li'><Link className='item-nav-dd' to='/cuenta'><i className='fa fa-user'></i> Cuenta</Link></li>
                        <li className='sidenav-li'><Link className='item-nav-dd' to='/cuenta'><i className='fas fa-clipboard-list'></i> Acceso</Link></li>
                        <li className='sidenav-li'><Link className='item-nav-dd' to='/cuenta'><i className='fas fa-cog'></i> Configuracion</Link></li>
                        <li className='sidenav-li'><a className='item-nav-dd' href='!#' onClick={(e)=> handleCerrarSesion(e)} ><i className='fas fa-sign-out-alt'></i> Cerrar sesión</a></li>
                        </ScrollPanel>
                      </ul>
                    </div>
                  </li>
                </ul>
            </li>
            {/* //!asd */}
            <li className="">
              <ul className="collapsible collapsible-accordion">
                <li>
                  <hr></hr>
                  <a className="collapsible-header"> <i className='fas fa-database'></i>Base de datos <i className="material-icons">arrow_drop_down</i></a>
                  
                  <div className="collapsible-body nav-accordion-body">
                    <ul>
                      <ScrollPanel>
                        <ItemListAdmin />
                      </ScrollPanel>
                    </ul>
                  </div>
                </li>
              </ul>
          </li>
          <li className="">
              <ul className="collapsible collapsible-accordion">
                <li>
                  <hr></hr>
                  <a className="collapsible-header"> <i className='fas fa-laptop-medical'></i>Incidentes <i className="material-icons">arrow_drop_down</i></a>
                  
                  <div className="collapsible-body nav-accordion-body">
                    <ul>
                      <ScrollPanel>
                        <ItemListIncidentes />
                      </ScrollPanel>
                    </ul>
                  </div>
                </li>
              </ul>
          </li>
            {/* //!asdf */}
              {/* MENU DE NAVEGACION */}
              <ScrollPanel className='custom-scrollpanel'>
            <li className='sidenav-li'><Link onClick={(e)=> clickOnSidenav(e)} className='item-nav' to='/' > <i className='fas fa-home'></i> Inicio</Link></li>
            {/* <li className='sidenav-li'><Link onClick={(e)=> clickOnSidenav(e)} className='item-nav' to='/incidentes' > <i className='fas fa-laptop-medical'></i> Incidentes </Link></li> */}
            <li className='sidenav-li'><Link onClick={(e)=> clickOnSidenav(e)} className='item-nav' to='/calendario' > <i className='fa fa-calendar-alt'></i> Calendario</Link></li>
            <li className='sidenav-li'><Link onClick={(e)=> clickOnSidenav(e)} className='item-nav' to='/vencimientos'><i className="far fa-clipboard"></i>Vencimientos</Link></li>
            <li className='sidenav-li'><Link onClick={(e)=> clickOnSidenav(e)} className='item-nav' to='/inspecciones'><i className="fas fa-clipboard-list"></i>Inspecciones</Link></li>
            <li className='sidenav-li'><Link onClick={(e)=> clickOnSidenav(e)} className='item-nav' to='/capacitaciones'><i className="fas fa-book-open"></i>Capacitaciones</Link></li>
              </ScrollPanel>
            {/* ITEMS WITH ADMIN CONDITIONS */}
        </ul>
      </div>
     );
}
 
export default Appbar;
