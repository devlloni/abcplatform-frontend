import React, {Fragment, useState, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';

const Appbar = () => {
    const history = useHistory();
    //Effect
    useEffect( ()=>{
        if(history.location.pathname.includes('/login')){
          setShowBar('none');
        }
    }, [history])
    document.addEventListener("DOMContentLoaded", function () {
        var options = {};
        var elems = document.querySelectorAll(".sidenav");
        M.Sidenav.init(elems, options);
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
      <nav
        style={
          {backgroundColor: '#E5C217'}
        }
      >
        <div className="nav-wrapper">
            <Link to='/' className="brand-logo" style={
              {marginLeft: '1em'}
            }>ABC</Link>
            <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><Link to='/calendario' >Calendario</Link></li>
                    <li><Link to='/vencimientos'>Vencimientos</Link></li>
                    <li><Link to='/inspecciones'>Inspecciones</Link></li>
                    <li><Link to='/capacitaciones'>Capacitaciones</Link></li>
                <li><a onClick={(e)=> clickSearch(e)} href="!#"><i className="material-icons">search</i></a></li>
            </ul>
        </div>
      </nav>
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

    return ( 
        <div style={
          {display: showBar}
        }>
        {isSearching ? navSearch : navMenu}

        <ul className="sidenav" id="mobile-demo">
          <li>
            <a className="item-nav" href="sass.html">
              Cupones <i className="material-icons">storage</i>
            </a>
          </li>
          <li>
            <a className="item-nav" href="badges.html">
              Ayuda <i className="material-icons">help</i>
            </a>
          </li>
          <li>
            <a className="item-nav" href="collapsible.html">
              {" "}
              Mi cuenta <i className="material-icons">account_circle</i>
            </a>
          </li>
        </ul>
      </div>
     );
}
 
export default Appbar;