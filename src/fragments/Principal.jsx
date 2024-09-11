import React from 'react';
import BarraMenu from './BarraMenu';
import Mapa from './Mapa';
import CardEstaciones from './CardEstaciones';
import "bootstrap/dist/css/bootstrap.min.css";
import '../css/Principal_Style.css';
import Filtro from './Filtro';
import Medidas from './Medidas';

function Principal() {
    return (
        <div>
            {/** HEADER */}
            <BarraMenu />

            <div className="container-fluid custom-container">
                <div className="row align-items-stretch">
                    <div className="col-lg-7 col-md-12 mb-4">
                        <div className="h-100 custom-container-mapa d-flex flex-column">
                            <Mapa />
                        </div>
                    </div>
                    <div className="col-lg-5 col-md-12 mb-4">
                        <div className="h-100 custom-container-cards d-flex flex-column">
                            <CardEstaciones />
                        </div>
                    </div>
                </div>
                <div className="row align-items-stretch">
                    <div className="col-lg-12 col-md-12 mb-4" >
                        <div className="h-100 custom-container-filtro custom-height d-flex flex-column" style={{ height: 'auto' }}>
                            <Filtro />
                        </div>
                    </div>
                </div>
                <div className="row align-items-stretch">
                    <div className="col-lg-12 col-md-12 mb-4" >
                        <div className="custom-container-medidas d-flex flex-column" style={{ height: '350px'}}>
                            <Medidas />
                        </div>
                    </div>
                </div>


            </div>


            {/** FOOTER */}
            <footer className="bg-body-tertiary text-center text-lg-start">
                <div className="d-flex justify-content-between p-3" style={{ color: '#fff', backgroundColor: '#0C2840', fontWeight: 500 }}>
                    <div>
                        Dirección de investigación
                    </div>
                    <div>
                        Universidad Nacional de Loja
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Principal;
