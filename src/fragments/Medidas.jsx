import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { borrarSesion, getToken } from '../utils/SessionUtil';
import mensajes from '../utils/Mensajes';
import { ObtenerPost } from '../hooks/Conexion';
import '../css/Medidas_Style.css';
import Spinner from 'react-bootstrap/Spinner';
import temperaturaIcon from '../img/temperatura.png';
import presionIcon from '../img/presion.png';
import lluviaIcon from '../img/lluvia.png';
import humedadIcon from '../img/humedad.png';

const chartColors = ['#362FD9', '#1AACAC', '#DB005B', '#19A7CE', '#DF2E38', '#8DCBE6'];

function MedidasDinamicas({ filtro }) {
    const [variables, setVariables] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!filtro || (!filtro.fechaInicio && !filtro.mesSeleccionado && !filtro.tipo)) {
                setVariables([]);
                return;
            }

            setLoading(true);
            const body = {};

            try {
                if (filtro.tipo === "15min" || filtro.tipo === "30min" || filtro.tipo === "diaria" || filtro.tipo === "hora") {
                    body.escalaDeTiempo = filtro.tipo;
                } else if (filtro.tipo === "mesAnio") {
                    body.mes = filtro.mesSeleccionado;
                    body.anio = filtro.anioSeleccionado;
                } else if (filtro.tipo === "rangoFechas") {
                    body.fechaInicio = new Date(filtro.fechaInicio).toISOString();
                    body.fechaFin = new Date(filtro.fechaFin).toISOString();
                }

                const url = '/listar/medidas/escala';
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
        return [
            {
                nombre: "Temperatura",
                valor: `Promedio: ${info.promedioTemperatura.toFixed(2)} °C\nMáx: ${info.maxTemperatura.toFixed(2)} °C\nMín: ${info.minTemperatura.toFixed(2)} °C`,
                icono: temperaturaIcon,
                unidad: "°C",
                color: chartColors[0],
            },
            {
                nombre: "Humedad",
                valor: `Promedio: ${info.promedioHumedad.toFixed(2)} %`,
                icono: humedadIcon,
                unidad: "%",
                color: chartColors[1],
            },
            {
                nombre: "Presión",
                valor: `Promedio: ${info.promedioPresion.toFixed(2)} hPa`,
                icono: presionIcon,
                unidad: "hPa",
                color: chartColors[2],
            },
            {
                nombre: "Lluvia",
                valor: `Suma: ${info.sumaLluvia.toFixed(2)} mm`,
                icono: lluviaIcon,
                unidad: "mm",
                color: chartColors[3],
            },
        ];
    };

    const generarMensajePeriodo = () => {
        if (!filtro) return '';

        if (filtro.tipo === 'mesAnio') {
            const mes = new Date(0, filtro.mesSeleccionado - 1).toLocaleString('es-ES', { month: 'long' });
            return `Periodo de tiempo: ${mes} ${filtro.anioSeleccionado}`;
        } else if (filtro.tipo === 'rangoFechas') {
            const fechaInicio = new Date(filtro.fechaInicio).toLocaleDateString('es-ES');
            const fechaFin = new Date(filtro.fechaFin).toLocaleDateString('es-ES');
            return `Periodo de tiempo: Desde ${fechaInicio} hasta ${fechaFin}`;
        } else if (filtro.tipo === 'mensual') {
            return `Datos de todos los meses`;
        } else if (["15min", "30min", "hora", "diaria"].includes(filtro.tipo)) {
            const fecha = new Date(filtro.fechaInicio || new Date()).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            });
            return `Datos desde ${fecha}`;
        }

        return '';
    };

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
            <div className="info bg-white p-4 rounded shadow-sm" style={{ marginBottom: 20, borderColor:'#f1f1f1' }}>
                <div className="d-flex justify-content-start align-items-center mb-2">
                    <i className="fas fa-info-circle text-primary mr-2" style={{ fontSize: '1.5rem' }}></i>
                    <h4 className="m-0 text-dark" style={{ fontWeight: '700', color: '#0C2840' }}>
                        Información presentada:
                    </h4>
                </div>

                {filtro && (
                    <div className="d-flex flex-column flex-md-row justify-content-start align-items-md-center mb-2">
                        <div className="mr-3">
                            <span className="font-weight-bold text-dark">{generarMensajePeriodo()}</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="row mb-4 justify-content-center">
                {variables.map((variable, index) => (
                    <div key={index} className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4 d-flex align-items-stretch">
                        <div
                            className="card custom-card p-3 shadow-sm w-100 d-flex justify-content-start align-items-center"
                            style={{ border: `3px solid ${variable.color}`, height: '260px' }} // Ajustar la altura aquí
                        >
                            <img src={variable.icono} alt={`${variable.nombre} Icono`} className="icono-variable" style={{ width: '80px', height: '80px' }} />
                            <div className="text-left ml-3 d-flex flex-column justify-content-center" style={{ flex: 1 }}>
                                <h5 className="variable-title"><strong>{variable.nombre}</strong></h5>
                                <p className="mb-0" style={{ fontSize: '14px', color: '#787A91' }}><strong>Medida: </strong>{variable.unidad}</p>
                            </div>
                            <div className="valor-variable mt-3 text-right" style={{ flex: 1 }}>
                                {variable.nombre === "Temperatura" ? (
                                    <pre className="variable-value" style={{ whiteSpace: "pre-wrap", fontSize: '16px' }}>{variable.valor}</pre>
                                ) : (
                                    <h3 className="variable-value" style={{ fontSize: '18px' }}>{variable.valor}</h3>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MedidasDinamicas;
