import Cookies from 'js-cookie';
import axios from 'axios';
 
const cookieUtils = {
  setUserRoleInCookies: (role) => {
    Cookies.set('userRole', role, { expires: 1 });
  },
  setUserIdInCookies: (userId) => {
    Cookies.set('userId', userId, { expires: 1 });
  },
  setNameInCookies: (name) => {
    Cookies.set('name', name, { expires: 1 });
  },
  setTokenCookies: (token) => {
    Cookies.set('token', token, { expires: 1 });
  },

  getUserIdFromCookies: () => {
    return Cookies.get('userId');
  },
  getUserRoleFromCookies: () => {
    return Cookies.get('userRole');
  },
  getNameFromCookies: () => {
    return Cookies.get('name');
  },
  getTokenFromCookies: () => {
    return Cookies.get('token');
  },

  setRefreshToken: (refreshToken) => {
    Cookies.set('refreshToken', refreshToken, { expires: 1 }); // set the refresh token with an expiration of 7 days
  },

  // Define the refreshRefreshToken function here
  refreshRefreshToken: async () => {
    try {
      const response = await axios.post('https://localhost:7140/api/Account/login', {
        refreshToken: Cookies.get('refreshToken')
      });

      const newRefreshToken = response.data.refreshToken;
      Cookies.set('refreshToken', newRefreshToken, { expires: 7 });
      console.log('Refresh token executed.');
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  },

  // Set an interval to refresh the token every 5 minutes
  startRefreshingToken: () => {
    setInterval(cookieUtils.refreshRefreshToken, 5 * 60 * 1000); // 5 minutes interval
  },

  clearUserRole: () => {
    Cookies.remove('userRole');
    Cookies.remove('userId');
    Cookies.remove('name');
    Cookies.remove('token');
    Cookies.remove('refreshToken');
  }
};

export default cookieUtils;

