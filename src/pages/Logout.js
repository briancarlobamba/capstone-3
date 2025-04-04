import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function Logout() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Token before removal:', localStorage.getItem('token'));

    setUser(null);
    localStorage.removeItem('token'); 

    console.log('Token after removal:', localStorage.getItem('token'));

    navigate('/login');
  }, [setUser, navigate]);

  return null;
}
