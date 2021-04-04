import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (idToken, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: idToken,
    userId: userId
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

export const logOut = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('userId');
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logOut());
    }, expirationTime * 1000);
  };
};

export const auth = (email, password, isSignup) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    }
    let url = process.env.REACT_APP_SIGN_IN_URL;
    if (isSignup) {
      url = process.env.REACT_APP_SIGN_UP_URL;
    }

    const updateError = (error, message) => {
      const newError = {
        ...error.response.data.error,
        message: message
      };

      return newError;
    };

    axios.post(url, authData)
      .then(res => {
        const expirationDate = new Date(new Date ().getTime() + res.data.expiresIn * 1000);
        localStorage.setItem('token', res.data.idToken);
        localStorage.setItem('expirationDate', expirationDate);
        localStorage.setItem('userId', res.data.localId);
        dispatch(authSuccess(res.data.idToken, res.data.localId));
        dispatch(checkAuthTimeout(res.data.expiresIn));
      })
      .catch(err => {
        let error = null;
        if (isSignup) {
          switch (err.response.data.error.message) {
            case 'EMAIL_EXISTS':
              error = updateError(err, "A user with email address already exists.");
              break;
            case 'INVALID_EMAIL':
              error = updateError(err, "The email address you entered is invalid.");
              break;
            case 'MISSING_PASSWORD':
              error = updateError(err, "The password is missing.");
              break;
            default:
              error = err.response.data.error;
              break;
          }
        } else {
          switch (err.response.data.error.message) {
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
              error = updateError(err, "Too many attempts, please try again later.");
              break;
            default:
              error = updateError(err, "Incorrect username or password.");
              break;
          }
        }
        dispatch(authFail(error));
      });
  };
};

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_URL,
    path: path
  };
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logOut());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate > new Date()) {
        const userId = localStorage.getItem('userId');
        dispatch(authSuccess(token, userId));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
      } else {
        dispatch(logOut());
      }
    }
  }
}