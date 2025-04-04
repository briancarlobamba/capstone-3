import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import UserContext from '../context/UserContext';
import logo from '../img/logo.png';
import './app.css';

export default function AppNavbar() {
  const { user } = useContext(UserContext);

  return (
    <Navbar expand="lg" className="bg-body-tertiary sticky-top" id="navbar">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/">
          <img
            src={logo}
            alt="Shop Logo"
            style={{ height: '30px', width: 'auto' }} 
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user?.isAdmin ? (
              <Nav.Link as={NavLink} to="/products" exact="true">Admin Dashboard</Nav.Link>
            ) : (
              <Nav.Link as={NavLink} to="/products" exact="true">Products</Nav.Link>
            )}
          </Nav>
          <Nav className="ms-auto">
            {user && !user.isAdmin && (
              <>
                <Nav.Link as={NavLink} to="/cart" exact="true">Cart</Nav.Link>
                <Nav.Link as={NavLink} to="/profile" exact="true">Profile</Nav.Link>
                <Nav.Link as={NavLink} to="/order-history" exact="true">Order History</Nav.Link>
              </>
            )}
            {user?.isAdmin && (
              <Nav.Link as={NavLink} to="/profile" exact="true">Admin Profile</Nav.Link>
            )}
            {user ? (
              <Nav.Link as={NavLink} to="/logout" exact="true">Logout</Nav.Link>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login" exact="true">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register" exact="true">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
