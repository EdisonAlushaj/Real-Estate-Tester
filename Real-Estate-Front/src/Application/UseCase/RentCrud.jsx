import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { RentEndPoint } from '../Services/endpoints';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Cookies from '../Services/cookieUtils.jsx';

const RentCrud = () => {
    const [show, setShow] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleCloseAdd = () => setShowAdd(false);
    const handleShowAdd = () => setShowAdd(true);

    const [rentId, setRentId] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [status, setStatus] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [userID, setUserID] = useState('');
    const [pronaID, setPronaID] = useState('');

    const [editRentId, setEditRentId] = useState('');
    const [editBookingDate, setEditBookingDate] = useState('');
    const [editStatus, setEditStatus] = useState('');
    const [editPaymentMethod, setEditPaymentMethod] = useState('');
    const [editUserID, setEditUserID] = useState('');
    const [editPronaID, setEditPronaID] = useState('');
    
    const [data, setData] = useState([]);

    const getToken = () => {
        return Cookies.getTokenFromCookies();
    }

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios.get(RentEndPoint, {
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

    async function editRent(rent) {
        handleShow();

        setEditBookingDate(rent.bookingDate);
        setEditStatus(rent.status);
        setEditPaymentMethod(rent.paymentMethod);
        setEditUserID(rent.userID);
        setEditPronaID(rent.pronaID);

        setEditRentId(rent.rentId);
    }

    async function update(event) {
        event.preventDefault();
        try {
            await axios.put(`${RentEndPoint}/${editRentId}`, {
                rentId: parseInt(editRentId, 10),
                bookingDate: editBookingDate,
                status: parseFloat(editStatus),
                PaymentMethod: editPaymentMethod,
                UserID: editUserID,
                PronaID: parseInt(editPronaID, 10)
            }, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            toast.success('Rent updated successfully');
            handleClose();
            getData();
            clear();
        } catch (error) {
            console.error("Error updating rent:", error);
            toast.error(error.message);
        }
    }
    
    const handelDelete = (id) => {
        if (window.confirm("Are you sure to delete this Rent?")) {
            axios.delete(`${RentEndPoint}/${id}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            })
                .then((result) => {
                    toast.success('Rent has been deleted');
                    getData();
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
    };

    const handleSave = () => { 
        const data = {
            rentDate: rentDate,
            rentPrice: parseFloat(rentPrice),
            Commision: parseFloat(commision),
            PaymentMethod: paymentMethod,
            UserID: userID,
            PronaID: parseInt(pronaID,10),
        };
        console.log(data);

        axios.post(RentEndPoint, data, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        })
            .then(() => {
                getData();
                clear();
                toast.success('rent has been added.');
                handleCloseAdd();
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    const clear = () => {
        setBookingDate('');
        setStatus('');
        setPaymentMethod('');
        setUserID('');
        setPronaID('');

        setEditBookingDate('');
        setEditStatus('');
        setEditPaymentMethod('');
        setEditUserID('');
        setEditPronaID('');

        setEditRentId('');
    };

    return (
        <Fragment>
            <ToastContainer position="top-right" autoClose={5000} />
            <div className="d-flex justify-content-between align-items-center">
                <h2>Rent Table</h2>
                {/* <Button variant="primary" onClick={handleShowAdd}>Add rent</Button> */}
            </div>

            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Booking Date</th>
                        <th>Status</th>
                        <th>Payment Method</th>
                        <th>Buyer Id</th>
                        <th>Property Id</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((rent) => (
                        <tr key={rent.rentId}>
                            <td>{rent.rentId}</td>
                            <td>{rent.bookingDate}</td>
                            <td>{rent.status}</td>
                            <td>{rent.paymentMethod}</td>
                            <td>{rent.users.userName}</td>
                            <td>{rent.pronat.emri}</td>
                            <td>
                                {/* <Button variant="warning" onClick={() => editrent(rent)}>Edit</Button>{' '} */}
                                <Button variant="danger" onClick={() => handelDelete(rent.rentId)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Add rent Modal */}
            {/* <Modal show={showAdd} onHide={handleCloseAdd}>
                <Modal.Header closeButton>
                    <Modal.Title>Add rent</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <input type="date" placeholder="rent Date" className="form-control" value={rentDate} onChange={(e) => setrentDate(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="number" placeholder="Price" className="form-control" value={rentPrice} onChange={(e) => setrentPrice(e.target.value)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <input type="number" placeholder="Commision" className="form-control" value={commision} onChange={(e) => setCommision(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="text" placeholder="Payment Method" className="form-control" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} />
                        </Col>
                    </Row>
                    <Row>
                         <Col>
                             <input type="text" placeholder="User Id" className="form-control" value={userID} onChange={(e) => setUserID(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="number" placeholder="Property Id" className="form-control" value={pronaID} onChange={(e) => setPronaID(e.target.value)} />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAdd}>Close</Button>
                    <Button variant="primary" onClick={handleSave}>Save</Button>
                </Modal.Footer>
            </Modal> */}

            {/* Edit rent Modal */}
            {/* <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit rent</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <input type="date" placeholder="rent Date" className="form-control" value={editrentDate} onChange={(e) => setEditrentDate(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="number" placeholder="Price" className="form-control" value={editrentPrice} onChange={(e) => setEditrentPrice(e.target.value)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <input type="number" placeholder="Commision" className="form-control" value={editCommision} onChange={(e) => setEditCommision(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="text" placeholder="Payment Method" className="form-control" value={editPaymentMethod} onChange={(e) => setEditPaymentMethod(e.target.value)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                           <input type="text" placeholder="User Id" className="form-control" value={editUserID} onChange={(e) => setEditUserID(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="number" placeholder="Property Id" className="form-control" value={editPronaID} onChange={(e) => setEditPronaID(e.target.value)} />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={update}>Update</Button>
                </Modal.Footer>
            </Modal> */}
        </Fragment>
    );
};

export default RentCrud;