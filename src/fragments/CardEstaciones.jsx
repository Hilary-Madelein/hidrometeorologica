import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import '../css/CardEstaciones_Style.css';
import '../css/Principal_Style.css';

function CardEstaciones() {
    const [activeSection, setActiveSection] = useState('meteorological');

    const renderCards = () => {
        if (activeSection === 'meteorological') {
            return (
                <div className="row">
                    <div className="col-md-4">
                        <div className="card">
                            <img className="card-img-top" src="your_image_url" alt="Estación Meteorológica" />
                            <div className="card-body">
                                <h5 className="card-title">Estación Meteorológica 1</h5>
                                <p className="card-text">Descripción de la estación meteorológica 1.</p>
                                <a href="#" className="btn btn-primary">Ver detalles</a>
                            </div>
                        </div>
                    </div>
                    {/* Agrega más cards aquí */}
                </div>
            );
        } else if (activeSection === 'hydrological') {
            return (
                <div className="row">
                    <div className="col-md-4">
                        <div className="card">
                            <img className="card-img-top" src="your_image_url" alt="Estación Hidrológica" />
                            <div className="card-body">
                                <h5 className="card-title">Estación Hidrológica 1</h5>
                                <p className="card-text">Descripción de la estación hidrológica 1.</p>
                                <a href="#" className="btn btn-primary">Ver detalles</a>
                            </div>
                        </div>
                    </div>
                    {/* Agrega más cards aquí */}
                </div>
            );
        }
    };

    return (
        <div className={`container-fluid custom-container-cards ${activeSection}`}>
            <div className="section-tabs">
                <button 
                    className={`tab-button ${activeSection === 'meteorological' ? 'active meteorological' : ''}`} 
                    onClick={() => setActiveSection('meteorological')}>
                    Estaciones Meteorológicas
                </button>
                <button 
                    className={`tab-button ${activeSection === 'hydrological' ? 'active hydrological' : ''}`} 
                    onClick={() => setActiveSection('hydrological')}>
                    Estaciones Hidrológicas
                </button>
            </div>
            <div className="cards-section">
                {renderCards()}
            </div>
        </div>
    );
}

export default CardEstaciones;
