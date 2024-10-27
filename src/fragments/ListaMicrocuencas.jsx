import { borrarSesion } from '../utils/SessionUtil';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from '../utils/SessionUtil';
import mensajes from '../utils/Mensajes';
import '../css/Table_Style.css';
import 'boxicons';
import Header from './Header';
import { ObtenerGet } from '../hooks/Conexion';
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import AgregarMicrocuenca from '../fragments/AgregarMicrocuenca'


const ListaMicrocuencas = () => {
    const navegation = useNavigate();

    // DATOS
    const [data, setData] = useState([]);
    const [microcuencaObtenida, setMicrocuencaObtenida] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = () => setShowEdit(true);

    //SHOW AGREGAR
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        ObtenerGet(getToken(), '/listar/microcuenca').then((info) => {
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
        setMicrocuencaObtenida((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    const obtenerId = (external_id) => {
        navegation(`/estaciones/${external_id}`);
    };

    return (
        <div>
            <Header />
            <div className="container-microcuenca shadow-lg rounded p-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1 style={{ fontWeight: 'bold', color: '#0C2840' }}>Microcuencas Registradas</h1>
                    <button type="button" class="btn btn-outline-success" onClick={handleShow}>Agregar Microcuenca</button>
                </div>
                <div className="containerUsuarios">
                    <main className="table">
                        <section className="table_body">
                            {data.length === 0 ? (
                                <h5>
                                    No existen microcuencas registradas.
                                </h5>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Estado</th>
                                                <th>Descripción</th>
                                                <th>Estaciones</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((microcuenca) => (
                                                <tr key={microcuenca.id}>
                                                    <td>{microcuenca.nombre}</td>
                                                    <td>{microcuenca.estado ? 'ACTIVO' : 'DESACTIVO'}</td>
                                                    <td>{microcuenca.descripcion}</td>
                                                    <td className="text-center">
                                                        <Button variant="btn btn-outline-success btn-rounded" onClick={() => obtenerId(microcuenca.external_id)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pin-map-fill" viewBox="0 0 16 16">
                                                                <path fillRule="evenodd" d="M3.1 11.2a.5.5 0 0 1 .4-.2H6a.5.5 0 0 1 0 1H3.75L1.5 15h13l-2.25-3H10a.5.5 0 0 1 0-1h2.5a.5.5 0 0 1 .4.2l3 4a.5.5 0 0 1-.4.8H.5a.5.5 0 0 1-.4-.8z" />
                                                                <path fillRule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999z" />
                                                            </svg>
                                                        </Button>
                                                    </td>
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
                        <Modal.Title style={{ fontWeight: 'bold', color: 'white' }}>Agregar Microcuenca
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <AgregarMicrocuenca />

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

export default ListaMicrocuencas;
