import React, { useState } from 'react';
import BarraMenu from './BarraMenu';
import Mapa from './Mapa';
import CardEstaciones from './CardEstaciones';
import "bootstrap/dist/css/bootstrap.min.css";
import '../css/Principal_Style.css';
import Medidas from './Medidas';
import Graficas from './Graficas';
import Filtro from './Filtro';

function Principal() {
    // Aquí manejas el estado del filtro seleccionado
    const [filtro, setFiltro] = useState(null);

    // Función para manejar el filtro seleccionado desde el componente Filtro
    const manejarFiltro = (datosFiltro) => {
        setFiltro(datosFiltro);  // Actualiza el filtro con los datos seleccionados
    };

    return (
        <div>
            {/** HEADER */}
            <BarraMenu />

            <div className="container-fluid custom-container">
                <div className="row align-items-stretch mb-4">
                    <div className="col-lg-6 col-md-12 mb-4">
                        <div className="h-100 custom-container-mapa d-flex flex-column">
                            <Mapa />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12 mb-4">
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

                {/* Ahora aquí se muestra el filtro que llamará la función manejarFiltro */}
                <div className="row align-items-stretch mb-4">
                    <div className="col-lg-12 col-md-12 mb-4">
                        <div className="h-100 custom-container-filtro d-flex flex-column">
                            <Filtro onFiltrar={manejarFiltro} />
                        </div>
                    </div>
                </div>

                {/* Pasamos el filtro seleccionado al componente Graficas */}
                <div className="row align-items-stretch mb-4">
                    <div className="col-lg-12 col-md-12 mb-4">
                        <div className="h-100 custom-container-graficas d-flex flex-column">
                            <Graficas filtro={filtro} /> {/* Pasamos el filtro aquí */}
                        </div>
                    </div>
                </div>
            </div>

            {/** FOOTER */}
            <footer className="footer-gradient text-center text-lg-start">
                <div className="footer-content p-3">
                    <div className="footer-item">Dirección de Investigación</div>
                    <div className="footer-item">Universidad Nacional de Loja</div>
                </div>
            </footer>
        </div>
    );
}

export default Principal;
