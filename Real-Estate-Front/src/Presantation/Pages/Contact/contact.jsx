import coverImg from '../../../../public/image/cover4.jpg';
import './Contact.css'
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Badge } from 'react-bootstrap';
import axios from 'axios';
import { ContactRequestEndPoint } from '../../../Application/Services/endpoints';
import Cookies from '../../../Application/Services/cookieUtils';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [validated, setValidated] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [expandedItem, setExpandedItem] = useState(null);

    const getToken = () => {
        return Cookies.getTokenFromCookies();
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            try {
                const response = await axios.post(ContactRequestEndPoint, formData, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                console.log('Form submitted:', response.data);
                setSubmitSuccess(true);
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }

        setValidated(true);
    };

    const handleItemClick = (index) => {
        setExpandedItem(expandedItem === index ? null : index);
    };

    return (
        <>
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ zIndex: '1', position: 'relative', backgroundColor: '' }}>
                <div className='position-relative' style={{ width: '100%', height: '20em' }}>
                    {/* Triangle overlay */}
                    <div className="triangle-overlay" style={{
                        
                    }}></div>
                    <div className="title position-absolute text-start" style={{  }}>
                        <h1 style={{}}>
                            Kontakti
                        </h1>
                    </div>
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <img src={coverImg} alt="Cover Image" className="img-fluid w-100" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(71, 105, 76, 0.3)', // #D3ECA7 with 40% opacity
                            zIndex: 1
                        }}></div>
                    </div>
                </div>
            </div>

            <div className='contact align-items-center' style={{  }}>
                <div className='contact-item d-flex flex-column justify-content-center' style={{  }}>
                    <p><b>Lokacioni</b></p>

                    <p style={{ margin: '0' }}>Qyshk - Pejë, Kosovë</p>
                    <p style={{ margin: '0' }}>Prishtinë, Kosovë</p>
                </div>

                <div className='contact-item d-flex flex-column justify-content-center' style={{  }}>
                    <p><b>Numrat e Tel</b></p>

                    <p style={{ margin: '0' }}>00383(0)49 117 999</p>
                    <p style={{ margin: '0' }}>00383(0)49 200 092</p>
                </div>

                <div className='contact-item d-flex flex-column justify-content-center' style={{  }}>
                    <p><b>Email</b></p>

                    <p style={{ margin: '0' }}>info@abi-g.com</p>
                    <p></p>
                </div>
            </div>

            <Container fluid className="d-flex justify-content-center">
    <Row className="w-100">
        <Col className="rounded p-4 bg-light mx-auto" style={{ fontFamily: 'Forum, sans-serif', border: '1px solid #b07256', maxWidth: '100%' }}>
            <h2 className="text-center"><b>Write us a message</b></h2>
            {submitSuccess && <p className="text-success text-center">Thank you! Your message has been submitted successfully.</p>}
            <Form 
                className="d-flex flex-column rounded p-4 mx-auto" 
                noValidate 
                validated={validated} 
                onSubmit={handleSubmit} 
                style={{ fontFamily: 'Forum, sans-serif', border: '1px solid #b07256', maxWidth: '100%' }}
            >
                <Form.Group controlId="formName" className="w-100">
                    <Form.Label><b>Name</b></Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Please provide a valid name.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formEmail" className="w-100">
                    <Form.Label><b>Email address</b></Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Please provide a valid email.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formMessage" className="w-100">
                    <Form.Label><b>Message</b></Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Please provide a message.
                    </Form.Control.Feedback>
                </Form.Group>

                <Button className="border-0 mt-3 w-100" style={{ backgroundColor: '#b07256' }} type="submit">
                    Submit
                </Button>
            </Form>
        </Col>
    </Row>
</Container>


            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d331.91460463472765!2d20.323176877850752!3d42.65667998983095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1352fd8d17918801%3A0x9ee38a6256f54ba0!2sDevolli%20Corporation!5e1!3m2!1sen!2s!4v1724185215596!5m2!1sen!2s"
                width="100%"
                height="450"
                style={{ border: '0' }}
                allowFullScreen=""
                loading="lazy"
                refererpolicy="no-referrer-when-downgrade">
            </iframe>
        </>
    );
}

export default Contact