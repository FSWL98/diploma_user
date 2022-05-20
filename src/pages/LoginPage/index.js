import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from "../../components/LoginForm";

const LoginPage = () => {
  const navigate = useNavigate();

  const onLoginSuccess = () => {
    navigate('/events', { replace: true });
  };
  return <LoginForm onLoginSuccess={onLoginSuccess} />
};

export default LoginPage;