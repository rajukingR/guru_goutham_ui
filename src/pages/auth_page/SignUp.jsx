import React from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthForm from "./AuthForm";
import { signupRequest } from "../../redux_setup/slices/auth_slice/authSlice";

const SignUp = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (values) => {
    dispatch(signupRequest(values));
  };

  return <AuthForm isSignup onSubmit={handleSubmit} loading={loading} apiError={error} />;
};

export default SignUp;
