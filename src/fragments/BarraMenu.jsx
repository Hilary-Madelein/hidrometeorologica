import React from 'react';
import '../css/BarraMenu_Style.css';

const BarraMenu = () => {
    return (
        <nav className="navbar custom-navbar">
            <div className="header1">
                <img src="/img/Recurso 12.svg" alt="Logo Monitor" className="logo" />
                <h1 className="titulo">Observatorio Hidrometeorológico</h1>
            </div>
        </nav>
    );
}

export default BarraMenu;
