import React from 'react';
import '../css/Medidas_Style.css';
import temperaturaIcon from '../img/temperatura.png';
import presionIcon from '../img/presion.png';
import lluviaIcon from '../img/lluvia.png';
import nivelAguaIcon from '../img/nivelAgua.png';
import humedadIcon from '../img/humedad.png';

function Medidas() {
    return (
        <div className="container-fluid">
            <div className="row mb-4" style={{backgroundColor: "#686D76"}}>
                <div className="col text-center">
                    <h2 style={{fontWeight:'bold', color:"white"}}>Variables Hidrometeorológicas</h2>
                </div>
            </div>

            {/* Distribuir las cards en una fila ocupando todo el ancho */}
            <div className="row mb-4 justify-content-between">
                <div className="col-lg-2 col-md-4 col-sm-6 mb-4 d-flex align-items-stretch">
                    <div className="card text-center p-3 shadow-sm w-100" style={{ minWidth: '280px' }}>
                        <img src={temperaturaIcon} alt="Temperatura Icono" className="img-fluid mx-auto mb-3" style={{ width: "80px" }} />
                        <h5 className="mb-2" style={{ color: "var(--blue-unl)", fontSize: '1.5rem' }}><strong>Temperatura</strong></h5>
                        <h3 className="mb-0" style={{ color: "#219C90", fontWeight: 'bold', fontSize: '2rem' }}>
                            24°C
                        </h3>
                    </div>
                </div>

                <div className="col-lg-2 col-md-4 col-sm-6 mb-4 d-flex align-items-stretch">
                    <div className="card text-center p-3 shadow-sm w-100" style={{ minWidth: '280px' }}>
                        <img src={lluviaIcon} alt="Lluvia Icono" className="img-fluid mx-auto mb-3" style={{ width: "80px" }} />
                        <h5 className="mb-2" style={{ color: "var(--blue-unl)", fontSize: '1.5rem' }}><strong>Lluvia diaria</strong></h5>
                        <h3 className="mb-0" style={{ color: "#E9B824", fontWeight: 'bold', fontSize: '2rem' }}>
                            15 mm
                        </h3>
                    </div>
                </div>

                <div className="col-lg-2 col-md-4 col-sm-6 mb-4 d-flex align-items-stretch">
                    <div className="card text-center p-3 shadow-sm w-100" style={{ minWidth: '280px' }}>
                        <img src={humedadIcon} alt="Humedad Icono" className="img-fluid mx-auto mb-3" style={{ width: "80px" }} />
                        <h5 className="mb-2" style={{ color: "var(--blue-unl)", fontSize: '1.5rem' }}><strong>Humedad Relativa</strong></h5>
                        <h3 className="mb-0" style={{ color: "#EE9322", fontWeight: 'bold', fontSize: '2rem' }}>
                            65%
                        </h3>
                    </div>
                </div>

                <div className="col-lg-2 col-md-4 col-sm-6 mb-4 d-flex align-items-stretch">
                    <div className="card text-center p-3 shadow-sm w-100" style={{ minWidth: '280px' }}>
                        <img src={nivelAguaIcon} alt="Nivel de Agua Icono" className="img-fluid mx-auto mb-3" style={{ width: "80px" }} />
                        <h5 className="mb-2" style={{ color: "var(--blue-unl)", fontSize: '1.5rem' }}><strong>Nivel de Agua</strong></h5>
                        <h3 className="mb-0" style={{ color: "#D83F31", fontWeight: 'bold', fontSize: '2rem' }}>
                            10 cm
                        </h3>
                    </div>
                </div>

                <div className="col-lg-2 col-md-4 col-sm-6 mb-4 d-flex align-items-stretch">
                    <div className="card text-center p-3 shadow-sm w-100" style={{ minWidth: '280px' }}>
                        <img src={presionIcon} alt="Presión Icono" className="img-fluid mx-auto mb-3" style={{ width: "70px" }} />
                        <h5 className="mb-2" style={{ color: "var(--blue-unl)", fontSize: '1.5rem' }}><strong>Presión atmosférica</strong></h5>
                        <h3 className="mb-0" style={{ color: "#8EAC50", fontWeight: 'bold', fontSize: '2rem' }}>
                            12 hPa
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Medidas;
