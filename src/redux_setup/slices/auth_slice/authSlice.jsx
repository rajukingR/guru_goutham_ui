import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   user: null,
//   token: localStorage.getItem("authToken") || sessionStorage.getItem("authToken") || null,
//   loading: false,
//   error: null,
// };

const initialState = {
  user: JSON.parse(localStorage.getItem("authUser")) || JSON.parse(sessionStorage.getItem("authUser")) || null,
  token: localStorage.getItem("authToken") || sessionStorage.getItem("authToken") || null,
  loading: false,
  error: null,
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signupRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    signupSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    signupFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signinRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    signinSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    signinFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // logout: (state) => {
    //   state.user = null;
    //   state.token = null;
    // },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("authUser");
    },
  },
});

export const {
  signupRequest,
  signupSuccess,
  signupFailure,
  signinRequest,
  signinSuccess,
  signinFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
