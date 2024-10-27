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
            if (!filtro || (!filtro.fechaInicio && !filtro.mesSeleccionado && !filtro.tipo)) {
                setVariables([]);
                return;
            }

            setLoading(true);
            let url = '/listar/medidas/escala';
            let body = {};

            try {
                if (filtro.tipo === "mensual") {
                    url = '/listar/temperatura/mensual/datos';
                    body.escalaDeTiempo = filtro.tipo;
                } else if (["15min", "30min", "diaria", "hora"].includes(filtro.tipo)) {
                    body.escalaDeTiempo = filtro.tipo;
                } else if (filtro.tipo === "mesAnio") {
                    body.mes = filtro.mesSeleccionado;
                    body.anio = filtro.anioSeleccionado;
                } else if (filtro.tipo === "rangoFechas") {
                    body.fechaInicio = new Date(filtro.fechaInicio).toISOString();
                    body.fechaFin = new Date(filtro.fechaFin).toISOString();
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
                    console.log("DATITA", info.info);

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
        const data = Array.isArray(info) ? info : [info];
    
        data.forEach((dato) => {
            Object.keys(dato).forEach((clave) => {
                if (clave === "mes") return;
                const [operacion, nombreMedida] = clave.split('_');
    
                if (!medidasAgrupadas[nombreMedida]) {
                    medidasAgrupadas[nombreMedida] = {
                        nombre: nombreMedida,
                        valores: {
                            promedio: null,
                            max: null,
                            min: null,
                            suma: null
                        },
                        icono: '',
                        unidad: '',
                        color: '',
                        detalles: []
                    };
                }
    
                // Configuración de icono, unidad, y color
                if (nombreMedida === 'Temperatura') {
                    medidasAgrupadas[nombreMedida].icono = temperaturaIcon;
                    medidasAgrupadas[nombreMedida].unidad = "°C";
                    medidasAgrupadas[nombreMedida].color = chartColors[0];
                } else if (nombreMedida === 'Humedad') {
                    medidasAgrupadas[nombreMedida].icono = humedadIcon;
                    medidasAgrupadas[nombreMedida].unidad = "%";
                    medidasAgrupadas[nombreMedida].color = chartColors[1];
                } else if (nombreMedida === 'Presion') {
                    medidasAgrupadas[nombreMedida].icono = presionIcon;
                    medidasAgrupadas[nombreMedida].unidad = "hPa";
                    medidasAgrupadas[nombreMedida].color = chartColors[2];
                } else if (nombreMedida === 'Lluvia') {
                    medidasAgrupadas[nombreMedida].icono = lluviaIcon;
                    medidasAgrupadas[nombreMedida].unidad = "mm";
                    medidasAgrupadas[nombreMedida].color = chartColors[3];
                }
    
                // Guardar valores individuales
                if (operacion === 'avg') medidasAgrupadas[nombreMedida].valores.promedio = dato[clave];
                if (operacion === 'max') medidasAgrupadas[nombreMedida].valores.max = dato[clave];
                if (operacion === 'min') medidasAgrupadas[nombreMedida].valores.min = dato[clave];
                if (operacion === 'sum') medidasAgrupadas[nombreMedida].valores.suma = dato[clave];
    
                // Control de duplicados solo para "mensual"
                if (filtroTipo === "mensual") {
                    // Verificar si el mes ya ha sido agregado a los detalles para evitar duplicación
                    const existeMes = medidasAgrupadas[nombreMedida].detalles.find((detalle) => detalle.mes === dato.mes);
    
                    if (!existeMes) {
                        medidasAgrupadas[nombreMedida].detalles.push({
                            mes: dato.mes,
                            promedio: dato[`avg_${nombreMedida}`],
                            max: dato[`max_${nombreMedida}`],
                            min: dato[`min_${nombreMedida}`],
                            suma: dato[`sum_${nombreMedida}`]
                        });
                    }
                }
            });
        });
    
        return Object.values(medidasAgrupadas);
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

                                {filtro.tipo === "mensual" ? (
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
                                        {variable.valores.promedio !== null && (
                                            <p>
                                                <strong>Promedio:</strong>{" "}
                                                {variable.valores.promedio.toFixed(2)} {variable.unidad}
                                            </p>
                                        )}
                                        {variable.valores.max !== null && (
                                            <p>
                                                <strong>Máx:</strong> {variable.valores.max.toFixed(2)}{" "}
                                                {variable.unidad}
                                            </p>
                                        )}
                                        {variable.valores.min !== null && (
                                            <p>
                                                <strong>Mín:</strong> {variable.valores.min.toFixed(2)}{" "}
                                                {variable.unidad}
                                            </p>
                                        )}
                                        {variable.valores.suma !== null && (
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
                                    <div className="col-12 col-md-4"><strong>{detalle.mes}</strong></div>
                                    <div className="col-12 col-md-8">
                                        {detalle.promedio !== undefined && (
                                            <p><strong>Promedio:</strong> {detalle.promedio.toFixed(2)} {unidad}</p>
                                        )}
                                        {detalle.max !== undefined && (
                                            <p><strong>Máx:</strong> {detalle.max.toFixed(2)} {unidad}</p>
                                        )}
                                        {detalle.min !== undefined && (
                                            <p><strong>Mín:</strong> {detalle.min.toFixed(2)} {unidad}</p>
                                        )}
                                        {detalle.suma !== undefined && (
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
