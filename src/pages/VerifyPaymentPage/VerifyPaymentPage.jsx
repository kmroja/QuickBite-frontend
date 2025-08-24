import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../CartContext/CartContext';

const VerifyPaymentPage = () => {
    const { clearCart } = useCart();
    const { search } = useLocation();
    const navigate = useNavigate();
    const [statusMsg, setStatusMsg] = useState('Verifying payment…');
    const [loading, setLoading] = useState(true); // Loading state

    // Grab token from localStorage
    const token = localStorage.getItem('authToken');
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    useEffect(() => {
        const params = new URLSearchParams(search);
        const success = params.get('success');
        const session_id = params.get('session_id');

        // Cancelled or missing session:
        if (success !== 'true' || !session_id) {
            if (success === 'false') {
                // User explicitly cancelled
                setStatusMsg('Payment was cancelled.');
                setLoading(false);
                return;
            }
            setStatusMsg('Payment was not completed.');
            setLoading(false);
            return;
        }

        // Stripe says success=true & we have a session_id:
        axios.get('https://quickbite-backend-6dvr.onrender.com/api/orders/confirm', {
            params: { session_id },
            headers: authHeaders
        })
            .then(response => {
                // Check if the order was confirmed successfully
                if (response.data) {
                    clearCart(); // Clear the cart on successful confirmation
                    navigate('/myorder', { replace: true });
                } else {
                    setStatusMsg('Payment confirmation failed.');
                }
            })
            .catch(err => {
                console.error('Confirmation error:', err);
                setStatusMsg('There was an error confirming your payment.');
            })
            .finally(() => {
                setLoading(false); // Stop loading regardless of success or failure
            });
    }, [search, clearCart, navigate, authHeaders]);

    return (
        <div className="min-h-screen flex items-center justify-center text-white">
            {loading ? <p>{statusMsg}</p> : <p>{statusMsg}</p>}
        </div>
    );
};

export default VerifyPaymentPage;
