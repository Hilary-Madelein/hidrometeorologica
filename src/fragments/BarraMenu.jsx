import React from 'react';
import logoIcon from '../img/logoMH.png'; 
import '../css/BarraMenu_Style.css'; 

const BarraMenu = () => {
    return (
        <nav className="navbar custom-navbar navbar-expand-lg">
            <div className="container-fluid header1">
                <a className="navbar-brand" href="#">
                    <img src={logoIcon} alt="Logo Monitor" width="60" height="60" className="d-inline-block align-text-top" />
                    <div className="titulo">Monitor Hidrometeorológico</div>
                </a>
            </div>
        </nav>
    );
}

export default BarraMenu;
