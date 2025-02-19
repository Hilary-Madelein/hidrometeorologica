import React, { useEffect, useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { ObtenerGet } from '../hooks/Conexion';
import '../css/Medidas_Style.css';
import temperaturaIcon from '../img/temperatura.png';
import presionIcon from '../img/presion.png';
import lluviaIcon from '../img/lluvia.png';
import humedadIcon from '../img/humedad.png';
import '../css/Filtro_Style.css';
import '../css/Principal_Style.css';
import { getToken } from '../utils/SessionUtil';

const chartColors = ['#362FD9', '#1AACAC', '#DB005B', '#19A7CE', '#DF2E38', '#8DCBE6'];

function Medidas() {
    const [variables, setVariables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [detalleMedida, setDetalleMedida] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
    
            try {
                // Obtener las últimas mediciones de todas las variables
                const info = await ObtenerGet(getToken(), '/listar/ultimaMedida');
    
                // Validar la respuesta
                if (!info || info.code !== 200) {
                    console.warn("No se pudieron obtener las últimas medidas:", info?.msg || "Respuesta vacía");
                    setVariables([]);
                    return;
                }
    
                // Procesar y almacenar las medidas en el estado
                const medidas = procesarMedidas(info.mediciones);
                setVariables(medidas);
                console.log("Medidas obtenidas:", medidas);
                
            } catch (error) {
                console.error("Error al obtener las últimas medidas:", error);
                setVariables([]);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);
    
    const procesarMedidas = (data) => {
        return data.map((item, index) => ({
            nombre: item.ultimaMedicion.tipo_medida,
            valor: parseFloat(item.ultimaMedicion.valor),
            estacion: item.ultimaMedicion.estacion,
            fecha: item.ultimaMedicion.fecha_local,
            icono: obtenerIcono(item.ultimaMedicion.tipo_medida),
            unidad: obtenerUnidad(item.ultimaMedicion.tipo_medida),
            color: chartColors[index % chartColors.length]
        }));
    };

    // Asigna un ícono basado en el tipo de variable
    const obtenerIcono = (tipo) => {
        switch (tipo) {
            case 'Temperatura': return temperaturaIcon;
            case 'Humedad': return humedadIcon;
            case 'Presión atmosférica': return presionIcon;
            case 'Lluvia': return lluviaIcon;
            default: return humedadIcon;
        }
    };

    // Asigna una unidad basada en el tipo de variable
    const obtenerUnidad = (tipo) => {
        switch (tipo) {
            case 'Temperatura': return "°C";
            case 'Humedad': return "%";
            case 'Presión atmosférica': return "hPa";
            case 'Lluvia': return "mm";
            default: return "";
        }
    };

    // Manejar la apertura del modal con detalles de una variable
    const handleShowModal = (medida) => {
        setDetalleMedida(medida);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" role="status" style={{ width: '3rem', height: '3rem', color: '#0C2840' }}>
                    <span className="sr-only"></span>
                </Spinner>
                <p className="mt-3">Cargando datos...</p>
            </div>
        );
    }

    return (
        <div className="container-fluid custom-container-medidas">
            <div className="row mb-4 justify-content-center">
                {variables.map((variable, index) => (
                    <div
                        key={index}
                        className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4 d-flex align-items-stretch"
                    >
                        <div
                            className="card custom-card shadow-sm w-100 d-flex justify-content-center align-items-center"
                            style={{ borderTop: `8px solid ${variable.color}` }}
                        >
                            <img
                                src={variable.icono}
                                alt={`${variable.nombre} Icono`}
                                className="icono-variable"
                            />
                            <div className="variable-content">
                                <h5 className="variable-title"><strong>{variable.nombre}</strong></h5>
                                <p className="medida-variable"><strong>Valor:</strong> {variable.valor} {variable.unidad}</p>
                                <p className="medida-variable"><strong>Estación:</strong> {variable.estacion}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Medidas;
