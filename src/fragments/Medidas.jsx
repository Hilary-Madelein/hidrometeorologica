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

function MedidasDinamicas({ filtro }) {
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
                    const medidas = extraerMedidas(info.info);
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

    const extraerMedidas = (info) => {
        if (Array.isArray(info)) {
            return [
                {
                    nombre: "Temperatura",
                    valor: `Promedio: ${(info.reduce((acc, mes) => acc + mes.promedioTemperatura, 0) / info.length).toFixed(2)} °C\nMáx: ${(Math.max(...info.map(mes => mes.maxTemperatura))).toFixed(2)} °C\nMín: ${(Math.min(...info.map(mes => mes.minTemperatura))).toFixed(2)} °C`,
                    icono: temperaturaIcon,
                    unidad: "°C",
                    color: chartColors[0],
                    detalles: info.map(mes => ({
                        mes: mes.mes,
                        promedio: mes.promedioTemperatura,
                        max: mes.maxTemperatura,
                        min: mes.minTemperatura
                    }))
                },
                {
                    nombre: "Humedad",
                    valor: `Promedio: ${(info.reduce((acc, mes) => acc + mes.promedioHumedad, 0) / info.length).toFixed(2)} %`,
                    icono: humedadIcon,
                    unidad: "%",
                    color: chartColors[1],
                    detalles: info.map(mes => ({
                        mes: mes.mes,
                        promedio: mes.promedioHumedad
                    }))
                },
                {
                    nombre: "Presión",
                    valor: `Promedio: ${(info.reduce((acc, mes) => acc + mes.promedioPresion, 0) / info.length).toFixed(2)} hPa`,
                    icono: presionIcon,
                    unidad: "hPa",
                    color: chartColors[2],
                    detalles: info.map(mes => ({
                        mes: mes.mes,
                        promedio: mes.promedioPresion
                    }))
                },
                {
                    nombre: "Lluvia",
                    valor: `Suma: ${info.reduce((acc, mes) => acc + mes.sumaLluvia, 0).toFixed(2)} mm`,
                    icono: lluviaIcon,
                    unidad: "mm",
                    color: chartColors[3],
                    detalles: info.map(mes => ({
                        mes: mes.mes,
                        total: mes.sumaLluvia
                    }))
                },
            ];
        } else {
            return [
                {
                    nombre: "Temperatura",
                    valor: `Promedio: ${info.promedioTemperatura.toFixed(2)} °C\nMáx: ${info.maxTemperatura.toFixed(2)} °C\nMín: ${info.minTemperatura.toFixed(2)} °C`,
                    icono: temperaturaIcon,
                    unidad: "°C",
                    color: chartColors[0],
                    detalles: []
                },
                {
                    nombre: "Humedad",
                    valor: `Promedio: ${info.promedioHumedad.toFixed(2)} %`,
                    icono: humedadIcon,
                    unidad: "%",
                    color: chartColors[1],
                    detalles: []
                },
                {
                    nombre: "Presión",
                    valor: `Promedio: ${info.promedioPresion.toFixed(2)} hPa`,
                    icono: presionIcon,
                    unidad: "hPa",
                    color: chartColors[2],
                    detalles: []
                },
                {
                    nombre: "Lluvia",
                    valor: `Suma: ${info.sumaLluvia.toFixed(2)} mm`,
                    icono: lluviaIcon,
                    unidad: "mm",
                    color: chartColors[3],
                    detalles: []
                },
            ];
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
                <Spinner animation="border" role="status" style={{ width: '3rem', height: '3rem', margin:'10px' }}>
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
                    <div key={index} className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4 d-flex align-items-stretch">
                        <div
                            className="card custom-card p-3 shadow-sm w-100 d-flex justify-content-center align-items-center"
                            style={{ borderTop: `8px solid ${variable.color}`, height: '260px', textAlign: 'center' }}
                        >
                            <img src={variable.icono} alt={`${variable.nombre} Icono`} className="icono-variable" style={{ width: '80px', height: '80px' }} />
                            <h5 className="variable-title mt-2"><strong>{variable.nombre}</strong></h5>
                            <p className="mb-0" style={{ fontSize: '14px', color: '#787A91' }}><strong>Medida: </strong>{variable.unidad}</p>
                            
                            {filtro.tipo !== "mensual" && (
                                <div className="valor-variable mt-3 text-left">
                                    {variable.valor.split('\n').map((line, i) => (
                                        <p key={i} style={{ margin: 0, fontSize: '16px' }}>{line}</p>
                                    ))}
                                </div>
                            )}
                            
                            {filtro.tipo === "mensual" && (
                                <Button className="btn btn-primary custom-button-filtro" onClick={() => handleShowModal(variable.nombre, variable.detalles, variable.unidad)} style={{marginTop:'10px'}}>Ver detalle</Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header style={{background:'var(--blue-unl)'}}>
                    <Modal.Title style={{color:'var(--white)', fontWeight:'bold'}}>{tituloModal}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        {detalleMes.map((detalle, index) => (
                            <div key={index} className="row border-bottom py-2">
                                <div className="col-12 col-md-4"><strong>{detalle.mes}</strong></div>
                                <div className="col-12 col-md-8">
                                    <p>
                                        <strong>Promedio:</strong> {detalle.promedio?.toFixed(2) || detalle.total?.toFixed(2)} {unidad}
                                    </p>
                                    {detalle.max && <p><strong>Máx:</strong> {detalle.max.toFixed(2)} °C</p>}
                                    {detalle.min && <p><strong>Mín:</strong> {detalle.min.toFixed(2)} °C</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer style={{background:'var(--blue-unl)'}}>
                    <Button variant="btn btn-light" onClick={handleCloseModal}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default MedidasDinamicas;
