import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import "bootstrap/dist/css/bootstrap.min.css";
import '../css/Mapa_Style.css';
import '../css/Principal_Style.css';
import '../css/CardEstaciones_Style.css';
import Spinner from 'react-bootstrap/Spinner';
import { getToken } from '../utils/SessionUtil';
import { ObtenerGet, ObtenerPost, URLBASE } from '../hooks/Conexion';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFkZWxlaW4iLCJhIjoiY20wd2w4N3VqMDMyYzJqb2ZlNXF5ZnhiZCJ9.i3tWgoA_5CQmQmZyt2yjhg';

const obtenerDatosEstaciones = async () => {
    try {
        const response = await ObtenerGet(getToken(), '/listar/microcuenca/operativas');
        if (response.code === 200) {
            return response.info;
        } else {
            throw new Error(response.msg || 'Error al obtener datos');
        }
    } catch (error) {
        console.error("Error al obtener datos de estaciones:", error);
        return [];
    }
};

function MapaConEstaciones() {
    const mapContainerRef = useRef(null);
    const [map, setMap] = useState(null);
    const [initialView, setInitialView] = useState({ center: [-79.2, -4.0], zoom: 12 });
    const [activeSection, setActiveSection] = useState('all');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMicrocuenca, setSelectedMicrocuenca] = useState(null);
    const markersRef = useRef([]);

    useEffect(() => {
        if (mapContainerRef.current) {
            const mapInstance = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/satellite-streets-v12',
                center: initialView.center,
                zoom: initialView.zoom,
            });

            mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');
            setMap(mapInstance);

            return () => mapInstance.remove(); 
        }
    }, [mapContainerRef, initialView]);

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            const estaciones = await obtenerDatosEstaciones();
            setData(estaciones);
            setLoading(false);
        };
        cargarDatos();
    }, []);

    const obtenerEstacionesMicrocuenca = async (externalId) => {
        setLoading(true);
        const response = await ObtenerPost(getToken(), 'estaciones/operativas/microcuenca', { external: externalId });
        if (response.code === 200) {
            setSelectedMicrocuenca({ ...selectedMicrocuenca, estaciones: response.info });

            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];
    
            const bounds = new mapboxgl.LngLatBounds();
            let hasValidCoordinates = false;

            response.info.forEach((estacion) => {
                const coordenadas = [estacion.longitud, estacion.latitud];
    
                if (coordenadas && coordenadas.length === 2 && !isNaN(coordenadas[0]) && !isNaN(coordenadas[1])) {
                    const marker = new mapboxgl.Marker()
                        .setLngLat(coordenadas)
                        .setPopup(new mapboxgl.Popup().setText(estacion.nombre)) 
                        .addTo(map);
    
                    markersRef.current.push(marker);
                    bounds.extend(coordenadas);
                    hasValidCoordinates = true;
                }
            });

            if (hasValidCoordinates) {
                map.fitBounds(bounds, { padding: 50 });
            } else {
                console.warn("No se encontraron coordenadas válidas para ajustar la vista del mapa.");
            }
        } else {
            console.error("Error al obtener estaciones:", response.msg);
        }
        setLoading(false);
    };

    const volverVistaInicial = () => {
        setSelectedMicrocuenca(null);
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        map.flyTo({ center: initialView.center, zoom: initialView.zoom });
    };

    const renderMicrocuencaCards = () => {
        return (
            <div className="row mt-4">
                {data.map((microcuenca, index) => (
                    <div key={index} className="col-md-4 col-sm-6 mb-4">
                        <div className="modern-card">
                            <img
                                className="card-img-top"
                                src={`${URLBASE}/images/microcuencas/${microcuenca.foto}`}
                                alt={microcuenca.nombre}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{microcuenca.nombre}</h5>
                                <button
                                    style={{ marginTop: '10px' }}
                                    className="btn-ver-estaciones"
                                    onClick={() => obtenerEstacionesMicrocuenca(microcuenca.external_id)}
                                >
                                    Ver Estaciones
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderEstaciones = () => {
        if (!selectedMicrocuenca) return null;

        const estacionesFiltradas = selectedMicrocuenca.estaciones.filter((estacion) =>
            activeSection === 'all' || estacion.tipo === activeSection
        );

        return (
            <div>
                <button className="btn btn-back" onClick={volverVistaInicial}>
                    <span>&larr;</span>
                </button>

                <div className="section-tabs">
                    <button
                        className={`tab-button all ${activeSection === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveSection('all')}
                    >
                        Todas
                    </button>
                    <button
                        className={`tab-button meteorological ${activeSection === 'METEOROLOGICA' ? 'active' : ''}`}
                        onClick={() => setActiveSection('METEOROLOGICA')}
                    >
                        Meteorológicas
                    </button>
                    <button
                        className={`tab-button hydrological ${activeSection === 'HIDROLOGICA' ? 'active' : ''}`}
                        onClick={() => setActiveSection('HIDROLOGICA')}
                    >
                        Hidrológicas
                    </button>
                </div>

                <div className="row mt-4">
                    {estacionesFiltradas.map((item, index) => (
                        <div key={index} className="col-md-3 col-sm-6 mb-4">
                            <div className="modern-card card-custom">
                                <img
                                    className="card-img-top"
                                    src={`${URLBASE}/images/estaciones/${item.foto}`}
                                    alt={item.nombre}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{item.nombre}</h5>
                                    <p className="card-text">{item.descripcion}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="mapa-con-estaciones-container">
            <div className="mapa-section" ref={mapContainerRef} />
            <div className="estaciones-section">
                <div className="custom-container-cards">
                    {!selectedMicrocuenca && (
                        <div className="zonas-monitoreo-titulo">
                            <h2>Zonas de Monitoreo</h2>
                        </div>
                    )}
                    <div className="cards-section">
                        {loading ? (
                            <div className="spinner-container">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : selectedMicrocuenca ? (
                            renderEstaciones()
                        ) : (
                            renderMicrocuencaCards()
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MapaConEstaciones;
