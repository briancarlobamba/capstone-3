import { useState, useEffect, useContext } from 'react';
import { Container, Button, Row, Col, ListGroup, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import './app.css'


export default function CartView() {
    const { user } = useContext(UserContext);
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const notyf = new Notyf();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user]);

    const fetchCart = () => {
        setLoading(true);
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/get-cart`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.cart) {
                    setCart(data.cart);
                } else {
                    setCart(null);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('Fetch error:', err);
                setError(err.message);
                setLoading(false);
            });
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            notyf.error('Quantity must be at least 1');
            return;
        }

        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/update-cart-quantity`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ productId, newQuantity }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message === 'Item quantity updated successfully') {
                    notyf.success('Quantity updated');
                    fetchCart();
                } else {
                    notyf.error('Error updating quantity');
                }
            })
            .catch((err) => {
                console.error('Update error:', err);
                notyf.error('Error updating quantity');
            });
    };

    const removeItem = (productId) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/${productId}/remove-from-cart`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message === 'Item removed from cart successfully') {
                    notyf.success('Item removed from cart');
                    fetchCart();
                } else {
                    notyf.error('Error removing item');
                }
            });
    };

    const clearCart = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/clear-cart`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message === 'Cart cleared successfully') {
                    notyf.success('Cart cleared');
                    fetchCart();
                } else {
                    notyf.error('Error clearing cart');
                }
            });
    };

    const checkout = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('Checkout response:', data);

                if (data.message === 'Ordered Successfully') {
                    notyf.success('Order placed successfully');
                    fetchCart();
                } else {
                    notyf.error('Error placing order');
                }
            })
            .catch((err) => {
                console.error('Checkout error:', err);
                notyf.error('Error placing order');
            });
    };

    if (!user) {
        return <p>Please <Link to="/login">login</Link> to view your cart.</p>;
    }

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!cart || cart.cartItems.length === 0) {
        return (
            <div className="text-center">
                <p>Your cart is empty.</p>
                <Button variant="primary" onClick={() => navigate('/products')}>
                    Browse Products
                </Button>
            </div>
        );
    }

    return (
        <Container className="mt-5">
            <h2>Your Cart</h2>
            <ListGroup>
                {cart.cartItems.map((item) => (
                    <ListGroup.Item key={item.productId}>
                        <Row>
                            <Col>{item.productName}</Col>
                            <Col>
                                <div className="d-flex align-items-center">
                                    <Button
                                        variant="secondary"
                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </Button>
                                    <span
                                        className="mx-2 text-center"
                                        style={{ width: '50px', fontSize: '1.25rem' }}
                                    >
                                        {item.quantity}
                                    </span>
                                    <Button
                                        variant="secondary"
                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                    >
                                        +
                                    </Button>
                                </div>
                            </Col>
                            <Col>Subtotal: <strong>₱ {item.subtotal}</strong></Col>
                            <Col>
                                <Button
                                    variant="danger"
                                    onClick={() => removeItem(item.productId)}
                                >
                                    Remove
                                </Button>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <h3>Total: ₱ {cart.totalPrice}</h3>
            <Button variant="warning" onClick={clearCart} className="mt-3">
                Clear Cart
            </Button>
            <Button variant="success" onClick={checkout} className="mt-3 ml-2">
                Checkout
            </Button>
        </Container>
    );
}