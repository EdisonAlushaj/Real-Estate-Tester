import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TokaEndPoint } from '../Services/endpoints';
import Cookies from '../Services/cookieUtils.jsx';

const TokaCrud = () => {
    const [show, setShow] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleCloseAdd = () => setShowAdd(false);
    const handleShowAdd = () => setShowAdd(true);

    const [pronaID, setId] = useState('');
    const [emri, setEmri] = useState('');
    const [adresa, setAdresa] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');
    const [photo, setPhoto] = useState('');
    const [landType, setLandType] = useState('');
    const [zona, setZona] = useState('');
    const [topografiaTokes, setTopografiaTokes] = useState('');
    const [waterSource, setWaterSource] = useState(false);

    const [editId, setEditId] = useState('');
    const [editEmri, setEditEmri] = useState('');
    const [editAdresa, setEditAdresa] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editStatus, setEditStatus] = useState('');
    const [editType, setEditType] = useState('');
    const [editPhoto, setEditPhoto] = useState('');
    const [editLandType, setEditLandType] = useState('');
    const [editZona, setEditZona] = useState('');
    const [editTopografiaTokes, setEditTopografiaTokes] = useState('');
    const [editWaterSource, setEditWaterSource] = useState(false);

    const [data, setData] = useState([]);

    const getToken = () => {
        return Cookies.getTokenFromCookies();
    }

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios.get(TokaEndPoint, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        })
            .then((response) => {
                console.log(response);
                setData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    async function editToka(toka) {
        handleShow();

        setEditEmri(toka.emri);
        setEditAdresa(toka.adresa);
        setEditPrice(toka.price);
        setEditDescription(toka.description);
        setEditStatus(toka.status);
        setEditType(toka.type);
        setEditPhoto(toka.photo);
        setEditLandType(toka.landType);
        setEditZona(toka.zona);
        setEditTopografiaTokes(toka.topografiaTokes);
        setEditWaterSource(toka.waterSource);
        setEditId(toka.pronaID);
    }

    async function update(event) {
        event.preventDefault();
        try {
            let photoBase64 = editPhoto;

            // Convert file to base64 if it's a File object
            if (editPhoto instanceof File) {
                const reader = new FileReader();
                reader.readAsDataURL(editPhoto);
                photoBase64 = await new Promise((resolve, reject) => {
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });
            }

            await axios.put(`${TokaEndPoint}/${editId}`, {
                pronaID: editId,
                emri: editEmri,
                adresa: editAdresa,
                price: editPrice,
                description: editDescription,
                status: editStatus,
                type: editType,
                photo: photoBase64, // Send base64 string
                landType: editLandType,
                zona: editZona,
                topografiaTokes: editTopografiaTokes,
                waterSource: editWaterSource
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            toast.success('Toka updated successfully');
            handleClose();
            getData();
            clear();
        } catch (error) {
            console.error("Error updating Toka:", error);
            toast.error('Error updating Toka');
        }
    }

    const handelDelete = (id) => {
        if (window.confirm("Are you sure to delete this Apartment?")) {
            axios.delete(`${TokaEndPoint}/${id}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            })
                .then((result) => {
                    if (result.status === 200) {
                        toast.success('Apartment has been deleted');
                        getData();
                    }
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
    };

    const handleSave = () => {
        const formData = new FormData();
        formData.append('emri', emri);
        formData.append('adresa', adresa);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('status', status);
        formData.append('type', type);
        formData.append('photo', photo);
        formData.append('landType', landType);
        formData.append('zona', zona);
        formData.append('topografiaTokes', topografiaTokes);
        formData.append('waterSource', waterSource);

        axios.post(TokaEndPoint, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${getToken()}`,
            },
        })
            .then(() => {
                getData();
                clear();
                toast.success('Toka has been added.');
                handleCloseAdd();
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    const clear = () => {
        setEmri('');
        setAdresa('');
        setPrice('');
        setDescription('');
        setStatus('');
        setLandType('');
        setZona('');
        setTopografiaTokes('');
        setWaterSource(false);

        setEditEmri('');
        setEditAdresa('');
        setEditPrice('');
        setEditDescription('');
        setEditStatus('');
        setEditLandType('');
        setEditZona('');
        setEditTopografiaTokes('');
        setEditWaterSource(false);

        setEditId('');
    };

    return (
        <Fragment>
            <ToastContainer position="top-right" autoClose={5000} />
            <div className="d-flex justify-content-between align-items-center">
                <h2>Lands Table</h2>
                <Button variant="primary" onClick={handleShowAdd}>Add Land</Button>
            </div>

            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Prona ID</th>
                        <th>Emri</th>
                        <th>Adresa</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Land Type</th>
                        <th>Zona</th>
                        <th>Topografia Tokes</th>
                        <th>Water Source</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((toka) => (
                        <tr key={toka.pronaID}>
                            <td>{toka.pronaID}</td>
                            <td>{toka.emri}</td>
                            <td>{toka.adresa}</td>
                            <td>{toka.price}</td>
                            <td>{toka.description}</td>
                            <td>{toka.status}</td>
                            <td>{toka.landType}</td>
                            <td>{toka.zona}</td>
                            <td>{toka.topografiaTokes}</td>
                            <td>{toka.waterSource ? "Yes" : "No"}</td>
                            <td>
                                <Button variant="warning" onClick={() => editToka(toka)}>Edit</Button>{' '}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Add Apartment Modal */}
            <Modal show={showAdd} onHide={handleCloseAdd}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Land</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <input type="text" placeholder="Name" className="form-control" value={emri} onChange={(e) => setEmri(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="text" placeholder="Address" className="form-control" value={adresa} onChange={(e) => setAdresa(e.target.value)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <input type="number" placeholder="Price" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="text" placeholder="Description" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <select className="form-control" value={type} onChange={(e) => setType(e.target.value)}>
                                <option value="" disabled>Select Type</option>
                                <option value="Rent">Rent</option>
                                <option value="Sell">Sell</option>
                            </select>
                        </Col>
                        <Col>
                            <input type="text" placeholder="Land Type" className="form-control" value={landType} onChange={(e) => setLandType(e.target.value)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <input type="text" placeholder="Zone" className="form-control" value={zona} onChange={(e) => setZona(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="text" placeholder="Topography" className="form-control" value={topografiaTokes} onChange={(e) => setTopografiaTokes(e.target.value)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <input type="checkbox" checked={waterSource} onChange={(e) => setWaterSource(e.target.checked)} />
                            Has Water Source
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <input type="file" className="form-control" onChange={(e) => setPhoto(e.target.files[0])} />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAdd}>Close</Button>
                    <Button variant="primary" onClick={handleSave}>Save</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Apartment Modal */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Land</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <input type="text" placeholder="Name" className="form-control" value={editEmri} onChange={(e) => setEditEmri(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="text" placeholder="Address" className="form-control" value={editAdresa} onChange={(e) => setEditAdresa(e.target.value)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <input type="number" placeholder="Price" className="form-control" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="text" placeholder="Description" className="form-control" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <select className="form-control" value={editType} onChange={(e) => setEditType(e.target.value)}>
                                <option value="" disabled>Select Type</option>
                                <option value="Rent">Rent</option>
                                <option value="Sell">Sell</option>
                            </select>
                        </Col>
                        <Col>
                            <input type="text" placeholder="Land Type" className="form-control" value={editLandType} onChange={(e) => setEditLandType(e.target.value)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <input type="text" placeholder="Zona" className="form-control" value={editZona} onChange={(e) => setEditZona(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="text" placeholder="Topografia Tokes" className="form-control" value={editTopografiaTokes} onChange={(e) => setEditTopografiaTokes(e.target.value)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <input type="checkbox" checked={editWaterSource} onChange={(e) => setEditWaterSource(e.target.checked)} />
                            Has WaterSource
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <input type="file" className="form-control" onChange={(e) => setEditPhoto(e.target.files[0])} />
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

export default TokaCrud;
