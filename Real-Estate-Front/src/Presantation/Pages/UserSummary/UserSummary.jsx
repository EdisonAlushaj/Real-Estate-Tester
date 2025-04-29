import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { SellEndPoint, RentEndPoint } from '../../../Application/Services/endpoints.js';
import Cookies from '../../../Application/Services/cookieUtils.jsx';
import coverImg from '../../../../public/image/cover4.jpg';
import 'react-toastify/dist/ReactToastify.css';
import './UserSummary.css';

function UserSummary() {
    const [saleData, setSaleData] = useState([]);
    const [rentData, setRentData] = useState([]);

    const getToken = () => {
        return Cookies.getTokenFromCookies();
    }

    const getUserId = () => {
        return Cookies.getUserIdFromCookies();
    }

    useEffect(() => {
        getSaleData();
        getRentData();
    }, []);

    const getSaleData = () => {
        axios.get(`${SellEndPoint}/${getUserId()}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        })
            .then((response) => {
                console.log(response);
                setSaleData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getRentData = () => {
        axios.get(`${RentEndPoint}/${getUserId()}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        })
            .then((response) => {
                console.log(response);
                setRentData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ zIndex: '1', position: 'relative', backgroundColor: '' }}>
                <div className='position-relative' style={{ width: '100%', height: '20em' }}>
                    {/* Triangle overlay */}
                    <div className="triangle-overlay" style={{ }}></div>
                    
                    <div className="title position-absolute text-start" style={{}}>
                        <h1 style={{}}>User Summary</h1>
                    </div>
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <img src={coverImg} alt="Cover Image" className="img-fluid w-100" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(211, 236, 167, 0.3)', // #D3ECA7 with 40% opacity
                            zIndex: 1
                        }}></div>
                    </div>
                </div>
            </div>

            <h1>Properties Bought</h1>
            <div className='about-txt justify-content-center align-items-center' style={{ padding: '3em 5%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2em', justifyItems: 'center'  }}>
            {saleData.length > 0 ? (
                    saleData.map((sells) => (
                        <div key={sells.sellID} style={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '1em' }}>
                            <img
                                src={sells.photo || coverImg}
                                style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                            <h3>{sells.pronat.emri}</h3>
                            <p>{sells.paymentMethod}</p>
                            <p>{sells.adresa}</p>
                            <p>{`Price: $${sells.salePrice}`}</p>
                        </div>
                    ))
                ) : (
                    <p>No properties found. Try different filters.</p>
                )}
            </div>

            <h1>Properties Rented</h1>
            <div className='about-txt justify-content-center align-items-center' style={{ padding: '3em 5%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2em', justifyItems: 'center'  }}>
            {rentData.length > 0 ? (
                    rentData.map((rent) => (
                        <div key={rent.rentId} style={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '1em' }}>
                            <img
                                src={rent.imageUrl || coverImg}
                                style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                            <h3>{rent.pronat.emri}</h3>
                            <p>{rent.bookingDate}</p>
                            <p>{rent.bookingDate}</p>
                            <p>{`Price: $${rent.salePrice}`}</p>
                        </div>
                    ))
                ) : (
                    <p>No properties found. Try different filters.</p>
                )}
            </div>
        </>
    );
}

export default UserSummary