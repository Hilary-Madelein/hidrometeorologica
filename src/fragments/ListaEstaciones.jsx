import { useNavigate, useParams } from 'react-router-dom';
import { getToken, borrarSesion } from '../utils/SessionUtil';
import mensajes from '../utils/Mensajes';
import '../css/Table_Style.css';
import 'boxicons';
import Header from './Header';
import { ObtenerGet, URLBASE } from '../hooks/Conexion';
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import AgregarEstacion from '../fragments/AgregarEstacion'


const ListaEstaciones = () => {
    const navegation = useNavigate();
    const { external_id } = useParams();

    // DATOS
    const [data, setData] = useState([]);
    const [estacionObtenida, setEstacionObtenida] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = () => setShowEdit(true);

    //SHOW AGREGAR
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        ObtenerGet(getToken(), `/obtener/estacion/${external_id}`).then((info) => {
            if (info.code !== 200 && info.msg === 'Acceso denegado. Token ha expirado') {
                borrarSesion();
                mensajes(info.msg);
                navegation("/admin");
            } else {
                setData(info.info);
            }
        });
    }, [navegation]);

    // ACCION HABILITAR EDICION CAMPOS
    const handleChange = e => {
        const { name, value } = e.target;
        setEstacionObtenida((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }
    

    return (
        <div>
            <Header />
            <div className="container-microcuenca shadow-lg rounded p-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1 style={{ fontWeight: 'bold', color: '#0C2840' }}>Estaciones Registradas</h1>
                    <button type="button" class="btn btn-outline-success" onClick={handleShow}>Agregar Estación</button>
                </div>
                <div className="containerUsuarios">
                    <main className="table">
                        <section className="table_body">
                            {data.length === 0 ? (
                                <h5>
                                    No existen estaciones registradas.
                                </h5>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Foto</th>
                                                <th>Nombre</th>
                                                <th>Estado</th>
                                                <th>Descripción</th>
                                                <th>Longitud</th>
                                                <th>Latitud</th>
                                                <th>Altitud</th>
                                                <th>Tipo</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((estacion) => (
                                                <tr key={estacion.id}>
                                                    <td className="text-center" style={{ backgroundColor: "#FFFFFF", border: "none" }}>
                                                        <img src={URLBASE + "/images/estaciones/" + data[0].foto} alt="Estacion" style={{ width: '50px', height: '50px' }} />
                                                    </td>
                                                    <td>{estacion.nombre}</td>
                                                    <td>
                                                        {estacion.estado === 'OPERATIVA' ? 'OPERATIVA' : estacion.estado === 'MANTENIMIENTO' ? 'MANTENIMIENTO' : 'NO OPERATIVA'}
                                                    </td>
                                                    <td>{estacion.descripcion}</td>
                                                    <td>{estacion.longitud}</td>
                                                    <td>{estacion.latitud}</td>
                                                    <td>{estacion.altitud}</td>
                                                    <td>{estacion.tipo}</td>
                                                    <td className="text-center">
                                                        <Button variant="btn btn-outline-info btn-rounded">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                                            </svg>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    </main>
                </div>
            </div>
            {/* < VENTANA MODAL AGREGAR> */}
            <div className="model_box">
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header style={{ background: '#0C2840' }}>
                        <Modal.Title style={{ fontWeight: 'bold', color: 'white' }}>Agregar Estación</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <AgregarEstacion external_id={external_id} />
                    </Modal.Body>
                    <Modal.Footer style={{ background: '#0C2840' }}>
                        <Button variant="secondary" onClick={() => { handleClose(); }} style={{ fontWeight: 'bold', color: 'white' }}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

        </div>

    );
}

export default ListaEstaciones;
