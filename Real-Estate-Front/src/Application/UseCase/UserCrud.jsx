import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UsersEndPoint } from '../Services/endpoints';
import Cookies from '../Services/cookieUtils.jsx';

const UserCrud = () => {
    const [data, setData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState('User');
    const [showModal, setShowModal] = useState(false);

    const getToken = () => {
        return Cookies.getTokenFromCookies();
    }

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios.get(UsersEndPoint, {
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

    const handleRoleChange = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const assignRole = async () => {
        try {
            const response = await axios.post(`${UsersEndPoint}/assign-role`, {
                Username: selectedUser.userName,
                Role: selectedRole
            }, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                getData(); // Refresh data
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred while assigning the role");
        } finally {
            setShowModal(false);
        }
    };

    return (
        <Fragment>
            <ToastContainer position="top-right" autoClose={5000} />
            <div className="d-flex justify-content-between align-items-center">
                <h2>Users Table</h2>
            </div>

            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.userName}</td>
                            <td>{user.email}</td>
                            <td>{user.roles}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleRoleChange(user)}>Edit</Button>{' '}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Assign Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <select className="form-control" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                                <option value="Admin">Admin</option>
                                <option value="Agent">Agent</option>
                                <option value="User">User</option>
                            </select>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={assignRole}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default UserCrud;