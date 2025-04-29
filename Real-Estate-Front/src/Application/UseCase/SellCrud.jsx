import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SellEndPoint } from '../Services/endpoints';
import Cookies from '../Services/cookieUtils.jsx';

const SellCrud = () => {
    const [show, setShow] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleCloseAdd = () => setShowAdd(false);
    const handleShowAdd = () => setShowAdd(true);

    const [sellID, setSellID] = useState('');
    const [saleDate, setSaleDate] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [commision, setCommision] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [userID, setUserID] = useState('');
    const [pronaID, setPronaID] = useState('');

    const [editSellID, setEditSellID] = useState('');
    const [editSaleDate, setEditSaleDate] = useState('');
    const [editSalePrice, setEditSalePrice] = useState('');
    const [editCommision, setEditCommision] = useState('');
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
        axios.get(SellEndPoint, {
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

    async function editSell(sell) {
        handleShow();

        setEditSaleDate(sell.saleDate);
        setEditSalePrice(sell.salePrice);
        setEditCommision(sell.commision);
        setEditPaymentMethod(sell.paymentMethod);
        setEditUserID(sell.users.userName);
        setEditPronaID(sell.pronat.emri);

        setEditSellID(sell.sellID);
    }

   async function update(event) {
        event.preventDefault();
        try {
            await axios.put(`${SellEndPoint}/${editSellID}`, {
                SellID: parseInt(editSellID, 10),
                SaleDate: editSaleDate,
                SalePrice: parseFloat(editSalePrice),
                Commision: parseFloat(editCommision),
                PaymentMethod: editPaymentMethod,
                UserID: editUserID,
                PronaID: parseInt(editPronaID, 10)
            }, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            toast.success('Sale updated successfully');
            handleClose();
            getData();
            clear();
        } catch (error) {
            console.error("Error updating sale:", error);
            toast.error(error.message);
        }
    }
    
    const handelDelete = (id) => {
        if (window.confirm("Are you sure to delete this sale?")) {
            axios.delete(`${SellEndPoint}/${id}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            })
                .then((result) => {
                    toast.success('Sale has been deleted');
                    getData();
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
    };

     const handleSave = () => {
        const data = {
            SaleDate: saleDate,
            SalePrice: parseFloat(salePrice),
            Commision: parseFloat(commision),
            PaymentMethod: paymentMethod,
            UserID: userID,
            PronaID: parseInt(pronaID,10),
        };
        console.log(data);

        axios.post(SellEndPoint, data, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        })
            .then(() => {
                getData();
                clear();
                toast.success('Sale has been added.');
                handleCloseAdd();
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    const clear = () => {
        setSaleDate('');
        setSalePrice('');
        setCommision('');
        setPaymentMethod('');
        setUserID('');
        setPronaID('');

        setEditSaleDate('');
        setEditSalePrice('');
        setEditCommision('');
        setEditPaymentMethod('');
        setEditUserID('');
        setEditPronaID('');

        setEditSellID('');
    };

    return (
        <Fragment>
            <ToastContainer position="top-right" autoClose={5000} />
            <div className="d-flex justify-content-between align-items-center">
                <h2>Sale Table</h2>
                {/* <Button variant="primary" onClick={handleShowAdd}>Add sell</Button> */}
            </div>

            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Sale Date</th>
                        <th>Price</th>
                        <th>Commision</th>
                        <th>Payment Method</th>
                        <th>Buyer Id</th>
                        <th>Property Id</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((sell) => (
                        <tr key={sell.sellID}>
                            <td>{sell.sellID}</td>
                            <td>{sell.saleDate}</td>
                            <td>{sell.salePrice}</td>
                            <td>{sell.commision}</td>
                            <td>{sell.paymentMethod}</td>
                            <td>{sell.users.userName}</td>
                            <td>{sell.pronat.emri}</td>
                            <td>
                                {/* <Button variant="warning" onClick={() => editSell(sell)}>Edit</Button>{' '} */}
                                <Button variant="danger" onClick={() => handelDelete(sell.sellID)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Add sell Modal */}
            {/* <Modal show={showAdd} onHide={handleCloseAdd}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Sale</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <input type="date" placeholder="Sale Date" className="form-control" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="number" placeholder="Price" className="form-control" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
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

            {/* Edit sell Modal */}
            {/* <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Sale</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <input type="date" placeholder="Sale Date" className="form-control" value={editSaleDate} onChange={(e) => setEditSaleDate(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="number" placeholder="Price" className="form-control" value={editSalePrice} onChange={(e) => setEditSalePrice(e.target.value)} />
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

export default SellCrud;