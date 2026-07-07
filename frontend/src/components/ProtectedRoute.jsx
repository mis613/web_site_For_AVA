import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import LoadingState from './LoadingState';
import { verifyAdminAuth } from '../services/auth';

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let active = true;

    verifyAdminAuth().then((result) => {
      if (!active) return;
      setStatus(result.authenticated ? 'authenticated' : 'unauthenticated');
    });

    return () => {
      active = false;
    };
  }, []);

  if (status === 'checking') {
    return <div className="py-16"><div className="container-page"><LoadingState /></div></div>;
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

