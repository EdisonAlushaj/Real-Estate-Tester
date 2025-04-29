import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon
} from 'mdb-react-ui-kit';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('https://localhost:7140/api/Account/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      if (response.ok) {
        setSuccess('Registration successful!');
        // Redirect to the login page after successful registration
        navigate('/login');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed');
      }
    } catch (err) {
      setError('Error connecting to the server');
    }
  };

  return (
    <MDBContainer fluid>
      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol col='12'>
          <MDBCard className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '400px' }}>
            <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
              <h2 className="fw-bold mb-2 text-uppercase">Sign Up</h2>
              <p className="text-white-50 mb-5">Please enter your details to create an account!</p>

              <form onSubmit={handleSubmit}>
                <MDBInput 
                  wrapperClass='mb-4 mx-5 w-100' 
                  labelClass='text-white' 
                  label='Username' 
                  id='username' 
                  type='text' 
                  size="lg"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <MDBInput 
                  wrapperClass='mb-4 mx-5 w-100' 
                  labelClass='text-white' 
                  label='Email address' 
                  id='email' 
                  type='email' 
                  size="lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MDBInput 
                  wrapperClass='mb-4 mx-5 w-100' 
                  labelClass='text-white' 
                  label='Password' 
                  id='password' 
                  type='password' 
                  size="lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="text-danger">{error}</p>}
                {success && <p className="text-success">{success}</p>}

                <MDBBtn outline className='mx-2 px-5' color='white' size='lg' type="submit">
                  Sign Up
                </MDBBtn>
              </form>

              <div className='d-flex flex-row mt-3 mb-5'>
                <MDBBtn tag='a' color='none' className='m-3' style={{ color: 'white' }}>
                  <MDBIcon fab icon='facebook-f' size="lg"/>
                </MDBBtn>
                <MDBBtn tag='a' color='none' className='m-3' style={{ color: 'white' }}>
                  <MDBIcon fab icon='twitter' size="lg"/>
                </MDBBtn>
                <MDBBtn tag='a' color='none' className='m-3' style={{ color: 'white' }}>
                  <MDBIcon fab icon='google' size="lg"/>
                </MDBBtn>
              </div>

              <p className="mb-0">Already have an account? <NavLink to="/login" className="text-white-50 fw-bold">Login</NavLink></p>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Register;
