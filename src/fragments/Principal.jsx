import React, { useState } from 'react';
import BarraMenu from './BarraMenu';
import Mapa from './Mapa';
import CardEstaciones from './CardEstaciones';
import "bootstrap/dist/css/bootstrap.min.css";
import '../css/Principal_Style.css';
import Medidas from './Medidas';
import Graficas from './Graficas';
import Filtro from './Filtro';
import LogoCIS from '../img/LOGO_CIS.png'

function Principal() {
    const [filtro, setFiltro] = useState(null);

    const manejarFiltro = (datosFiltro) => {
        setFiltro(datosFiltro);
    };

    return (
        <div>
            {/** HEADER */}
            <BarraMenu />

            <div className="container-fluid custom-container">
                <div className="row align-items-stretch mb-4">
                    <div className="col-lg-12 col-md-12 mb-4">
                        <div className="h-100 custom-container-cards d-flex flex-column">
                            <CardEstaciones />
                        </div>
                    </div>
                </div>

                <div className="row align-items-stretch mb-4">
                    <div className="col-lg-12 col-md-12 mb-4">
                        <div className="h-100 custom-container-medidas d-flex flex-column">
                            <Medidas />
                        </div>
                    </div>
                </div>

                <div className="row align-items-stretch mb-4">
                    <div className="col-lg-12 col-md-12 mb-4">
                        <div className="h-100 custom-container-filtro d-flex flex-column">
                            <Filtro onFiltrar={manejarFiltro} />
                        </div>
                    </div>
                </div>

                <div className="row align-items-stretch mb-4">
                    <div className="col-lg-12 col-md-12 mb-4">
                        <div className="h-100 custom-container-graficas d-flex flex-column">
                            <Graficas filtro={filtro} />
                        </div>
                    </div>
                </div>
            </div>

            {/** FOOTER */}
            <footer className="footer-gradient text-center text-lg-start">
                <div className="footer-content p-3">
                    <div className="footer-item">
                        <img src={LogoCIS} alt="Logo CIS" className="logo-cis" />
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Principal;
