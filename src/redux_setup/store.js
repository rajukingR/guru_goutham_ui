
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import authReducer from './slices/auth_slice/authSlice';
import rootSaga from './sagas/rootSaga';
const sagaMiddleware = createSagaMiddleware();


const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;

// *** After : name is random & sepreate ***//
