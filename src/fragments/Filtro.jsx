import React, { useState } from 'react';
import '../css/Principal_Style.css';

function Filtro({ onFiltrar }) {
    const [filtroSeleccionado, setFiltroSeleccionado] = useState('rangoFechas');  // Estado para controlar el tipo de filtro seleccionado
    const [mesSeleccionado, setMesSeleccionado] = useState('01');  // Estado para el mes seleccionado
    const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());  // Estado para el año seleccionado
    const [fechaInicio, setFechaInicio] = useState('');  // Estado para la fecha de inicio
    const [fechaFin, setFechaFin] = useState('');  // Estado para la fecha de fin

    const manejarCambioFiltro = (event) => {
        setFiltroSeleccionado(event.target.value);
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
        const datosFiltro = filtroSeleccionado === 'rangoFechas'
            ? { tipo: 'rangoFechas', fechaInicio, fechaFin }
            : { tipo: 'mesAnio', mesSeleccionado, anioSeleccionado }; 

        console.log("Datos del filtro enviados al padre:", datosFiltro);

        console.log("REVISANDOOO", filtroSeleccionado);
        
        
        onFiltrar(datosFiltro);
    };

    return (
        <div className="container d-flex justify-content-between align-items-center py-4">
            <div className="row w-100 align-items-center">

                {/* Radio buttons para seleccionar tipo de filtro */}
                <div className="col-md-12 d-flex justify-content-center mb-4">
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="tipoFiltro"
                            id="rangoFechas"
                            value="rangoFechas"
                            checked={filtroSeleccionado === 'rangoFechas'}
                            onChange={manejarCambioFiltro}
                        />
                        <label className="form-check-label" htmlFor="rangoFechas">
                            Filtrar por rango de fechas
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="tipoFiltro"
                            id="mesAnio"
                            value="mesAnio"
                            checked={filtroSeleccionado === 'mesAnio'}
                            onChange={manejarCambioFiltro}
                        />
                        <label className="form-check-label" htmlFor="mesAnio">
                            Filtrar por mes y año
                        </label>
                    </div>
                </div>

                {/* Dependiendo del filtro seleccionado, mostramos los inputs correspondientes */}
                {filtroSeleccionado === 'rangoFechas' ? (
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
                ) : (
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
                <div className="col-md-4 d-flex justify-content-end">
                    <button type="button" className="btn btn-primary custom-buton-filtro w-100 h-10 rounded" style={{ height: '48px', marginTop: '40px', backgroundColor: "var(--blue-unl)", border: 'none', fontWeight: 'bold' }}
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
