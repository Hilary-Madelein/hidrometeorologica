import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { borrarSesion, getToken } from '../utils/SessionUtil';
import '../css/Medidas_Style.css';
import temperaturaIcon from '../img/temperatura.png';
import presionIcon from '../img/presion.png';
import lluviaIcon from '../img/lluvia.png';
import nivelAguaIcon from '../img/nivelAgua.png';
import humedadIcon from '../img/humedad.png';
import { ObtenerGet } from '../hooks/Conexion';
import mensajes from '../utils/Mensajes';

const variableConfig = [
    { nombre: 'Temperatura', color: '#FF6384', icono: temperaturaIcon },
    { nombre: 'Lluvia diaria', color: '#FFCE56', icono: lluviaIcon },
    { nombre: 'Humedad Relativa', color: '#36A2EB', icono: humedadIcon },
    { nombre: 'Nivel de Agua', color: '#4BC0C0', icono: nivelAguaIcon },
    { nombre: 'Presión atmosférica', color: '#9966FF', icono: presionIcon },
];

function MedidasDinamicas() {
    const [variables, setVariables] = useState([]);  // Inicializamos con un array vacío
    const [loading, setLoading] = useState(true);    // Indicador de carga
    const [progress, setProgress] = useState(0);     // Estado de la barra de progreso
    const navigate = useNavigate();

    const esMedidaValida = (clave, valor) => {
        const propiedadesExcluidas = ["Fecha_local_UTC-5", "deviceId", "id", "_rid", "_self", "_etag", "_attachments", "_ts"];
        return typeof valor === 'number' && !propiedadesExcluidas.includes(clave);
    };

    const extraerMedidas = (info) => {
        return Object.keys(info)
            .filter(clave => esMedidaValida(clave, info[clave]))
            .map(clave => ({
                nombre: clave,
                valor: info[clave]
            }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setProgress(0);  // Reinicia la barra de progreso
                const interval = setInterval(() => {
                    setProgress((prev) => (prev < 80 ? prev + 10 : prev));  // Aumenta el progreso
                }, 200);

                const info = await ObtenerGet(getToken(), '/listar/ultimaMedida');
                if (info.code !== 200) {
                    if (info.msg === 'Acceso denegado. Token ha expirado') {
                        mensajes(info.msg, 'error');
                        borrarSesion();
                        navigate("/login");
                    } else {
                        mensajes(info.msg, 'error');
                    }
                } else {
                    const medidas = extraerMedidas(info.info);
                    console.log("Medidas extraídas:", medidas);
                    setVariables(medidas);
                }
                clearInterval(interval);
                setProgress(100);  // Completa el progreso cuando los datos se obtienen correctamente
            } catch (error) {
                mensajes("Error al cargar los datos: " + error.message, 'error');
            } finally {
                setLoading(false);  // Detenemos el indicador de carga
            }
        };

        fetchData();
    }, [navigate]);

    const renderProgressBar = () => (
        <div className="progress-container">
            <div className="modern-progress-bar">
                <div
                    className={`progress-bar progress-bar-striped progress-bar-animated bg-info`} // Puedes cambiar el color según prefieras
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

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                {renderProgressBar()}
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="row mb-4">
                <div className="col text-left">
                    <h2 className="titulo-variables">Variables Hidrometeorológicas</h2>
                </div>
            </div>
            <div className="row mb-4 justify-content-center"> {/* Centrado automático cuando hay pocas tarjetas */}
                {variables.map((variable, index) => (
                    <div key={index} className="col-lg-3 col-md-4 col-sm-6 col-6 mb-4 d-flex align-items-stretch justify-content-center">
                        <div className="card text-center p-3 shadow-sm w-100" style={{ minWidth: '150px', maxWidth: '300px' }}>
                            <img src={variable.icono || humedadIcon} alt={`${variable.nombre} Icono`} className="img-fluid mx-auto mb-3" />
                            <h5 className="mb-2 variable-title"><strong>{variable.nombre}</strong></h5>
                            <h3 className="mb-0 variable-value" style={{ color: variable.color || '#000' }}>
                                {variable.valor}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MedidasDinamicas;
