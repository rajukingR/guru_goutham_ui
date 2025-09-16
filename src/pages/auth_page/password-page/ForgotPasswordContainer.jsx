// ForgotPasswordContainer.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';
import { forgotPasswordRequest } from '../../../redux_setup/slices/auth_slice/authSlice';

const ForgotPasswordContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, forgotPasswordMessage } = useSelector((state) => state.auth);

  const handleSubmit = (values) => {
    dispatch(forgotPasswordRequest({ email: values.email }));
  };

  useEffect(() => {
    if (forgotPasswordMessage) {
      // Navigate to sign-in after 2 seconds
      const timer = setTimeout(() => {
        navigate('/signin', { 
          state: { message: forgotPasswordMessage } 
        });
      }, 2000);

      // Clean up timer
      return () => clearTimeout(timer);
    }
  }, [forgotPasswordMessage, navigate]);

  return (
    <ForgotPassword
      onSubmit={handleSubmit}
      loading={loading}
      apiError={error}
      successMessage={forgotPasswordMessage}
    />
  );
};

export default ForgotPasswordContainer;
