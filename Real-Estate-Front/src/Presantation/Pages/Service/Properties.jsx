import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PronaEndPoint } from '../../../Application/Services/endpoints';
import './Service.css';
import { useNavigate } from 'react-router-dom';
import imageProperty from '../../../../public/image/p1.png';
import coverImg from '../../../../public/Image/property-1.png';

function Properties() {
    const [allProperties, setAllProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');
    const [budget, setBudget] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const navigate = useNavigate();

    const BASE_URL = "https://localhost:7140";

    const formatPhotoUrl = (photoPath) => {
        if (!photoPath) {
            console.error('Invalid photoPath:', photoPath);
            return ''; // or handle the error as needed
        }
        return `${BASE_URL}/${photoPath.replace(/\\/g, '/')}`;
    };

    useEffect(() => {
        const fetchAllProperties = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${PronaEndPoint}/GetAll`);
                setAllProperties(response.data);
                setFilteredProperties(response.data);
            } catch (error) {
                console.error('Error fetching properties:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllProperties();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        setHasSearched(true);

        if (!location && !category && !budget && !propertyType) {
            setFilteredProperties(allProperties);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${PronaEndPoint}/GetFilteredProperties`, {
                params: {
                    location,
                    category,
                    maxPrice: budget || undefined,
                    propertyType,
                },
            });

            setFilteredProperties(response.data);
        } catch (error) {
            console.error('Error filtering properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShowAllProperties = () => {
        setFilteredProperties(allProperties);
        setHasSearched(false);
        setLocation('');
        setCategory('');
        setBudget('');
        setPropertyType('');
    };

    const handleBuyProperty = (propertyId) => {
        navigate(`/app/property1/${propertyId}`);
    };

    const handleRentProperty = (propertyId) => {
        navigate(`/app/property2/${propertyId}`);
    };

    return (
        <>
<div className="d-flex flex-column align-items-center justify-content-center" style={{ zIndex: '1', position: 'relative' }}>
                <div className="position-relative" style={{ width: '100%', height: '40em' }}>
                    <div className="triangle-overlay-1"></div>
                    <div className="title position-absolute text-start">
                        <h1>Find a Property</h1>
                    </div>
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <img
                            src={coverImg}
                            alt="Cover Image"
                            className="img-fluid w-100"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(211, 236, 167, 0.3)',
                                zIndex: 1,
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="search-bar d-flex justify-content-center" style={{ padding: '2em', backgroundColor: '#fff' }}>
                <div
                    className="search-form d-flex align-items-center gap-3"
                    style={{
                        backgroundColor: '#f9f9f9',
                        padding: '1em 2em',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '0.5em',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            outline: 'none',
                        }}
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '0.5em',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            outline: 'none',
                            backgroundColor: '#fff',
                        }}
                    >
                        <option value="" disabled>Category</option>
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="land">Land</option>
                    </select>
                    <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '0.5em',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            outline: 'none',
                            backgroundColor: '#fff',
                        }}
                    >
                        <option value="" disabled>Property Type</option>
                        <option value="sell">Sale</option>
                        <option value="rent">Rent</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Budget"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '0.5em',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            outline: 'none',
                        }}
                    />
                    <button
                        onClick={handleSearch}
                        style={{
                            padding: '0.5em 1.5em',
                            backgroundColor: '#000',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        {loading ? 'Searching...' : 'Search Now'}
                    </button>
                </div>
            </div>

            {hasSearched && (
                <div className="d-flex justify-content-center" style={{ marginTop: '1em' }}>
                    <button
                        onClick={handleShowAllProperties}
                        style={{
                            padding: '0.5em 1.5em',
                            backgroundColor: '#4CAF50',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Show All Properties
                    </button>
                </div>
            )}

            <div className="properties-list" style={{ padding: '3em 5%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2em', justifyItems: 'center' }}>
                {loading ? (
                    <p>Loading properties...</p>
                ) : filteredProperties.length > 0 ? (
                    filteredProperties.map((property) => (
                        property.status === "Available" && (
                            <div key={property.pronaID} style={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '1em' }}>
                                {/* Dynamically Load the Image from the Server */}
                                <img
                                    src={property.photo ? property.photo : imageProperty}
                                    alt={property.emri}
                                    style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px' }}
                                />
                                <h3>{property.emri}</h3>
                                <p>{property.adresa}</p>
                                <p>{`Price: $${property.price}`}</p>
                                {property.type === 'Sell' && (
                                    <button onClick={() => handleBuyProperty(property.pronaID)}>Buy Now</button>
                                )}
                                {property.type === 'Rent' && (
                                    <button onClick={() => handleRentProperty(property.pronaID)}>Rent Now</button>
                                )}
                            </div>
                        )
                    ))
                ) : (
                    <p>No properties found. Try different filters.</p>
                )}
            </div>
        </>
    );
}

export default Properties;
