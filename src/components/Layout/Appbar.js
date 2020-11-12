import React, {Fragment, useState, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import ProfilePicture from '../../assets/img/profile_pic.svg';

const Appbar = () => {
    const history = useHistory();
    let ruta = history.location.pathname;
    //Effect
    useEffect( ()=>{
        if(ruta.includes('/login') || ruta.includes('/registro')){
          setShowBar('none');
        }
    }, [history])
    let instance;
    document.addEventListener("DOMContentLoaded", function () {
        var elems = document.querySelectorAll(".sidenav");
        instance = M.Sidenav.init(elems, {
          inDuration: 400
        });
        var elemCollapsibles = document.querySelectorAll('.collapsible');
        let instancia = M.Collapsible.init(elemCollapsibles, {});
      });
    
    const [ searching, setSearching ] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [ dataSearching, setDataSearching ] = useState(null);
    const [ showBar, setShowBar ] = useState('block');

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
              {marginLeft: '2em',
              cursor: 'default'}
            }>ABC</Link>

            <a href="#" onClick={(e)=>{
              e.preventDefault();
              clickOnHamburguer(e);
            }}
            className='hamburguer-sidenav'
            style={ {position: 'absolute', marginLeft: '1em'} }
            data-target="mobile-demo"><i className="material-icons">menu</i></a>
            {/* <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a> */}
            <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><Link to='/calendario' >Calendario</Link></li>
                    <li><Link to='/vencimientos'>Vencimientos</Link></li>
                    <li><Link to='/inspecciones'>Inspecciones</Link></li>
                    <li><Link to='/capacitaciones'>Capacitaciones</Link></li>
                <li><a onClick={(e)=> clickSearch(e)} href="!#"><i className="material-icons">search</i></a></li>
            </ul>
        </div>
      </nav>
      </div>
    )

    const clickSearch = e => {
        e.preventDefault();
        setIsSearching(true);
        setSearching(true);
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
          "Capacitaciones": null
        },
        onAutocomplete: function (texto, otraCosa){
          history.push(`/${texto}`);
          setSearching(false);
          setIsSearching(false);
        }
      })
    }

    const onCloseSearch = e => {
      if(!dataSearching){
        setIsSearching(false);
        setSearching(false);
      }
    }

    const onSearchLeave = e => {
      if(e.target.value < 1){
        setIsSearching(false);
        setSearching(false);
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
    const collapsibleHandler = e => {
      e.preventDefault();
      var elemCollapsibles = document.querySelectorAll('.collapsible');
      let instancia = M.Collapsible.getInstance(elemCollapsibles[0]);
      if(e.target.parentElement.classList.contains('active')){
        console.log('está abierta');
        e.target.parentElement.parentElement.style.position = 'relative';
      }else{
        console.log('está cerrado');
        
      }
    }

    return ( 
        <div style={
          {display: showBar}
        }>
        {isSearching ? navSearch : navMenu}
        <ul className="sidenav" id="mobile-demo">
          <div className='sidebar-header'>
            <div className='row'>
              <div className='col header-left'><span>ABC</span> Platform</div>
                <div className='col header-right'>
                    <div className='sidebar-header-picture'>
                      <img 
                        src={ProfilePicture}
                        alt="Foto de perfil"
                      />
                    </div>
                </div>
              </div>
              <div className='sidebar-header-account'>
                <span>Lautaro Delloni</span>
              </div>
            </div>
              {/* a */}
              <li className="">
                <ul className="collapsible collapsible-accordion">
                  <li>
                    <a className="collapsible-header">Mi cuenta <i className="material-icons">arrow_drop_down</i></a>
                    <div className="collapsible-body nav-accordion-body">
                      <ul>
                        <li className='sidenav-li'><Link className='item-nav-dd' to='/cuenta'><i className='fa fa-user'></i> Cuenta</Link></li>
                        <li className='sidenav-li'><Link className='item-nav-dd' to='/cuenta'><i className='fas fa-clipboard-list'></i> Acceso</Link></li>
                        <li className='sidenav-li'><Link className='item-nav-dd' to='/cuenta'><i className='fas fa-cog'></i> Configuracion</Link></li>
                        <li className='sidenav-li'><Link className='item-nav-dd' to='/cuenta'><i className='fas fa-sign-out-alt'></i> Cerrar sesión</Link></li>
                      </ul>
                    </div>
                  </li>
                </ul>
            </li>
              {/* afin */}
            <li className='sidenav-li'><Link onClick={(e)=> clickOnSidenav(e)} className='item-nav' to='/calendario' > <i className='fa fa-calendar-alt'></i> Calendario</Link></li>
            <li className='sidenav-li'><Link onClick={(e)=> clickOnSidenav(e)} className='item-nav' to='/vencimientos'><i className="far fa-clipboard"></i>Vencimientos</Link></li>
            <li className='sidenav-li'><Link onClick={(e)=> clickOnSidenav(e)} className='item-nav' to='/inspecciones'><i className="fas fa-clipboard-list"></i>Inspecciones</Link></li>
            <li className='sidenav-li'><Link onClick={(e)=> clickOnSidenav(e)} className='item-nav' to='/capacitaciones'><i className="fas fa-book-open"></i>Capacitaciones</Link></li>
        </ul>
      </div>
     );
}
 
export default Appbar;
