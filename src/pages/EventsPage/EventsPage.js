import React, { useEffect } from 'react';
import { AuthService } from '../../service/authService';
import { useNavigate } from 'react-router-dom';

const EventsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate('/login', { replace: true })
    }
  }, []);

  return <div>Events page</div>
};

export default EventsPage;