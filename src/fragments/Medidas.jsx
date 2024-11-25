import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { borrarSesion, getToken } from '../utils/SessionUtil';
import mensajes from '../utils/Mensajes';
import { ObtenerPost } from '../hooks/Conexion';
import '../css/Medidas_Style.css';
import temperaturaIcon from '../img/temperatura.png';
import presionIcon from '../img/presion.png';
import lluviaIcon from '../img/lluvia.png';
import humedadIcon from '../img/humedad.png';
import '../css/Filtro_Style.css';
import '../css/Principal_Style.css';

const chartColors = ['#362FD9', '#1AACAC', '#DB005B', '#19A7CE', '#DF2E38', '#8DCBE6'];

function Medidas({ filtro }) {
    const [variables, setVariables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [detalleMes, setDetalleMes] = useState([]);
    const [tituloModal, setTituloModal] = useState("");
    const [unidad, setUnidad] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!filtro || (!filtro.fechaInicio && !filtro.mesSeleccionado && !filtro.tipo) || !filtro.estacion) {
                setVariables([]);
                return;
            }

            setLoading(true);
            let url = '/listar/medidas/escala';
            let body = {};

            try {
                if (filtro.tipo === "mensual") {
                    url = '/medidas/mensuales/promediadas';
                    body.escalaDeTiempo = filtro.tipo;
                    body.external_id = filtro.estacion;
                } else if (["15min", "30min", "diaria", "hora"].includes(filtro.tipo)) {
                    body.escalaDeTiempo = filtro.tipo;
                } else if (filtro.tipo === "mesAnio") {
                    url = '/medidas/desglosemes/promediadas';
                    body.mes = filtro.mes;
                    body.anio = filtro.anio;
                    body.external_id = filtro.estacion;
                } else if (filtro.tipo === "rangoFechas") {
                    url = '/medidas/rango/promediadas';
                    body.fechaInicio = new Date(filtro.fechaInicio).toISOString();
                    body.fechaFin = new Date(filtro.fechaFin).toISOString();
                    body.external_id = filtro.estacion;
                }

                const info = await ObtenerPost(getToken(), url, body);

                if (info.code !== 200) {
                    setVariables([]);
                    mensajes(info.msg, 'info');
                    if (info.msg === 'Acceso denegado. Token ha expirado') {
                        borrarSesion();
                        navigate("/login");
                    }
                } else {
                    const medidas = extraerMedidas(info.info, filtro.tipo);
                    setVariables(medidas);
                }
            } catch (error) {
                setVariables([]);
                mensajes(error.message, 'info');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filtro, navigate]);

    const extraerMedidas = (info, filtroTipo) => {
        const medidasAgrupadas = {};
    
        if (["15min", "30min", "hora", "diaria"].includes(filtroTipo)) {
            // Procesar formato agregado (ejemplo: avg_Temperatura, max_Temperatura)
            Object.entries(info).forEach(([clave, valor]) => {
                const [metrica, nombreMedida] = clave.split("_"); // Separar avg, max, min de Temperatura, Humedad, etc.
    
                if (!medidasAgrupadas[nombreMedida]) {
                    medidasAgrupadas[nombreMedida] = {
                        nombre: nombreMedida,
                        valores: {}, // Guardaremos las métricas aquí
                        icono: '',
                        unidad: '',
                        color: '',
                    };
                }
    
                // Asignar valores según la métrica (promedio, máx, min, suma)
                if (metrica === "avg") medidasAgrupadas[nombreMedida].valores.promedio = valor;
                if (metrica === "max") medidasAgrupadas[nombreMedida].valores.max = valor;
                if (metrica === "min") medidasAgrupadas[nombreMedida].valores.min = valor;
                if (metrica === "sum") medidasAgrupadas[nombreMedida].valores.suma = valor;
    
                // Configuración de icono, unidad y color
                configurarAtributos(medidasAgrupadas[nombreMedida], nombreMedida);
            });
        } else {
            // Procesar el formato actual (con "dia", "mes", "medidas")
            info.forEach((dato) => {
                const { dia, mes, medidas } = dato;
    
                Object.entries(medidas).forEach(([nombreMedida, valores]) => {
                    if (!medidasAgrupadas[nombreMedida]) {
                        medidasAgrupadas[nombreMedida] = {
                            nombre: nombreMedida,
                            valores: {
                                promedio: valores.PROMEDIO || 0,
                                max: valores.MAX || 0,
                                min: valores.MIN || 0,
                                suma: valores.SUMA || 0,
                            },
                            icono: '',
                            unidad: '',
                            color: '',
                            detalles: []
                        };
    
                        // Configurar icono, unidad y color
                        configurarAtributos(medidasAgrupadas[nombreMedida], nombreMedida);
                    }
    
                    // Agregar detalles según el tipo de filtro
                    if (filtroTipo === "mensual" && mes) {
                        medidasAgrupadas[nombreMedida].detalles.push({
                            mes,
                            promedio: valores.PROMEDIO !== undefined ? valores.PROMEDIO : null,
                            max: valores.MAX !== undefined ? valores.MAX : null,
                            min: valores.MIN !== undefined ? valores.MIN : null,
                            suma: valores.SUMA !== undefined ? valores.SUMA : null,
                        });
                    } else if (["rangoFechas", "mesAnio"].includes(filtroTipo) && dia) {
                        medidasAgrupadas[nombreMedida].detalles.push({
                            dia,
                            promedio: valores.PROMEDIO !== undefined ? valores.PROMEDIO : null,
                            max: valores.MAX !== undefined ? valores.MAX : null,
                            min: valores.MIN !== undefined ? valores.MIN : null,
                            suma: valores.SUMA !== undefined ? valores.SUMA : null,
                        });
                    }
                });
            });
        }
    
        return Object.values(medidasAgrupadas);
    };
    
    // Función auxiliar para configurar icono, unidad y color
    const configurarAtributos = (medida, nombreMedida) => {
        if (nombreMedida === 'Temperatura') {
            medida.icono = temperaturaIcon;
            medida.unidad = "°C";
            medida.color = chartColors[0];
        } else if (nombreMedida === 'Humedad') {
            medida.icono = humedadIcon;
            medida.unidad = "%";
            medida.color = chartColors[1];
        } else if (nombreMedida === 'Presion' || nombreMedida === 'Presión atmosférica') {
            // Manejar varias formas de escribir "Presión atmosférica"
            medida.icono = presionIcon;
            medida.unidad = "hPa";
            medida.color = chartColors[2];
        } else if (nombreMedida === 'Lluvia') {
            medida.icono = lluviaIcon;
            medida.unidad = "mm";
            medida.color = chartColors[3];
        }
    };
    

    const handleShowModal = (nombre, detalles, unidad) => {
        setTituloModal(`Detalle de ${nombre} por mes`);
        setDetalleMes(detalles);
        setUnidad(unidad);
        setShowModal(true);
    };


    const handleCloseModal = () => setShowModal(false);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" role="status" style={{ width: '3rem', height: '3rem', margin: '10px', color: '#0C2840' }}>
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
                                <p className="medida-variable"><strong>Medida: </strong>{variable.unidad}</p>

                                {["mensual", "rangoFechas", "mesAnio"].includes(filtro.tipo) ? (
                                    <Button
                                        className="btn btn-primary custom-button-filtro"
                                        onClick={() =>
                                            handleShowModal(
                                                variable.nombre,
                                                variable.detalles,
                                                variable.unidad
                                            )
                                        }
                                    >
                                        Ver detalle
                                    </Button>
                                ) : (
                                    <div className="valor-variable">
                                        {variable.valores.promedio !== undefined && variable.valores.promedio !== null && (
                                            <p>
                                                <strong>Promedio:</strong>{" "}
                                                {variable.valores.promedio.toFixed(2)} {variable.unidad}
                                            </p>
                                        )}
                                        {variable.valores.max !== undefined && variable.valores.max !== null && (
                                            <p>
                                                <strong>Máx:</strong> {variable.valores.max.toFixed(2)}{" "}
                                                {variable.unidad}
                                            </p>
                                        )}
                                        {variable.valores.min !== undefined && variable.valores.min !== null && (
                                            <p>
                                                <strong>Mín:</strong> {variable.valores.min.toFixed(2)}{" "}
                                                {variable.unidad}
                                            </p>
                                        )}
                                        {variable.valores.suma !== undefined && variable.valores.suma !== null && (
                                            <p>
                                                <strong>Suma:</strong> {variable.valores.suma.toFixed(2)}{" "}
                                                {variable.unidad}
                                            </p>
                                        )}
                                    </div>

                                )}

                            </div>
                        </div>
                    </div>
                ))}
            </div>


            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header style={{ background: 'var(--blue-unl)' }}>
                    <Modal.Title style={{ color: 'var(--white)', fontWeight: 'bold' }}>{tituloModal}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        {detalleMes.length > 0 ? (
                            detalleMes.map((detalle, index) => (
                                <div key={index} className="row border-bottom py-2">
                                    <div className="col-12 col-md-4">
                                        <strong>{detalle.mes || detalle.dia}</strong>
                                    </div>
                                    <div className="col-12 col-md-8">
                                        {detalle.promedio !== null && (
                                            <p><strong>Promedio:</strong> {detalle.promedio.toFixed(2)} {unidad}</p>
                                        )}
                                        {detalle.max !== null && (
                                            <p><strong>Máx:</strong> {detalle.max.toFixed(2)} {unidad}</p>
                                        )}
                                        {detalle.min !== null && (
                                            <p><strong>Mín:</strong> {detalle.min.toFixed(2)} {unidad}</p>
                                        )}
                                        {detalle.suma !== null && (
                                            <p><strong>Suma:</strong> {detalle.suma.toFixed(2)} {unidad}</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No hay datos disponibles para esta medida.</p>
                        )}
                    </div>

                </Modal.Body>

                <Modal.Footer style={{ background: 'var(--blue-unl)' }}>
                    <Button variant="btn btn-light" onClick={handleCloseModal}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Medidas;
