import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import '../css/CardEstaciones_Style.css';
import '../css/Principal_Style.css';
import Spinner from 'react-bootstrap/Spinner';  // Importar el Spinner de Bootstrap

// Simulación de datos agrupados por microcuenca y tipo de estación
const obtenerDatosEstaciones = async () => {
    return new Promise((resolve) => {

        resolve([
            {
                microcuenca: 'Microcuenca Los Nogales',
                tipo: 'meteorological',
                estaciones: [
                    { title: 'Estación Meteorológica 1', description: 'Descripción de la estación meteorológica 1.', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_xQmNqOc0iSgzsPhUD9sCu79nyFpEX37K3gEZfatVscahai7lquFCojJCnNLKFVGYaTI&usqp=CAU' },
                    { title: 'Estación Meteorológica 2', description: 'Descripción de la estación meteorológica 2.', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE08MRoOB2V3YF1Qw3jCKlH8mFA6JVlyK1FA&s' }
                ]
            },
            {
                microcuenca: 'Microcuenca El Retiro',
                tipo: 'hydrological',
                estaciones: [
                    { title: 'Estación Hidrológica 1', description: 'Descripción de la estación hidrológica 1.', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhuubdZdbKg0JKUN7G5jCxCwAv7vqNrX0Ilw&s' },
                    { title: 'Estación Hidrológica 2', description: 'Descripción de la estación hidrológica 2.', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_xQmNqOc0iSgzsPhUD9sCu79nyFpEX37K3gEZfatVscahai7lquFCojJCnNLKFVGYaTI&usqp=CAU' },
                ]
            }
        ]);
        ;
    });
};

function CardEstaciones() {
    const [activeSection, setActiveSection] = useState('meteorological'); // Controla si se ven las secciones meteorológica o hidrológica
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);  // Controla si los datos están cargando
    const [selectedMicrocuenca, setSelectedMicrocuenca] = useState(null); // Controla la microcuenca seleccionada

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            const estaciones = await obtenerDatosEstaciones();
            setData(estaciones);
            setLoading(false);
        };
        cargarDatos();
    }, []);

    const getButtonColor = (tipo) => {
        return tipo === 'meteorological' ? 'btn-danger' : 'btn-success';
    };

    const renderMicrocuencaCards = () => {
        const filteredData = data.filter((item) => item.tipo === activeSection);
        const cardClass = 'col-md-4 col-sm-6 mb-4';

        return (
            <div className="row mt-4">
                {filteredData.map((microcuenca, index) => (
                    <div key={index} className={cardClass}>
                        <div className="modern-card card-custom">
                            <img className="card-img-top" src="https://via.placeholder.com/300x150" alt={microcuenca.microcuenca} />
                            <div className="card-body">
                                <h5 className="card-title">{microcuenca.microcuenca}</h5>
                                <button
                                    style={{ marginTop: '10px' }}
                                    className={`btn ${getButtonColor(microcuenca.tipo)}`}
                                    onClick={() => setSelectedMicrocuenca(microcuenca)}>
                                    Ver Estaciones
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Renderizar las estaciones dentro de una microcuenca seleccionada
    const renderEstaciones = () => (
        <div>
            <button className="btn btn-back" onClick={() => setSelectedMicrocuenca(null)}>
                <span>&larr;</span>
            </button>
            <div className="row mt-4">
                {selectedMicrocuenca.estaciones.map((item, index) => (
                    <div key={index} className="col-md-3 col-sm-6 mb-4">
                        <div className="modern-card card-custom">
                            <img className="card-img-top" src={item.imageUrl} alt={item.title} />
                            <div className="card-body">
                                <h5 className="card-title">{item.title}</h5>
                                <p className="card-text">{item.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className={`container-fluid custom-container-cards ${activeSection}`}>
            {!selectedMicrocuenca && (
                <div className="zonas-monitoreo-titulo">
                    <h2>Zonas de Monitoreo</h2>
                </div>
            )}
            {!selectedMicrocuenca && (
                <div className="section-tabs">
                    <button
                        className={`tab-button ${activeSection === 'meteorological' ? 'active meteorological' : ''}`}
                        onClick={() => {
                            setActiveSection('meteorological');
                            setSelectedMicrocuenca(null);
                        }}>
                        Meteorológicas
                    </button>
                    <button
                        className={`tab-button ${activeSection === 'hydrological' ? 'active hydrological' : ''}`}
                        onClick={() => {
                            setActiveSection('hydrological');
                            setSelectedMicrocuenca(null);
                        }}>
                        Hidrológicas
                    </button>
                </div>
            )}
            <div className="cards-section">
                {selectedMicrocuenca ? renderEstaciones() : renderMicrocuencaCards()}
            </div>
        </div>
    );
}

export default CardEstaciones;
