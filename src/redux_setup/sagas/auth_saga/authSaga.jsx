import { call, put, takeLatest } from 'redux-saga/effects';
import { signupApi, signinApi } from '../../../api/authApi';
import {
  signupRequest,
  signupSuccess,
  signupFailure,
  signinRequest,
  signinSuccess,
  signinFailure,
} from '../../slices/auth_slice/authSlice';

function* handleSignup(action) {
  try {
    const data = yield call(signupApi, action.payload);
    yield put(signupSuccess(data));
  } catch (error) {
    yield put(signupFailure(error.response.data.message));
  }
}

// function* handleSignin(action) {
//   try {
//     const data = yield call(signinApi, action.payload);
//     yield put(signinSuccess(data));
//   } catch (error) {
//     yield put(signinFailure(error.response.data.message));
//   }
// }

function* handleSignin(action) {
  try {
    const { email, password, rememberMe } = action.payload;
    const data = yield call(signinApi, { email, password });

    // Save token and user based on "Remember Me"
    if (rememberMe) {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
    } else {
      sessionStorage.setItem("authToken", data.token);
      sessionStorage.setItem("authUser", JSON.stringify(data.user));
    }

    yield put(signinSuccess(data));
  } catch (error) {
    yield put(signinFailure(error.response?.data?.message || "Login failed"));
  }
}

export function* watchAuth() {
  yield takeLatest(signupRequest.type, handleSignup);
  yield takeLatest(signinRequest.type, handleSignin);
}
