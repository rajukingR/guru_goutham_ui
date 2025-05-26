import { all } from 'redux-saga/effects';
import { watchAuth } from './auth_saga/authSaga';

export default function* rootSaga() {
  yield all([watchAuth()]);
}

