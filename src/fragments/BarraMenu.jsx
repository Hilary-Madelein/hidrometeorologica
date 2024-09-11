import React from 'react';
import logoIcon from '../img/logoMH.png'; // Ajusta la ruta según la ubicación de tu logo
import '../css/BarraMenu_Style.css'; // Asegúrate de importar el archivo de estilos correctamente

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
