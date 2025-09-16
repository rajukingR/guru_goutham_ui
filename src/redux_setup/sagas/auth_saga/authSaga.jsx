import { call, put, takeLatest } from 'redux-saga/effects';
import {
  signupApi,
  signinApi,
  forgotPasswordApi,
  resetPasswordApi
} from '../../../api/authApi';
import {
  signupRequest,
  signupSuccess,
  signupFailure,
  signinRequest,
  signinSuccess,
  signinFailure,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure
} from '../../slices/auth_slice/authSlice';

// === SIGNUP ===
function* handleSignup(action) {
  try {
    const data = yield call(signupApi, action.payload);
    yield put(signupSuccess(data));
  } catch (error) {
    yield put(signupFailure(error.response?.data?.message || 'Signup failed'));
  }
}

// === SIGNIN ===
function* handleSignin(action) {
  try {
    const { email, password, rememberMe } = action.payload;
    const data = yield call(signinApi, { email, password });

    // Save token and user based on "Remember Me"
    if (rememberMe) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));
    } else {
      sessionStorage.setItem('authToken', data.token);
      sessionStorage.setItem('authUser', JSON.stringify(data.user));
    }

    yield put(signinSuccess(data));
  } catch (error) {
    yield put(signinFailure(error.response?.data?.message || 'Login failed'));
  }
}

// === FORGOT PASSWORD ===
function* handleForgotPassword(action) {
  try {
    const data = yield call(forgotPasswordApi, action.payload.email);
    yield put(forgotPasswordSuccess(data));
  } catch (error) {
    yield put(forgotPasswordFailure(error.response?.data?.message || 'Request failed'));
  }
}

// === RESET PASSWORD ===
function* handleResetPassword(action) {
  try {
    const { token, password } = action.payload;
    const data = yield call(resetPasswordApi, token, password);
    yield put(resetPasswordSuccess(data));
  } catch (error) {
    yield put(resetPasswordFailure(error.response?.data?.message || 'Reset failed'));
  }
}

// === WATCHER ===
export function* watchAuth() {
  yield takeLatest(signupRequest.type, handleSignup);
  yield takeLatest(signinRequest.type, handleSignin);
  yield takeLatest(forgotPasswordRequest.type, handleForgotPassword);
  yield takeLatest(resetPasswordRequest.type, handleResetPassword);
}
