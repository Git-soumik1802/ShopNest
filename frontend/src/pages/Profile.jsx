import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders/myorders', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });

        const data = await res.json();

        if (res.ok) {
          setOrders(Array.isArray(data) ? data : []);
        } else {
          if (res.status === 401) {
            logout();
            navigate('/login');
          }
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user, navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const containerStyle = {
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '35px',
    background: 'rgba(24,24,27,0.8)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#fafafa',
    boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
  };

  const badgeStyle = {
    background: 'linear-gradient(135deg, #f97316, #fb923c)',
    color: '#fff',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    display: 'inline-block',
    letterSpacing: '0.5px'
  };

  const cardStyle = {
    background: 'linear-gradient(145deg, #09090b, #18181b)',
    padding: '22px',
    borderRadius: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    border: '1px solid rgba(255,255,255,0.05)',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
  };

  if (!user) return null;

  return (
    <div style={containerStyle}>
      {/* PROFILE HEADER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: '30px',
        marginBottom: '30px'
      }}>
        <div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '10px' }}>
            My Profile
          </h2>
          <p style={{ color: '#a1a1aa' }}>
            <strong>Name:</strong> {user.name}
          </p>
          <p style={{ color: '#a1a1aa', marginBottom: '10px' }}>
            <strong>Email:</strong> {user.email}
          </p>
          <span style={badgeStyle}>
            {user.role?.toUpperCase()}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="btn"
          style={{
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            borderRadius: '8px',
            padding: '10px 18px',
            fontWeight: '600',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* ORDERS */}
      <h3 style={{ color: '#f97316', marginBottom: '20px' }}>
        Order History
      </h3>

      {loading ? (
        <p>Fetching your orders...</p>
      ) : orders.length === 0 ? (
        <div style={{
          background: '#09090b',
          padding: '30px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p>You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn">Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {orders.map(order => (
            <div
              key={order._id}
              style={cardStyle}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div>
                <p><strong>Order ID:</strong> {order._id}</p>
                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Total:</strong> ₹{order.totalAmount?.toFixed(2)}
                </p>
              </div>

              <span style={{
                color: '#fff',
                background:
                  order.status === 'Delivered'
                    ? '#10b981'
                    : order.status === 'Pending'
                      ? '#f59e0b'
                      : '#ef4444',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '600',
                height: 'fit-content'
              }}>
                {order.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;