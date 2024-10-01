import React, { useState } from 'react';
import '../css/Principal_Style.css';

function Filtro({ onFiltrar }) {
    const [filtroSeleccionado, setFiltroSeleccionado] = useState('diaria');  // Estado para controlar el tipo de filtro seleccionado
    const [mesSeleccionado, setMesSeleccionado] = useState('01');  // Estado para el mes seleccionado
    const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());  // Estado para el año seleccionado
    const [fechaInicio, setFechaInicio] = useState('');  // Estado para la fecha de inicio
    const [fechaFin, setFechaFin] = useState('');  // Estado para la fecha de fin

    // Función que se ejecuta cuando cambias el filtro (radio buttons)
    const manejarCambioFiltro = (event) => {
        const nuevoFiltro = event.target.value;
        setFiltroSeleccionado(nuevoFiltro);

        // Enviar automáticamente el filtro cuando se seleccionen las opciones 15min, 30min, hora o diaria
        if (['15min', '30min', 'hora', 'diaria', 'mensual'].includes(nuevoFiltro)) {
            onFiltrar({ tipo: nuevoFiltro });

        }
    };
    
    // Lista de meses
    const meses = [
        { valor: '1', nombre: 'Enero' },
        { valor: '2', nombre: 'Febrero' },
        { valor: '3', nombre: 'Marzo' },
        { valor: '4', nombre: 'Abril' },
        { valor: '5', nombre: 'Mayo' },
        { valor: '6', nombre: 'Junio' },
        { valor: '7', nombre: 'Julio' },
        { valor: '8', nombre: 'Agosto' },
        { valor: '9', nombre: 'Septiembre' },
        { valor: '10', nombre: 'Octubre' },
        { valor: '11', nombre: 'Noviembre' },
        { valor: '12', nombre: 'Diciembre' },
    ];

    const anios = Array.from(new Array(100), (val, index) => new Date().getFullYear() - index);

    // Función para manejar el evento del botón de filtrar
    const manejarFiltrado = () => {
        let datosFiltro = { tipo: filtroSeleccionado };

        if (filtroSeleccionado === 'rangoFechas') {
            datosFiltro = { ...datosFiltro, fechaInicio, fechaFin };
        } else if (filtroSeleccionado === 'mesAnio') {
            datosFiltro = { ...datosFiltro, mesSeleccionado, anioSeleccionado };
        }

        console.log("Datos del filtro enviados al padre:", datosFiltro);
        onFiltrar(datosFiltro);
    };

    // Verificar si se están mostrando los campos de fecha o mes/año
    const mostrarCamposAdicionales = filtroSeleccionado === 'rangoFechas' || filtroSeleccionado === 'mesAnio';

    return (
        <div className="container d-flex justify-content-between align-items-center py-4">
            <div className="row w-100 align-items-center">

                {/* Radio buttons para seleccionar tipo de filtro */}
                <div className="col-md-12 d-flex justify-content-center mb-4">
                    {['15min', '30min', 'hora', 'diaria', 'mensual', 'rangoFechas', 'mesAnio'].map((opcion, idx) => (
                        <div className="form-check form-check-inline" key={idx}>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="tipoFiltro"
                                id={opcion}
                                value={opcion}
                                checked={filtroSeleccionado === opcion}
                                onChange={manejarCambioFiltro}  // Llama a la función al cambiar el radio button
                            />
                            <label className="form-check-label" htmlFor={opcion} style={{fontWeight:'450'}}>
                                {opcion === '15min' ? 'Últimos 15 minutos' : opcion === '30min' ? 'Últimos 30 minutos' : opcion === 'rangoFechas' ? 'Rango de fechas' : opcion === 'mesAnio' ? 'Mes y Año' : opcion.charAt(0).toUpperCase() + opcion.slice(1)}
                            </label>
                        </div>
                    ))}
                </div>

                {/* Dependiendo del filtro seleccionado, mostramos los inputs correspondientes */}
                {filtroSeleccionado === 'rangoFechas' && (
                    <>
                        {/* Fecha inicio */}
                        <div className="col-md-4">
                            <label className="mb-2" htmlFor="fecha-inicio" style={{ fontWeight: 'bold', color: "var(--blue-unl)", marginLeft: '5px' }}>
                                Fecha inicio:
                            </label>
                            <input
                                type="date"
                                className="h-10 rounded-md border border-input px-3 py-2 text-sm w-100"
                                style={{ height: '48px' }}
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                            />
                        </div>

                        {/* Fecha fin */}
                        <div className="col-md-4">
                            <label className="mb-2" htmlFor="fecha-fin" style={{ fontWeight: 'bold', color: "var(--blue-unl)", marginLeft: '5px' }}>
                                Fecha fin:
                            </label>
                            <input
                                type="date"
                                className="h-10 rounded-md border border-input px-3 py-2 text-sm w-100"
                                style={{ height: '48px' }}
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                            />
                        </div>
                    </>
                )}

                {filtroSeleccionado === 'mesAnio' && (
                    <>
                        {/* Selección de Mes */}
                        <div className="col-md-4">
                            <label className="mb-2" htmlFor="mes" style={{ fontWeight: 'bold', color: "var(--blue-unl)", marginLeft: '5px' }} >
                                Mes:
                            </label>
                            <select
                                className="h-10 rounded-md border border-input px-3 py-2 text-sm w-100"
                                style={{ height: '48px' }}
                                value={mesSeleccionado}
                                onChange={(e) => setMesSeleccionado(e.target.value)}
                            >
                                {meses.map((mes) => (
                                    <option key={mes.valor} value={mes.valor}>{mes.nombre}</option>
                                ))}
                            </select>
                        </div>

                        {/* Selección de Año */}
                        <div className="col-md-4">
                            <label className="mb-2" htmlFor="anio" style={{ fontWeight: 'bold', color: "var(--blue-unl)", marginLeft: '5px' }}>
                                Año:
                            </label>
                            <select
                                className="h-10 rounded-md border border-input px-3 py-2 text-sm w-100"
                                style={{ height: '48px' }}
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
                    <div className="col-md-4 d-flex justify-content-end">
                        <button type="button" className="btn btn-primary custom-buton-filtro w-100 h-10 rounded" style={{ height: '48px', marginTop: '40px', backgroundColor: "var(--blue-unl)", border: 'none', fontWeight: 'bold' }}
                            onClick={manejarFiltrado}
                        >
                            Filtrar datos
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Filtro;
