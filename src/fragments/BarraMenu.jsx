import React from 'react';
import logoUNL from '../img/unl.png';
import '../css/BarraMenu_Style.css';

const BarraMenu = () => {
    return (
        <nav className="navbar custom-navbar navbar-expand-lg">
            <div className="container-fluid header1">
                <a className="navbar-brand d-flex align-items-center">
                    <img src={logoUNL} alt="Logo Monitor" className="logo" />
                    <div className="titulo">Monitor Hidrometeorológico</div>
                </a>
            </div>
        </nav>
    );
}

export default BarraMenu;
