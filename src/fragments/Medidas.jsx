import React, { useEffect, useState } from 'react';
import '../css/Medidas_Style.css';
import temperaturaIcon from '../img/temperatura.png';
import presionIcon from '../img/presion.png';
import lluviaIcon from '../img/lluvia.png';
import nivelAguaIcon from '../img/nivelAgua.png';
import humedadIcon from '../img/humedad.png';

// Simulación de llamada a la API que obtiene las variables meteorológicas
const obtenerVariablesMeteorologicas = async () => {
    return [
        { nombre: 'Temperatura', valor: '24°C', color: '#FF6384', icono: temperaturaIcon },
        { nombre: 'Lluvia diaria', valor: '15 mm', color: '#FFCE56', icono: lluviaIcon },
        { nombre: 'Humedad Relativa', valor: '65%', color: '#36A2EB', icono: humedadIcon },
        { nombre: 'Nivel de Agua', valor: '10 cm', color: '#4BC0C0', icono: nivelAguaIcon },
        { nombre: 'Presión atmosférica', valor: '12 hPa', color: '#9966FF', icono: presionIcon },
    ];
};

function MedidasDinamicas() {
    const [variables, setVariables] = useState([]);

    // Llamar a la API cuando el componente se monte
    useEffect(() => {
        const cargarDatos = async () => {
            const data = await obtenerVariablesMeteorologicas();
            setVariables(data);  // Guardar las variables en el estado
        };
        cargarDatos();
    }, []);

    return (
        <div className="container-fluid">
            <div className="row mb-4">
                <div className="col text-left">
                    <h2 className="titulo-variables">Variables Hidrometeorológicas</h2>
                </div>
            </div>
            <div className="row mb-4 justify-content-between">
                {/* Recorrer las variables meteorológicas y crear una card por cada una */}
                {variables.map((variable, index) => (
                    <div key={index} className="col-lg-2 col-md-4 col-sm-6 col-6 mb-4 d-flex align-items-stretch">
                        <div className="card text-center p-3 shadow-sm w-100" style={{ minWidth: '120px', maxWidth: '260px' }}>
                            <img src={variable.icono} alt={`${variable.nombre} Icono`} className="img-fluid mx-auto mb-3" />
                            <h5 className="mb-2 variable-title"><strong>{variable.nombre}</strong></h5>
                            <h3 className="mb-0 variable-value" style={{ color: variable.color }}>
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
