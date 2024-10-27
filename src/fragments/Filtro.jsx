import React, { useEffect, useState } from 'react';
import '../css/Filtro_Style.css';
import '../css/Principal_Style.css';
import { getToken, borrarSesion } from '../utils/SessionUtil';
import { ObtenerGet } from '../hooks/Conexion';
import { useNavigate } from 'react-router-dom';

function Filtro({ onFiltrar }) {
    const [filtroSeleccionado, setFiltroSeleccionado] = useState('15min');
    const [mesSeleccionado, setMesSeleccionado] = useState('01');
    const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [estacionSeleccionada, setEstacionSeleccionada] = useState('');
    const [data, setData] = useState([]);
    const navegation = useNavigate();

    const manejarCambioFiltro = (event) => {
        const nuevoFiltro = event.target.value;
        setFiltroSeleccionado(nuevoFiltro);

        if (['15min', '30min', 'hora', 'diaria', 'mensual'].includes(nuevoFiltro)) {
            onFiltrar({ tipo: nuevoFiltro });
        }
    };

    const meses = [
        { valor: '01', nombre: 'Enero' },
        { valor: '02', nombre: 'Febrero' },
        { valor: '03', nombre: 'Marzo' },
        { valor: '04', nombre: 'Abril' },
        { valor: '05', nombre: 'Mayo' },
        { valor: '06', nombre: 'Junio' },
        { valor: '07', nombre: 'Julio' },
        { valor: '08', nombre: 'Agosto' },
        { valor: '09', nombre: 'Septiembre' },
        { valor: '10', nombre: 'Octubre' },
        { valor: '11', nombre: 'Noviembre' },
        { valor: '12', nombre: 'Diciembre' },
    ];

    const anios = Array.from(new Array(100), (val, index) => new Date().getFullYear() - index);

    const obtenerFechaActual = () => {
        const hoy = new Date();
        const dia = String(hoy.getDate()).padStart(2, '0');
        const mes = String(hoy.getMonth() + 1).padStart(2, '0');
        const anio = hoy.getFullYear();
        return `${anio}-${mes}-${dia}`;
    };

    const manejarFiltrado = () => {
        let datosFiltro = { tipo: filtroSeleccionado, estacion: estacionSeleccionada };

        if (filtroSeleccionado === 'rangoFechas') {
            datosFiltro = { ...datosFiltro, fechaInicio, fechaFin };
        } else if (filtroSeleccionado === 'mesAnio') {
            datosFiltro = { ...datosFiltro, mesSeleccionado, anioSeleccionado };
        }

        onFiltrar(datosFiltro);
    };

    const mostrarCamposAdicionales = filtroSeleccionado === 'rangoFechas' || filtroSeleccionado === 'mesAnio';

    useEffect(() => {
        ObtenerGet(getToken(), '/listar/estacion/operativas').then((info) => {
            if (info.code !== 200 && info.msg === 'Acceso denegado. Token ha expirado') {
                borrarSesion();
                navegation("/admin");
            } else {
                setData(info.info);
            }
        });
    }, [navegation]);

    return (
        <div className="container-fluid">
            <div className="text-left mt-4">
                <h4 style={{ fontWeight: '700', color: '#7D7C7C', fontSize: '16px', textAlign: 'initial' }}>
                    Seleccione un filtro para observar información.
                </h4>
            </div>

            <div className={`filtro-container ${mostrarCamposAdicionales ? 'columna' : ''}`}>
                {/* Filtro por tipo */}
                <div className="filtro-item">
                    <label htmlFor="filtro" className="form-label" style={{ fontWeight: '700', color: '#0C2840', fontSize: '20px' }}>
                        Tipo de Filtro:
                    </label>
                    <select
                        id="filtro"
                        className="form-select"
                        value={filtroSeleccionado}
                        onChange={manejarCambioFiltro}
                    >
                        <option value="15min">Últimos 15 minutos</option>
                        <option value="30min">Últimos 30 minutos</option>
                        <option value="hora">Hora</option>
                        <option value="diaria">Diaria</option>
                        <option value="mensual">Mensual</option>
                        <option value="rangoFechas">Rango de Fechas</option>
                        <option value="mesAnio">Mes y Año</option>
                    </select>
                </div>

                {/* Combo box de estaciones */}
                <div className="filtro-item">
                    <label htmlFor="estacion" className="form-label" style={{ fontWeight: '700', color: '#0C2840', fontSize: '20px' }}>
                        Estación:
                    </label>
                    <select
                        id="estacion"
                        className="form-select"
                        value={estacionSeleccionada}
                        onChange={(e) => setEstacionSeleccionada(e.target.value)}
                    >
                        <option value="">Seleccione una estación</option>
                        {data.map((estacion) => (
                            <option key={estacion.id} value={estacion.id}>{estacion.nombre}</option>
                        ))}
                    </select>
                </div>

                {/* Mostrar inputs adicionales según el filtro */}
                {filtroSeleccionado === 'rangoFechas' && (
                    <>
                        <div className="filtro-item">
                            <label htmlFor="fecha-inicio" className="form-label" style={{ fontWeight: '700', color: '#0C2840', fontSize: '20px' }}>
                                Fecha inicio:
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                id="fecha-inicio"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                                max={obtenerFechaActual()}
                            />
                        </div>

                        <div className="filtro-item">
                            <label htmlFor="fecha-fin" className="form-label" style={{ fontWeight: '700', color: '#0C2840', fontSize: '20px' }}>
                                Fecha fin:
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                id="fecha-fin"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                                max={obtenerFechaActual()}
                            />
                        </div>
                    </>
                )}

                {filtroSeleccionado === 'mesAnio' && (
                    <>
                        <div className="filtro-item">
                            <label htmlFor="mes" className="form-label" style={{ fontWeight: '700', color: '#0C2840', fontSize: '20px' }}>
                                Mes:
                            </label>
                            <select
                                className="form-select"
                                value={mesSeleccionado}
                                onChange={(e) => setMesSeleccionado(e.target.value)}
                            >
                                {meses.map((mes) => (
                                    <option key={mes.valor} value={mes.valor}>{mes.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filtro-item">
                            <label htmlFor="anio" className="form-label" style={{ fontWeight: '700', color: '#0C2840', fontSize: '20px' }}>
                                Año:
                            </label>
                            <select
                                className="form-select"
                                value={anioSeleccionado}
                                onChange={(e) => setAnioSeleccionado(e.target.value)}
                            >
                                {anios.map((anio) => (
                                    <option key={anio} value={anio}>{anio}</option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                {/* Botón de Filtrar */}
                <div className="filtro-item" style={{ display: mostrarCamposAdicionales ? 'block' : 'none', marginTop: '40px' }}>
                    <button
                        type="button"
                        className="btn btn-primary custom-button-filtro"
                        onClick={manejarFiltrado}
                    >
                        Filtrar datos
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Filtro;
