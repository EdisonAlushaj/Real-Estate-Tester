import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { KontrataEndPoint } from '../Services/endpoints';
import Cookies from '../Services/cookieUtils.jsx';

const ContractsCrud = () =>{
    const [show, setShow] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleCloseAdd = () => setShowAdd(false);
    const handleShowAdd = () => setShowAdd(true);

    const [kontrataID, setKontrataID] = useState('');
    const [pronaID, setPronaID] = useState('');
    const [userID, setUserID] = useState('');
    const [koheZgjatja, setKoheZgjatja] = useState('');
    const [type, setType] = useState('');

    const [editKontrataID, setEditKontrataId] = useState('');
    const [editPronaID, setEditPronaId] = useState('');
    const [editUserID, setEditUserId] = useState('');
    const [editKoheZgjatja, setEditKoheZgjatja] = useState('');
    const [editType, setEditType] = useState('');

    const [data, setData] = useState([]);

    const getToken = () => {
        return Cookies.getTokenFromCookies();
    }

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const response = await axios.get(KontrataEndPoint, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
    
            console.log("Response:", response); // Shiko në konsolë të dhënat që merr
            // Sigurohuni që të keni të dhënat e duhura në response.data
            // Nëse backend-i kthen një array të kontratave, kjo mund të jetë OK
            if (response && response.data) {
                setData(response.data); // Vendos të dhënat në state
            }
        } catch (error) {
            console.log("Error:", error);
            toast.error("There was an error fetching the data.");
        }
    };

    async function editKontrata(kontrata) {
        handleShow();
        setEditPronaId(kontrata.pronaID);
        setEditUserId(kontrata.userID)
        setEditKoheZgjatja(kontrata.koheZgjatja);
        setEditType(kontrata.type);

    }

    async function update(event) {
        event.preventDefault();
        try {
            await axios.put(`${KontrataEndPoint}/${editKontrataID}`, {
                pronaID: editPronaID,
                userID: editUserID,
                kontrataID: editKontrataID,
                koheZgjatja: editKoheZgjatja,
                type: editType,
                
            }, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            toast.success('Toka updated successfully');
            handleClose();
            getData();
            clear();
        } catch (error) {
            console.error("Error updating apartment:", error);
        }
    }

    const handelDelete = (id) => {
        if (window.confirm("Are you sure to delete this Contract?")) {
            axios.delete(`${KontrataEndPoint}/${id}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            })
                .then((result) => {
                    if (result.status === 200) {
                        toast.success('Contract has been deleted');
                        getData();
                    }
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
    };
    const clear = () => {
        setPronaId('');
        setUserId('');
        setKoheZgjatja('');
        setType('');
        
        setEditPronaId('');
        setEditUserId('');
        setEditKoheZgjatja('');
        setEditType('');

        setEditKontrataId('');
    };

        return (
            <Fragment>
                <ToastContainer position="top-right" autoClose={5000} />
                <div className="d-flex justify-content-between align-items-center">
                    <h2>Contracts Table</h2>
                </div>
    
                <Table striped bordered hover className="mt-3">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Kohezgjatja</th>
                            <th>Type</th>
                            <th>PronaID</th>
                            <th>UserID</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((kontrata) => (
                            <tr key={kontrata.kontrataID}>
                                <td>{kontrata.kontrataID}</td>
                                <td>{kontrata.pronaID}</td>
                                <td>{kontrata.userID}</td>
                                <td>{kontrata.koheZgjatja}</td>
                                <td>{kontrata.type}</td>
                                <td>
                                    <Button variant="warning" onClick={() => editKontrata(kontrata)}>Edit</Button>{' '}
                                    <Button variant="danger" onClick={() => handelDelete(kontrata.kontrataID)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
    
            
    
                {/* Edit Apartment Modal */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Apartment</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Row>
                            <Col>
                                <input type="number" placeholder="Kohezgjatja" className="form-control" value={koheZgjatja} onChange={(e) => setEditKoheZgjatja(e.target.value)} />
                            </Col>
                            <Col>
                                <input type="text" placeholder="Type" className="form-control" value={type} onChange={(e) => setEditType(e.target.value)} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <input type="number" placeholder="PronaID" className="form-control" value={pronaID} onChange={(e) => setEditPronaID(e.target.value)} />
                            </Col>
                            <Col>
                                <input type="number" placeholder="UserId" className="form-control" value={userID} onChange={(e) => setEditUserID(e.target.value)} />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                        <Button variant="primary" onClick={update}>Update</Button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        );
    };
    
    export default ContractsCrud;

    





