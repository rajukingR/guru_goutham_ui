import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user:
    JSON.parse(localStorage.getItem("authUser")) ||
    JSON.parse(sessionStorage.getItem("authUser")) ||
    null,
  token:
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken") ||
    null,
  loading: false,
  error: null,
  signupMessage: null, // ← added
  forgotPasswordMessage: null,
  resetPasswordMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Signup
    signupRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.signupMessage = null; // reset message
    },
    signupSuccess: (state, action) => {
      state.loading = false;
      state.user = null; // ← do not set user
      state.token = null; // ← do not set token
      state.signupMessage = action.payload.message; // store success message
    },

    signupFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.signupMessage = null;
    },

    // Signin
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

    // Forgot Password
    forgotPasswordRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.forgotPasswordMessage = null;
    },
    forgotPasswordSuccess: (state, action) => {
      state.loading = false;
      state.forgotPasswordMessage = action.payload.message;
    },
    forgotPasswordFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Reset Password
    resetPasswordRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.resetPasswordMessage = null;
    },
    resetPasswordSuccess: (state, action) => {
      state.loading = false;
      state.resetPasswordMessage = action.payload.message;
    },
    resetPasswordFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.signupMessage = null;
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
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
