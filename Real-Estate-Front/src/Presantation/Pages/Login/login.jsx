import React, { useState } from 'react';
import axios from 'axios';
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
import cookieUtils from '../../../Application/Services/cookieUtils';

function Login() {
  const [username, setUsername] = useState(''); // Use username instead of email
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // For navigating after successful login

  const handleUsernameChange = (event) => {
    setUsername(event.target.value); // Set the username
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const GetLoginDetails = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    try {
      const response = await axios.post('https://localhost:7140/api/Account/login', {
        username: username,
        password: password
      });

      const token = response.data.token;
      console.log("JWT Token:", token);

      const parsedToken = parseJwt(token);
      console.log("Parsed Token:", parsedToken);

      const role = parsedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      console.log("User Role:", role);

      const userId = parsedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      console.log("User Id:", userId);

      const name = parsedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      console.log("User Name:", name);

      cookieUtils.setUserIdInCookies(userId);
      cookieUtils.setUserRoleInCookies(role);
      cookieUtils.setTokenCookies(token);

      // Set the refresh token in cookies
      const refreshToken = response.data.refreshToken;
      cookieUtils.setRefreshToken(refreshToken);  // Set the refresh token
      cookieUtils.startRefreshingToken();

      if (role === 'Admin') {
        console.log("Navigating to admin dashboard...");
        navigate('/dashboard');
      } else {
        console.log("Navigating to home page...");
        navigate('/app/home');
      }

    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
      console.error("Error config:", error.config);
    }
  };

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Error parsing JWT token:", e);
      return null;
    }
  };


  return (
    <MDBContainer fluid>
      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol col='12'>
          <MDBCard className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '400px' }}>
            <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
              <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
              <p className="text-white-50 mb-5">Please enter your username and password!</p>

              <MDBInput
                wrapperClass='mb-4 mx-5 w-100'
                labelClass='text-white'
                label='Username'  // Change label to "Username"
                id='username'    // Change id to "username"
                type='text'
                size="lg"
                value={username}
                onChange={handleUsernameChange}
              />
              <MDBInput
                wrapperClass='mb-4 mx-5 w-100'
                labelClass='text-white'
                label='Password'
                id='password'
                type='password'
                size="lg"
                value={password}
                onChange={handlePasswordChange}
              />

              <p className="small mb-3 pb-lg-2">
                <a className="text-white-50" href="#!">Forgot password?</a>
              </p>
              <MDBBtn outline className='mx-2 px-5' color='white' size='lg' onClick={GetLoginDetails} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </MDBBtn>

              {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}

              <div className='d-flex flex-row mt-3 mb-5'>
                <MDBBtn tag='a' color='none' className='m-3' style={{ color: 'white' }}>
                  <MDBIcon fab icon='facebook-f' size="lg" />
                </MDBBtn>
                <MDBBtn tag='a' color='none' className='m-3' style={{ color: 'white' }}>
                  <MDBIcon fab icon='twitter' size="lg" />
                </MDBBtn>
                <MDBBtn tag='a' color='none' className='m-3' style={{ color: 'white' }}>
                  <MDBIcon fab icon='google' size="lg" />
                </MDBBtn>
              </div>

              <div>
                <p className="mb-0">Don't have an account? <NavLink to="/register" className="text-white-50 fw-bold">Sign Up</NavLink></p>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;