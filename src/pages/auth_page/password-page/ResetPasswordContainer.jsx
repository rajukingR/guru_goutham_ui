// ResetPasswordContainer.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ResetPassword from './ResetPassword';
import { resetPasswordRequest } from '../../../redux_setup/slices/auth_slice/authSlice';

const ResetPasswordContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  
  const { loading, error, resetPasswordMessage } = useSelector((state) => state.auth);

  const handleSubmit = (values) => {
    if (!token) {
      alert('Invalid reset token');
      return;
    }
    
    dispatch(resetPasswordRequest({ 
      token, 
      password: values.password 
    }));
  };

  React.useEffect(() => {
    if (resetPasswordMessage) {
      // Show success message and navigate after a delay
      setTimeout(() => {
        navigate('/signin', { 
          state: { message: 'Password reset successfully' } 
        });
      }, 2000);
    }
  }, [resetPasswordMessage, navigate]);

  if (!token) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Invalid Reset Link</h2>
        <p>The password reset link is invalid or has expired.</p>
        <a href="/forgot-password">Request a new reset link</a>
      </div>
    );
  }

  return (
    <ResetPassword
      onSubmit={handleSubmit}
      loading={loading}
      apiError={error}
      successMessage={resetPasswordMessage}
    />
  );
};

export default ResetPasswordContainer;