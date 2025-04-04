import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

export default function UserView() {

    const [products, setProducts] = useState([]);

    const fetchData = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}` 
            }
        })
        .then(response => response.json())
        .then(data => {
            setProducts(data);  
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
    };

    useEffect(() => {
        fetchData();  
    }, []);

    return (
        <>
            {products.map(product => (
                <ProductCard productProp={product} key={product._id} />
            ))}
        </>
    );
}
