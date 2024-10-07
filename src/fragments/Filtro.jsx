import React, { useState } from 'react';
import '../css/Filtro_Style.css';
import '../css/Principal_Style.css'

function Filtro({ onFiltrar }) {
    const [filtroSeleccionado, setFiltroSeleccionado] = useState('15min');
    const [mesSeleccionado, setMesSeleccionado] = useState('01');
    const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

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
        let datosFiltro = { tipo: filtroSeleccionado };

        if (filtroSeleccionado === 'rangoFechas') {
            datosFiltro = { ...datosFiltro, fechaInicio, fechaFin };
        } else if (filtroSeleccionado === 'mesAnio') {
            datosFiltro = { ...datosFiltro, mesSeleccionado, anioSeleccionado };
        }

        onFiltrar(datosFiltro);
    };

    const mostrarCamposAdicionales = filtroSeleccionado === 'rangoFechas' || filtroSeleccionado === 'mesAnio';

    return (
        <div className="container-fluid">
            <div className="text-left mt-4">
                <h4 style={{ fontWeight: '700', color: '#7D7C7C', fontSize:'16px', textAlign:'initial'}}>
                    Seleccione un filtro para observar información.
                </h4>
            </div>
            <div className="container py-4">
                <div className="row justify-content-center">

                    <div className="col-12 mb-4 text-center">
                        {['15min', '30min', 'hora', 'diaria', 'mensual', 'rangoFechas', 'mesAnio'].map((opcion, idx) => (
                            <div className="form-check form-check-inline" key={idx}>
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="tipoFiltro"
                                    id={opcion}
                                    value={opcion}
                                    checked={filtroSeleccionado === opcion}
                                    onChange={manejarCambioFiltro}
                                />
                                <label className="form-check-label" htmlFor={opcion} style={{ fontWeight: '400' }}>
                                    {opcion === '15min' ? 'Últimos 15 minutos' : opcion === '30min' ? 'Últimos 30 minutos' : opcion === 'rangoFechas' ? 'Rango de fechas' : opcion === 'mesAnio' ? 'Mes y Año' : opcion.charAt(0).toUpperCase() + opcion.slice(1)}
                                </label>
                            </div>
                        ))}
                    </div>

                    {/* Mostrar inputs adicionales según el filtro */}
                    {filtroSeleccionado === 'rangoFechas' && (
                        <>
                            <div className="col-md-6 mb-3" style={{ fontWeight: '700', color: '#0C2840', fontSize: '20px' }}>
                                <label htmlFor="fecha-inicio" className="form-label">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-calendar-range" viewBox="0 0 16 16" style={{ color: "#0C2840", margin: '5px' }}>
                                        <path d="M9 7a1 1 0 0 1 1-1h5v2h-5a1 1 0 0 1-1-1M1 9h4a1 1 0 0 1 0 2H1z" />
                                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                    </svg>
                                    Fecha inicio:
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="fecha-inicio"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                    max={obtenerFechaActual()} // Restringir a la fecha actual o menor
                                />
                            </div>

                            <div className="col-md-6 mb-3" style={{ fontWeight: '700', color: '#0C2840', fontSize: '20px' }}>
                                <label htmlFor="fecha-fin" className="form-label">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-calendar-range" viewBox="0 0 16 16" style={{ color: "#0C2840", margin: '5px' }}>
                                        <path d="M9 7a1 1 0 0 1 1-1h5v2h-5a1 1 0 0 1-1-1M1 9h4a1 1 0 0 1 0 2H1z" />
                                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                    </svg>
                                    Fecha fin:
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="fecha-fin"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                    max={obtenerFechaActual()} // Restringir a la fecha actual o menor
                                />
                            </div>
                        </>
                    )}

                    {filtroSeleccionado === 'mesAnio' && (
                        <>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="mes" className="form-label" style={{ fontWeight: '700', color: '#0C2840', fontSize: '20px' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-calendar-month" viewBox="0 0 16 16" style={{ color: "#0C2840", margin: '5px' }}>
                                        <path d="M2.56 11.332 3.1 9.73h1.984l.54 1.602h.718L4.444 6h-.696L1.85 11.332zm1.544-4.527L4.9 9.18H3.284l.8-2.375zm5.746.422h-.676V9.77c0 .652-.414 1.023-1.004 1.023-.539 0-.98-.246-.98-1.012V7.227h-.676v2.746c0 .941.606 1.425 1.453 1.425.656 0 1.043-.28 1.188-.605h.027v.539h.668zm2.258 5.046c-.563 0-.91-.304-.985-.636h-.687c.094.683.625 1.199 1.668 1.199.93 0 1.746-.527 1.746-1.578V7.227h-.649v.578h-.019c-.191-.348-.637-.64-1.195-.64-.965 0-1.64.679-1.64 1.886v.34c0 1.23.683 1.902 1.64 1.902.558 0 1.008-.293 1.172-.648h.02v.605c0 .645-.423 1.023-1.071 1.023m.008-4.53c.648 0 1.062.527 1.062 1.359v.253c0 .848-.39 1.364-1.062 1.364-.692 0-1.098-.512-1.098-1.364v-.253c0-.868.406-1.36 1.098-1.36z" />
                                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                    </svg>
                                    Mes:</label>
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

                            <div className="col-md-6 mb-3">
                                <label htmlFor="anio" className="form-label" style={{ fontWeight: '700', color: '#0C2840', fontSize: '20px' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-calendar-date" viewBox="0 0 16 16" style={{ color: "#0C2840", margin: '5px' }}>
                                        <path d="M6.445 11.688V6.354h-.633A13 13 0 0 0 4.5 7.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23" />
                                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                    </svg>
                                    Año:</label>
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
                    {mostrarCamposAdicionales && (
                        <div className="col-12 text-end">
                            <button
                                type="button"
                                className="btn btn-primary custom-button-filtro"
                                onClick={manejarFiltrado}
                            >
                                Filtrar datos
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Filtro;
