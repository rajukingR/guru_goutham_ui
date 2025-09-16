import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import { signupRequest } from "../../redux_setup/slices/auth_slice/authSlice";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, signupMessage } = useSelector((state) => state.auth);

  const handleSubmit = (values) => {
    dispatch(signupRequest(values));
  };

  // Navigate to signin after success
  useEffect(() => {
    if (signupMessage) {
      const timer = setTimeout(() => {
        navigate("/signin", { state: { message: signupMessage } });
      }, 2000); // 2 seconds delay to show message

      return () => clearTimeout(timer); // cleanup
    }
  }, [signupMessage, navigate]);

  return (
    <AuthForm
      isSignup
      onSubmit={handleSubmit}
      loading={loading}
      apiError={error}
      successMessage={signupMessage}
    />
  );
};

export default SignUp;
