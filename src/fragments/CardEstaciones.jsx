import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import '../css/CardEstaciones_Style.css';
import '../css/Principal_Style.css';

const obtenerDatosEstaciones = async (tipo) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (tipo === 'meteorological') {
                resolve([
                    { title: 'Estación Meteorológica 1', description: 'Descripción de la estación meteorológica 1.', imageUrl: 'your_image_url_1' },
                    { title: 'Estación Meteorológica 2', description: 'Descripción de la estación meteorológica 2.', imageUrl: 'your_image_url_2' },
                    { title: 'Estación Meteorológica 3', description: 'Descripción de la estación meteorológica 3.', imageUrl: 'your_image_url_3' },
                    { title: 'Estación Meteorológica 4', description: 'Descripción de la estación meteorológica 4.', imageUrl: 'your_image_url_4' },
                ]);
            } else {
                resolve([
                    { title: 'Estación Hidrológica 1', description: 'Descripción de la estación hidrológica 1.', imageUrl: 'your_image_url_4' },
                    { title: 'Estación Hidrológica 2', description: 'Descripción de la estación hidrológica 2.', imageUrl: 'your_image_url_5' },
                    { title: 'Estación Hidrológica 3', description: 'Descripción de la estación hidrológica 3.', imageUrl: 'your_image_url_6' }
                ]);
            }
        }, 2000);
    });
};

function CardEstaciones() {
    const [activeSection, setActiveSection] = useState('meteorological');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            setProgress(0);
            const interval = setInterval(() => {
                setProgress((prev) => (prev < 80 ? prev + 10 : prev));
            }, 200);

            const estaciones = await obtenerDatosEstaciones(activeSection);
            clearInterval(interval);
            setData(estaciones);
            setLoading(false);
            setProgress(100);
        };
        cargarDatos();
    }, [activeSection]);

    const getProgressColor = () => {
        return activeSection === 'meteorological' ? 'bg-danger' : 'bg-success';
    };

    const getButtonColor = () => {
        return activeSection === 'meteorological' ? 'btn-danger' : 'btn-success';
    };

    const renderProgressBar = () => (
        <div className="progress-container">
            <div className="modern-progress-bar">
                <div
                    className={`progress-bar progress-bar-striped progress-bar-animated ${getProgressColor()}`}
                    role="progressbar"
                    style={{ width: `${progress}%` }}
                    aria-valuenow={progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                ></div>
            </div>
            <p>Cargando datos...</p>
        </div>
    );

    const renderCards = () => {
        const cardClass = 'col-md-4 col-sm-6 mb-4';

        if (loading) {
            return (
                <div className="progress-container">
                    {renderProgressBar()}
                </div>
            );
        }

        return (
            <div className="row mt-4">
                {data.map((item, index) => (
                    <div key={index} className={cardClass}>
                        <div className="modern-card card-custom">
                            <img className="card-img-top" src={item.imageUrl} alt={item.title} />
                            <div className="card-body">
                                <h5 className="card-title">{item.title}</h5>
                                <p className="card-text">{item.description}</p>
                                <a href="#" className={`btn ${getButtonColor()}`}>Ver detalles</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
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
